package usecase

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"init-src/internal/models"
)

// ProjectConversationCreated updates Redis projections after a conversation is created
func (uc *implUsecase) ProjectConversationCreated(ctx context.Context, conv models.Conversation, participants []models.ConversationParticipant) error {
	convID := conv.ID.String()
	timestamp := conv.CreatedAt.UnixMilli()

	// 1. Add conversation to each participant's list
	for _, participant := range participants {
		if participant.LeftAt != nil {
			continue // Skip if already left
		}

		if err := uc.repo.AddToConversationList(ctx, participant.UserID, convID, timestamp); err != nil {
			uc.l.Errorf(ctx, "projection.usecase.ProjectConversationCreated.AddToConversationList", err)
			return err
		}
	}

	// 2. Set conversation metadata
	metaFields := map[string]interface{}{
		"type": string(conv.Type),
	}

	if conv.Name != nil {
		metaFields["name"] = *conv.Name
	}

	if err := uc.repo.SetConversationMeta(ctx, convID, metaFields); err != nil {
		uc.l.Errorf(ctx, "projection.usecase.ProjectConversationCreated.SetConversationMeta", err)
		return err
	}

	// 3. Add participants to set
	for _, participant := range participants {
		if participant.LeftAt == nil {
			if err := uc.repo.AddParticipant(ctx, convID, participant.UserID); err != nil {
				uc.l.Warnf(ctx, "projection.usecase.ProjectConversationCreated.AddParticipant: %v", err)
			}
		}
	}

	// 4. Publish WebSocket event to each participant
	for _, participant := range participants {
		if participant.LeftAt != nil {
			continue
		}

		wsChannel := fmt.Sprintf("ws:user:%s", participant.UserID)
		event := map[string]interface{}{
			"type": "conversation.created",
			"data": map[string]interface{}{
				"conversation": map[string]interface{}{
					"id":         convID,
					"type":       string(conv.Type),
					"name":       conv.Name,
					"created_at": conv.CreatedAt.Format(time.RFC3339),
				},
			},
		}

		eventJSON, _ := json.Marshal(event)
		if err := uc.repo.PublishEvent(ctx, wsChannel, string(eventJSON)); err != nil {
			uc.l.Warnf(ctx, "projection.usecase.ProjectConversationCreated.PublishEvent: %v", err)
		}
	}

	uc.l.Infof(ctx, "projection.usecase.ProjectConversationCreated: conv=%s", convID)
	return nil
}

// ProjectParticipantJoined updates Redis projections after a participant joins
func (uc *implUsecase) ProjectParticipantJoined(ctx context.Context, conv models.Conversation, participant models.ConversationParticipant) error {
	convID := conv.ID.String()
	userID := participant.UserID

	// 1. Add conversation to user's list
	timestamp := participant.JoinedAt.UnixMilli()
	if err := uc.repo.AddToConversationList(ctx, userID, convID, timestamp); err != nil {
		uc.l.Errorf(ctx, "projection.usecase.ProjectParticipantJoined.AddToConversationList", err)
		return err
	}

	// 2. Add participant to set
	if err := uc.repo.AddParticipant(ctx, convID, userID); err != nil {
		uc.l.Warnf(ctx, "projection.usecase.ProjectParticipantJoined.AddParticipant: %v", err)
	}

	// 3. Publish WebSocket event
	wsChannel := fmt.Sprintf("ws:conv:%s", convID)
	event := map[string]interface{}{
		"type": "participant.joined",
		"data": map[string]interface{}{
			"conversation_id": convID,
			"user_id":         userID,
			"joined_at":       participant.JoinedAt.Format(time.RFC3339),
		},
	}

	eventJSON, _ := json.Marshal(event)
	if err := uc.repo.PublishEvent(ctx, wsChannel, string(eventJSON)); err != nil {
		uc.l.Warnf(ctx, "projection.usecase.ProjectParticipantJoined.PublishEvent: %v", err)
	}

	uc.l.Infof(ctx, "projection.usecase.ProjectParticipantJoined: conv=%s, user=%s", convID, userID)
	return nil
}

// ProjectParticipantLeft updates Redis projections after a participant leaves
func (uc *implUsecase) ProjectParticipantLeft(ctx context.Context, conversationID string, userID string) error {
	// 1. Remove conversation from user's list
	if err := uc.repo.RemoveFromConversationList(ctx, userID, conversationID); err != nil {
		uc.l.Warnf(ctx, "projection.usecase.ProjectParticipantLeft.RemoveFromConversationList: %v", err)
	}

	// 2. Remove participant from set
	if err := uc.repo.RemoveParticipant(ctx, conversationID, userID); err != nil {
		uc.l.Warnf(ctx, "projection.usecase.ProjectParticipantLeft.RemoveParticipant: %v", err)
	}

	// 3. Reset unread counter
	if err := uc.repo.ResetUnread(ctx, conversationID, userID); err != nil {
		uc.l.Warnf(ctx, "projection.usecase.ProjectParticipantLeft.ResetUnread: %v", err)
	}

	// 4. Publish WebSocket event
	wsChannel := fmt.Sprintf("ws:conv:%s", conversationID)
	event := map[string]interface{}{
		"type": "participant.left",
		"data": map[string]interface{}{
			"conversation_id": conversationID,
			"user_id":         userID,
		},
	}

	eventJSON, _ := json.Marshal(event)
	if err := uc.repo.PublishEvent(ctx, wsChannel, string(eventJSON)); err != nil {
		uc.l.Warnf(ctx, "projection.usecase.ProjectParticipantLeft.PublishEvent: %v", err)
	}

	uc.l.Infof(ctx, "projection.usecase.ProjectParticipantLeft: conv=%s, user=%s", conversationID, userID)
	return nil
}

// ProjectLastReadSeq updates Redis projections after marking as read
func (uc *implUsecase) ProjectLastReadSeq(ctx context.Context, conversationID string, userID string, seq int64) error {
	// Reset unread counter to 0
	if err := uc.repo.ResetUnread(ctx, conversationID, userID); err != nil {
		uc.l.Warnf(ctx, "projection.usecase.ProjectLastReadSeq.ResetUnread: %v", err)
		return err
	}

	// Publish WebSocket event
	wsChannel := fmt.Sprintf("ws:user:%s", userID)
	event := map[string]interface{}{
		"type": "conversation.read",
		"data": map[string]interface{}{
			"conversation_id": conversationID,
			"last_read_seq":   seq,
		},
	}

	eventJSON, _ := json.Marshal(event)
	if err := uc.repo.PublishEvent(ctx, wsChannel, string(eventJSON)); err != nil {
		uc.l.Warnf(ctx, "projection.usecase.ProjectLastReadSeq.PublishEvent: %v", err)
	}

	uc.l.Infof(ctx, "projection.usecase.ProjectLastReadSeq: conv=%s, user=%s, seq=%d", conversationID, userID, seq)
	return nil
}
