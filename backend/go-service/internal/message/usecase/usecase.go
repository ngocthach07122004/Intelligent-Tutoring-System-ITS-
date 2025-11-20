package usecase

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"init-src/internal/message"
	"init-src/internal/models"
	"init-src/internal/outbox"

	"github.com/google/uuid"
)

func (uc *implUsecase) Send(ctx context.Context, sc models.Scope, input message.SendInput) (models.Message, error) {
	// Validate input
	if strings.TrimSpace(input.ConversationID) == "" {
		return models.Message{}, fmt.Errorf("conversation ID cannot be empty")
	}
	if strings.TrimSpace(input.Content) == "" {
		return models.Message{}, fmt.Errorf("message content cannot be empty")
	}

	// Check if user is participant
	isParticipant, err := uc.conversationRepo.IsParticipant(ctx, input.ConversationID, sc.UserID)
	if err != nil {
		uc.l.Warnf(ctx, "message.Usecase.Send.IsParticipant error: %v", err)
		return models.Message{}, err
	}
	if !isParticipant {
		return models.Message{}, ErrNotParticipant
	}

	// Get conversation participants for event
	participants, err := uc.conversationRepo.GetParticipants(ctx, input.ConversationID)
	if err != nil {
		uc.l.Warnf(ctx, "message.Usecase.Send.GetParticipants error: %v", err)
		return models.Message{}, err
	}

	// Begin transaction
	tx, err := uc.db.BeginTx(ctx)
	if err != nil {
		uc.l.Warnf(ctx, "message.Usecase.Send.BeginTx error: %v", err)
		return models.Message{}, err
	}
	defer tx.Rollback(ctx)

	// Create message
	msg, err := uc.repo.Create(ctx, tx, message.CreateOptions{
		ConversationID: input.ConversationID,
		SenderID:       sc.UserID,
		Type:           models.MessageTypeText,
		Content:        input.Content,
		Attachments:    input.Attachments,
		ReplyToID:      input.ReplyToID,
	})
	if err != nil {
		uc.l.Warnf(ctx, "message.Usecase.Send.Create error: %v", err)
		return models.Message{}, err
	}

	// Build participant user IDs list
	participantIDs := make([]string, 0, len(participants))
	for _, p := range participants {
		if p.LeftAt == nil {
			participantIDs = append(participantIDs, p.UserID)
		}
	}

	// Create outbox event
	eventPayload := map[string]interface{}{
		"message":      msg,
		"participants": participantIDs,
		"timestamp":    time.Now().Format(time.RFC3339),
	}
	payloadJSON, _ := json.Marshal(eventPayload)

	_, err = uc.outboxRepo.Create(ctx, tx, outbox.CreateOptions{
		AggregateType: "message",
		AggregateID:   msg.ID,
		EventType:     models.EventMessageCreated,
		Payload:       string(payloadJSON),
	})
	if err != nil {
		uc.l.Warnf(ctx, "message.Usecase.Send.CreateOutbox error: %v", err)
		return models.Message{}, err
	}

	// Commit transaction
	if err := tx.Commit(ctx); err != nil {
		uc.l.Warnf(ctx, "message.Usecase.Send.Commit error: %v", err)
		return models.Message{}, err
	}

	return msg, nil
}

func (uc *implUsecase) List(ctx context.Context, sc models.Scope, input message.ListInput) ([]models.Message, error) {
	// Validate input
	if strings.TrimSpace(input.Filter.ConversationID) == "" {
		return nil, fmt.Errorf("conversation ID cannot be empty")
	}

	// Check if user is participant
	isParticipant, err := uc.conversationRepo.IsParticipant(ctx, input.Filter.ConversationID, sc.UserID)
	if err != nil {
		uc.l.Warnf(ctx, "message.Usecase.List.IsParticipant error: %v", err)
		return nil, err
	}
	if !isParticipant {
		return nil, ErrNotParticipant
	}

	// Convert Input to Options for repository
	messages, err := uc.repo.List(ctx, sc, message.ListOptions{
		Filter: input.Filter,
	})
	if err != nil {
		uc.l.Warnf(ctx, "message.Usecase.List error: %v", err)
		return nil, err
	}

	return messages, nil
}

func (uc *implUsecase) Get(ctx context.Context, sc models.Scope, input message.GetInput) (message.GetOutput, error) {
	// Validate input
	if strings.TrimSpace(input.Filter.ConversationID) == "" {
		return message.GetOutput{}, fmt.Errorf("conversation ID cannot be empty")
	}

	// Check if user is participant
	isParticipant, err := uc.conversationRepo.IsParticipant(ctx, input.Filter.ConversationID, sc.UserID)
	if err != nil {
		uc.l.Warnf(ctx, "message.Usecase.Get.IsParticipant error: %v", err)
		return message.GetOutput{}, err
	}
	if !isParticipant {
		return message.GetOutput{}, ErrNotParticipant
	}

	// Convert Input to Options for repository
	messages, pag, err := uc.repo.Get(ctx, sc, message.GetOptions{
		Filter: input.Filter,
		Pagin:  input.Pagin,
	})
	if err != nil {
		uc.l.Warnf(ctx, "message.Usecase.Get error: %v", err)
		return message.GetOutput{}, err
	}

	return message.GetOutput{
		Messages: messages,
		Pagin:    pag,
	}, nil
}

