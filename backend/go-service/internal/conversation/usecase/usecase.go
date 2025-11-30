package usecase

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"init-src/internal/conversation"
	"init-src/internal/models"
	"init-src/internal/outbox"

	"github.com/google/uuid"
)

func (uc *implUsecase) Create(ctx context.Context, sc models.Scope, input conversation.CreateInput) (models.Conversation, error) {
	// Validate input based on type
	if err := uc.validateCreateInput(input); err != nil {
		return models.Conversation{}, err
	}

	// For direct conversations, check if already exists
	if input.Type == models.ConversationDirect && len(input.ParticipantIDs) == 1 {
		existing, err := uc.repo.GetDirectConversation(ctx, sc.UserID, input.ParticipantIDs[0])
		if err == nil {
			// Direct conversation already exists
			return existing, nil
		}
		// If error is "not found", continue to create new one
	}

	// Begin transaction
	tx, err := uc.db.BeginTx(ctx)
	if err != nil {
		uc.l.Warnf(ctx, "conversation.Usecase.Create.BeginTx error: %v", err)
		return models.Conversation{}, err
	}
	defer tx.Rollback(ctx)

	// Create conversation
	conv, err := uc.repo.Create(ctx, tx, conversation.CreateOptions{
		Type:      input.Type,
		Name:      input.Name,
		ClassID:   input.ClassID,
		CreatedBy: sc.UserID,
	})
	if err != nil {
		uc.l.Warnf(ctx, "conversation.Usecase.Create error: %v", err)
		return models.Conversation{}, err
	}

	// Add creator as participant
	_, err = uc.repo.AddParticipant(ctx, tx, conversation.AddParticipantOptions{
		ConversationID: conv.ID.String(),
		UserID:         sc.UserID,
	})
	if err != nil {
		uc.l.Warnf(ctx, "conversation.Usecase.Create.AddCreator error: %v", err)
		return models.Conversation{}, err
	}

	// Add other participants
	if len(input.ParticipantIDs) > 0 {
		err = uc.repo.AddParticipants(ctx, tx, conv.ID.String(), input.ParticipantIDs)
		if err != nil {
			uc.l.Warnf(ctx, "conversation.Usecase.Create.AddParticipants error: %v", err)
			return models.Conversation{}, err
		}
	}

	// Create outbox event
	allParticipants := append([]string{sc.UserID}, input.ParticipantIDs...)
	eventPayload := map[string]interface{}{
		"conversation": conv,
		"participants": allParticipants,
		"timestamp":    time.Now().Format(time.RFC3339),
	}
	payloadJSON, _ := json.Marshal(eventPayload)

	_, err = uc.outboxRepo.Create(ctx, tx, outbox.CreateOptions{
		AggregateType: "conversation",
		AggregateID:   conv.ID,
		EventType:     models.EventConversationCreated,
		Payload:       string(payloadJSON),
	})
	if err != nil {
		uc.l.Warnf(ctx, "conversation.Usecase.Create.CreateOutbox error: %v", err)
		return models.Conversation{}, err
	}

	// Commit transaction
	if err := tx.Commit(ctx); err != nil {
		uc.l.Warnf(ctx, "conversation.Usecase.Create.Commit error: %v", err)
		return models.Conversation{}, err
	}

	return conv, nil
}

func (uc *implUsecase) List(ctx context.Context, sc models.Scope, input conversation.ListInput) ([]models.Conversation, error) {
	// Always filter by user's participation
	input.Filter.UserID = sc.UserID
	input.Filter.NotLeftAt = true // Only active conversations

	conversations, err := uc.repo.List(ctx, sc, input)
	if err != nil {
		uc.l.Warnf(ctx, "conversation.Usecase.List error: %v", err)
		return nil, err
	}

	return uc.enrichConversations(ctx, sc.UserID, conversations)
}