func (uc *implUsecase) GetOne(ctx context.Context, sc models.Scope, input message.GetOneInput) (message.GetOneOutput, error) {
	// Validate input
	if strings.TrimSpace(input.Filter.ID) == "" {
		return message.GetOneOutput{}, fmt.Errorf("message ID cannot be empty")
	}
	if strings.TrimSpace(input.Filter.ConversationID) == "" {
		return message.GetOneOutput{}, fmt.Errorf("conversation ID cannot be empty")
	}

	// Get message
	msg, err := uc.repo.GetByID(ctx, input.Filter.ID)
	if err != nil {
		uc.l.Warnf(ctx, "message.Usecase.GetOne.GetByID error: %v", err)
		if strings.Contains(err.Error(), "no rows") {
			return message.GetOneOutput{}, ErrNotFound
		}
		return message.GetOneOutput{}, err
	}

	// ⚠️ CRITICAL: Validate message belongs to the conversation in URL
	if msg.ConversationID.String() != input.Filter.ConversationID {
		return message.GetOneOutput{}, ErrMessageNotInConversation
	}

	// Check if user is participant of the conversation
	isParticipant, err := uc.conversationRepo.IsParticipant(ctx, msg.ConversationID.String(), sc.UserID)
	if err != nil {
		uc.l.Warnf(ctx, "message.Usecase.GetOne.IsParticipant error: %v", err)
		return message.GetOneOutput{}, err
	}
	if !isParticipant {
		return message.GetOneOutput{}, ErrNotParticipant
	}

	return message.GetOneOutput{
		Message: msg,
	}, nil
}

func (uc *implUsecase) Edit(ctx context.Context, sc models.Scope, input message.EditMessageInput) (models.Message, error) {
	// Validate input
	if strings.TrimSpace(input.Filter.ID) == "" {
		return models.Message{}, fmt.Errorf("message ID cannot be empty")
	}
	if strings.TrimSpace(input.Filter.ConversationID) == "" {
		return models.Message{}, fmt.Errorf("conversation ID cannot be empty")
	}
	if strings.TrimSpace(input.Content) == "" {
		return models.Message{}, fmt.Errorf("message content cannot be empty")
	}

	// Get existing message
	msg, err := uc.repo.GetByID(ctx, input.Filter.ID)
	if err != nil {
		uc.l.Warnf(ctx, "message.Usecase.Edit.GetByID error: %v", err)
		if strings.Contains(err.Error(), "no rows") {
			return models.Message{}, ErrNotFound
		}
		return models.Message{}, err
	}

	// ⚠️ CRITICAL: Validate message belongs to the conversation in URL
	if msg.ConversationID.String() != input.Filter.ConversationID {
		return models.Message{}, ErrMessageNotInConversation
	}

	// Check if user is the sender
	if msg.SenderID != sc.UserID {
		return models.Message{}, ErrNotSender
	}

	// Cannot edit system messages
	if msg.Type == models.MessageTypeSystem {
		return models.Message{}, ErrCannotEditSystemMessage
	}

	// Begin transaction
	tx, err := uc.db.BeginTx(ctx)
	if err != nil {
		uc.l.Warnf(ctx, "message.Usecase.Edit.BeginTx error: %v", err)
		return models.Message{}, err
	}
	defer tx.Rollback(ctx)

	// Update message
	updated, err := uc.repo.Update(ctx, tx, input.Filter.ID, message.UpdateOptions{
		Message: msg,
		Content: input.Content,
	})
	if err != nil {
		uc.l.Warnf(ctx, "message.Usecase.Edit.Update error: %v", err)
		return models.Message{}, err
	}

	// Get conversation participants for event
	participants, err := uc.conversationRepo.GetParticipants(ctx, msg.ConversationID.String())
	if err != nil {
		uc.l.Warnf(ctx, "message.Usecase.Edit.GetParticipants error: %v", err)
		return models.Message{}, err
	}

	// Build participant user IDs list
	participantIDs := make([]string, 0, len(participants))
	for _, p := range participants {
		if p.LeftAt == nil {
			participantIDs = append(participantIDs, p.UserID)
		}
	}

	// Create outbox event
	eventPayload := map[string]interface{}{
		"message":      updated,
		"participants": participantIDs,
		"timestamp":    time.Now().Format(time.RFC3339),
	}
	payloadJSON, _ := json.Marshal(eventPayload)

	_, err = uc.outboxRepo.Create(ctx, tx, outbox.CreateOptions{
		AggregateType: "message",
		AggregateID:   updated.ID,
		EventType:     models.EventMessageEdited,
		Payload:       string(payloadJSON),
	})
	if err != nil {
		uc.l.Warnf(ctx, "message.Usecase.Edit.CreateOutbox error: %v", err)
		return models.Message{}, err
	}

	// Commit transaction
	if err := tx.Commit(ctx); err != nil {
		uc.l.Warnf(ctx, "message.Usecase.Edit.Commit error: %v", err)
		return models.Message{}, err
	}

	return updated, nil
}

func (uc *implUsecase) Delete(ctx context.Context, sc models.Scope, input message.DeleteInput) (string, error) {
	// Validate input
	if strings.TrimSpace(input.Filter.ID) == "" {
		return "", fmt.Errorf("message ID cannot be empty")
	}
	if strings.TrimSpace(input.Filter.ConversationID) == "" {
		return "", fmt.Errorf("conversation ID cannot be empty")
	}

	// Get existing message
	msg, err := uc.repo.GetByID(ctx, input.Filter.ID)
	if err != nil {
		uc.l.Warnf(ctx, "message.Usecase.Delete.GetByID error: %v", err)
		if strings.Contains(err.Error(), "no rows") {
			return "", ErrNotFound
		}
		return "", err
	}

	// ⚠️ CRITICAL: Validate message belongs to the conversation in URL
	if msg.ConversationID.String() != input.Filter.ConversationID {
		return "", ErrMessageNotInConversation
	}

	// Check if user is the sender
	if msg.SenderID != sc.UserID {
		return "", ErrNotSender
	}

	// Begin transaction
	tx, err := uc.db.BeginTx(ctx)
	if err != nil {
		uc.l.Warnf(ctx, "message.Usecase.Delete.BeginTx error: %v", err)
		return "", err
	}
	defer tx.Rollback(ctx)

	// Delete message
	result, err := uc.repo.Delete(ctx, tx, input.Filter.ID)
	if err != nil {
		uc.l.Warnf(ctx, "message.Usecase.Delete error: %v", err)
		return "", err
	}

	// Get conversation participants for event
	participants, err := uc.conversationRepo.GetParticipants(ctx, msg.ConversationID.String())
	if err != nil {
		uc.l.Warnf(ctx, "message.Usecase.Delete.GetParticipants error: %v", err)
		return "", err
	}

	// Build participant user IDs list
	participantIDs := make([]string, 0, len(participants))
	for _, p := range participants {
		if p.LeftAt == nil {
			participantIDs = append(participantIDs, p.UserID)
		}
	}

	// Create outbox event
	eventPayload := map[string]interface{}{
		"message_id":      input.Filter.ID,
		"conversation_id": msg.ConversationID.String(),
		"participants":    participantIDs,
		"timestamp":       time.Now().Format(time.RFC3339),
	}
	payloadJSON, _ := json.Marshal(eventPayload)

	msgUUID, _ := uuid.Parse(input.Filter.ID)
	_, err = uc.outboxRepo.Create(ctx, tx, outbox.CreateOptions{
		AggregateType: "message",
		AggregateID:   msgUUID,
		EventType:     models.EventMessageDeleted,
		Payload:       string(payloadJSON),
	})
	if err != nil {
		uc.l.Warnf(ctx, "message.Usecase.Delete.CreateOutbox error: %v", err)
		return "", err
	}

	// Commit transaction
	if err := tx.Commit(ctx); err != nil {
		uc.l.Warnf(ctx, "message.Usecase.Delete.Commit error: %v", err)
		return "", err
	}

	return result, nil
}

func (uc *implUsecase) Search(ctx context.Context, sc models.Scope, input message.SearchInput) ([]models.Message, error) {
	// Validate input
	if strings.TrimSpace(input.ConversationID) == "" {
		return nil, fmt.Errorf("conversation ID cannot be empty")
	}
	if strings.TrimSpace(input.Query) == "" {
		return nil, fmt.Errorf("search query cannot be empty")
	}

	// Check if user is participant
	isParticipant, err := uc.conversationRepo.IsParticipant(ctx, input.ConversationID, sc.UserID)
	if err != nil {
		uc.l.Warnf(ctx, "message.Usecase.Search.IsParticipant error: %v", err)
		return nil, err
	}
	if !isParticipant {
		return nil, ErrNotParticipant
	}

	// Search with limit of 50
	messages, err := uc.repo.Search(ctx, input.ConversationID, input.Query, 50)
	if err != nil {
		uc.l.Warnf(ctx, "message.Usecase.Search error: %v", err)
		return nil, err
	}

	return messages, nil
}

func (uc *implUsecase) SearchGlobal(ctx context.Context, sc models.Scope, input message.SearchGlobalInput) ([]models.Message, error) {
	// Validate input
	if strings.TrimSpace(input.Query) == "" {
		return nil, fmt.Errorf("search query cannot be empty")
	}

	// Search across all conversations user is part of, limit 100
	messages, err := uc.repo.SearchGlobal(ctx, sc.UserID, input.Query, 100)
	if err != nil {
		uc.l.Warnf(ctx, "message.Usecase.SearchGlobal error: %v", err)
		return nil, err
	}

	return messages, nil
}