func (uc *implUsecase) Get(ctx context.Context, sc models.Scope, input conversation.GetInput) (conversation.GetOutput, error) {
	// Always filter by user's participation
	input.Filter.UserID = sc.UserID
	input.Filter.NotLeftAt = true

	conversations, pag, err := uc.repo.Get(ctx, sc, input)
	if err != nil {
		uc.l.Warnf(ctx, "conversation.Usecase.Get error: %v", err)
		return conversation.GetOutput{}, err
	}

	conversations, err = uc.enrichConversations(ctx, sc.UserID, conversations)
	if err != nil {
		uc.l.Warnf(ctx, "conversation.Usecase.Get.enrichConversations error: %v", err)
		// Continue without enrichment if error
	}

	return conversation.GetOutput{
		Conversations: conversations,
		Pagin:         pag,
	}, nil
}

func (uc *implUsecase) GetOne(ctx context.Context, sc models.Scope, input conversation.GetOneInput) (conversation.GetOneOutput, error) {
	conv, err := uc.repo.GetOne(ctx, sc, input)
	if err != nil {
		uc.l.Warnf(ctx, "conversation.Usecase.GetOne error: %v", err)
		if strings.Contains(err.Error(), "no rows") {
			return conversation.GetOneOutput{}, ErrNotFound
		}
		return conversation.GetOneOutput{}, err
	}

	// Check if user is participant
	isParticipant, err := uc.repo.IsParticipant(ctx, conv.ID.String(), sc.UserID)
	if err != nil {
		uc.l.Warnf(ctx, "conversation.Usecase.GetOne.IsParticipant error: %v", err)
		return conversation.GetOneOutput{}, err
	}
	if !isParticipant {
		return conversation.GetOneOutput{}, ErrNotParticipant
	}

	enriched, _ := uc.enrichConversations(ctx, sc.UserID, []models.Conversation{conv})
	if len(enriched) > 0 {
		conv = enriched[0]
	}

	return conversation.GetOneOutput{
		Conversation: conv,
	}, nil
}

func (uc *implUsecase) Leave(ctx context.Context, sc models.Scope, id string) (string, error) {
	// Check if user is participant
	isParticipant, err := uc.repo.IsParticipant(ctx, id, sc.UserID)
	if err != nil {
		uc.l.Warnf(ctx, "conversation.Usecase.Leave.IsParticipant error: %v", err)
		return "", err
	}
	if !isParticipant {
		return "", ErrNotParticipant
	}

	// Begin transaction
	tx, err := uc.db.BeginTx(ctx)
	if err != nil {
		uc.l.Warnf(ctx, "conversation.Usecase.Leave.BeginTx error: %v", err)
		return "", err
	}
	defer tx.Rollback(ctx)

	// Remove participant (set left_at)
	err = uc.repo.RemoveParticipant(ctx, tx, id, sc.UserID)
	if err != nil {
		uc.l.Warnf(ctx, "conversation.Usecase.Leave.RemoveParticipant error: %v", err)
		return "", err
	}

	// Create outbox event
	eventPayload := map[string]interface{}{
		"conversation_id": id,
		"user_id":         sc.UserID,
		"timestamp":       time.Now().Format(time.RFC3339),
	}
	payloadJSON, _ := json.Marshal(eventPayload)

	convID, _ := uc.parseUUID(id)
	_, err = uc.outboxRepo.Create(ctx, tx, outbox.CreateOptions{
		AggregateType: "conversation",
		AggregateID:   convID,
		EventType:     models.EventParticipantLeft,
		Payload:       string(payloadJSON),
	})
	if err != nil {
		uc.l.Warnf(ctx, "conversation.Usecase.Leave.CreateOutbox error: %v", err)
		return "", err
	}

	// Commit transaction
	if err := tx.Commit(ctx); err != nil {
		uc.l.Warnf(ctx, "conversation.Usecase.Leave.Commit error: %v", err)
		return "", err
	}

	return "Left conversation", nil
}

func (uc *implUsecase) AddParticipants(ctx context.Context, sc models.Scope, conversationID string, input conversation.AddParticipantsInput) error {
	// Get conversation
	conv, err := uc.repo.GetByID(ctx, conversationID)
	if err != nil {
		uc.l.Warnf(ctx, "conversation.Usecase.AddParticipants.GetByID error: %v", err)
		if strings.Contains(err.Error(), "no rows") {
			return ErrNotFound
		}
		return err
	}

	// Check if user is participant
	isParticipant, err := uc.repo.IsParticipant(ctx, conversationID, sc.UserID)
	if err != nil {
		uc.l.Warnf(ctx, "conversation.Usecase.AddParticipants.IsParticipant error: %v", err)
		return err
	}
	if !isParticipant {
		return ErrNotParticipant
	}

	// Can only add participants to group conversations
	if conv.Type != models.ConversationGroup {
		return ErrInvalidInput
	}

	// Begin transaction
	tx, err := uc.db.BeginTx(ctx)
	if err != nil {
		uc.l.Warnf(ctx, "conversation.Usecase.AddParticipants.BeginTx error: %v", err)
		return err
	}
	defer tx.Rollback(ctx)

	// Add participants
	err = uc.repo.AddParticipants(ctx, tx, conversationID, input.UserIDs)
	if err != nil {
		uc.l.Warnf(ctx, "conversation.Usecase.AddParticipants error: %v", err)
		return err
	}

	// Create outbox event for each new participant
	for _, userID := range input.UserIDs {
		eventPayload := map[string]interface{}{
			"conversation_id": conversationID,
			"user_id":         userID,
			"added_by":        sc.UserID,
			"timestamp":       time.Now().Format(time.RFC3339),
		}
		payloadJSON, _ := json.Marshal(eventPayload)

		_, err = uc.outboxRepo.Create(ctx, tx, outbox.CreateOptions{
			AggregateType: "conversation",
			AggregateID:   conv.ID,
			EventType:     models.EventParticipantJoined,
			Payload:       string(payloadJSON),
		})
		if err != nil {
			uc.l.Warnf(ctx, "conversation.Usecase.AddParticipants.CreateOutbox error: %v", err)
			return err
		}
	}

	// Commit transaction
	if err := tx.Commit(ctx); err != nil {
		uc.l.Warnf(ctx, "conversation.Usecase.AddParticipants.Commit error: %v", err)
		return err
	}

	return nil
}

func (uc *implUsecase) GetParticipants(ctx context.Context, sc models.Scope, conversationID string) ([]models.ConversationParticipant, error) {
	// Check if user is participant
	isParticipant, err := uc.repo.IsParticipant(ctx, conversationID, sc.UserID)
	if err != nil {
		uc.l.Warnf(ctx, "conversation.Usecase.GetParticipants.IsParticipant error: %v", err)
		return nil, err
	}
	if !isParticipant {
		return nil, ErrNotParticipant
	}

	participants, err := uc.repo.GetParticipants(ctx, conversationID)
	if err != nil {
		uc.l.Warnf(ctx, "conversation.Usecase.GetParticipants error: %v", err)
		return nil, err
	}

	return participants, nil
}

func (uc *implUsecase) MarkAsRead(ctx context.Context, sc models.Scope, conversationID string, seq int64) error {
	// Check if user is participant
	isParticipant, err := uc.repo.IsParticipant(ctx, conversationID, sc.UserID)
	if err != nil {
		uc.l.Warnf(ctx, "conversation.Usecase.MarkAsRead.IsParticipant error: %v", err)
		return err
	}
	if !isParticipant {
		return ErrNotParticipant
	}

	// Begin transaction
	tx, err := uc.db.BeginTx(ctx)
	if err != nil {
		uc.l.Warnf(ctx, "conversation.Usecase.MarkAsRead.BeginTx error: %v", err)
		return err
	}
	defer tx.Rollback(ctx)

	// Update last_read_seq
	err = uc.repo.UpdateLastReadSeq(ctx, tx, conversationID, sc.UserID, seq)
	if err != nil {
		uc.l.Warnf(ctx, "conversation.Usecase.MarkAsRead error: %v", err)
		return err
	}

	// Commit transaction (no outbox event needed for mark as read)
	if err := tx.Commit(ctx); err != nil {
		uc.l.Warnf(ctx, "conversation.Usecase.MarkAsRead.Commit error: %v", err)
		return err
	}

	return nil
}

// Helper functions

func (uc *implUsecase) validateCreateInput(input conversation.CreateInput) error {
	switch input.Type {
	case models.ConversationDirect:
		// Direct: must have exactly 1 other participant
		if len(input.ParticipantIDs) != 1 {
			return fmt.Errorf("direct conversation must have exactly 1 other participant")
		}
		// Name should be nil for direct
		if input.Name != nil {
			return fmt.Errorf("direct conversation should not have a name")
		}

	case models.ConversationGroup:
		// Group: must have name and at least 1 other participant
		if input.Name == nil || strings.TrimSpace(*input.Name) == "" {
			return fmt.Errorf("group conversation must have a name")
		}
		if len(input.ParticipantIDs) < 1 {
			return fmt.Errorf("group conversation must have at least 1 other participant")
		}

	case models.ConversationClass:
		// Class: must have class_id
		if input.ClassID == nil || *input.ClassID == "" {
			return fmt.Errorf("class conversation must have a class_id")
		}

	default:
		return fmt.Errorf("invalid conversation type: %s", input.Type)
	}

	return nil
}

func (uc *implUsecase) parseUUID(id string) (uuid.UUID, error) {
	convID, err := uuid.Parse(id)
	if err != nil {
		return uuid.UUID{}, fmt.Errorf("invalid UUID: %w", err)
	}
	return convID, nil
}

func (uc *implUsecase) GetClassChannels(ctx context.Context, sc models.Scope, classID string) ([]models.Conversation, error) {
	channels, err := uc.repo.GetClassChannels(ctx, classID)
	if err != nil {
		uc.l.Warnf(ctx, "conversation.Usecase.GetClassChannels error: %v", err)
		return nil, err
	}
	return channels, nil
}

func (uc *implUsecase) CreateClassChannel(ctx context.Context, sc models.Scope, input conversation.CreateChannelInput) (models.Conversation, error) {
	tx, err := uc.db.BeginTx(ctx)
	if err != nil {
		uc.l.Warnf(ctx, "conversation.Usecase.CreateClassChannel.BeginTx error: %v", err)
		return models.Conversation{}, err
	}
	defer tx.Rollback(ctx)

	opts := conversation.CreateOptions{
		Type:      models.ConversationChannel,
		Name:      &input.Name,
		Topic:     &input.Topic,
		Avatar:    &input.Avatar,
		ClassID:   &input.ClassID,
		CreatedBy: sc.UserID,
	}

	conv, err := uc.repo.Create(ctx, tx, opts)
	if err != nil {
		uc.l.Warnf(ctx, "conversation.Usecase.CreateClassChannel.Create error: %v", err)
		return models.Conversation{}, err
	}

	if err := tx.Commit(ctx); err != nil {
		uc.l.Warnf(ctx, "conversation.Usecase.CreateClassChannel.Commit error: %v", err)
		return models.Conversation{}, err
	}

	return conv, nil
}

func (uc *implUsecase) enrichConversations(ctx context.Context, userID string, conversations []models.Conversation) ([]models.Conversation, error) {
	for i, c := range conversations {
		if c.Type == models.ConversationDirect {
			participants, err := uc.repo.GetParticipants(ctx, c.ID.String())
			if err != nil {
				continue
			}

			var otherUserID string
			for _, p := range participants {
				if p.UserID != userID {
					otherUserID = p.UserID
					break
				}
			}

			if otherUserID != "" {
				user, err := uc.userRepo.GetUser(ctx, otherUserID)
				if err == nil {
					name := user.Name
					avatar := user.Avatar
					role := user.Role
					conversations[i].Name = &name
					conversations[i].Avatar = &avatar
					conversations[i].Role = &role
				}
			}
		}
	}
	return conversations, nil
}
