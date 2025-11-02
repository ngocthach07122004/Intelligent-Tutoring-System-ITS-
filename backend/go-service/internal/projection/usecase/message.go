package usecase

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"init-src/internal/models"
	"init-src/internal/projection"
)

// ProjectMessageCreated updates Redis projections after a message is created
func (uc *implUsecase) ProjectMessageCreated(ctx context.Context, msg models.Message, participants []string) error {
	convID := msg.ConversationID.String()
	msgID := msg.ID.String()

	// 1. Update conversation list for all participants (ZADD)
	timestamp := msg.CreatedAt.UnixMilli()
	for _, userID := range participants {
		if err := uc.repo.AddToConversationList(ctx, userID, convID, timestamp); err != nil {
			uc.l.Errorf(ctx, "projection.usecase.ProjectMessageCreated.AddToConversationList", err)
			return err
		}

		// Limit conversation list to 500 most recent
		if err := uc.repo.LimitConversationList(ctx, userID, projection.ConversationListLimit); err != nil {
			uc.l.Warnf(ctx, "projection.usecase.ProjectMessageCreated.LimitConversationList: %v", err)
			// Non-critical, continue
		}
	}

	// 2. Update conversation metadata
	lastMsgText := msg.Content
	if len(lastMsgText) > projection.MessageTextPreview {
		lastMsgText = lastMsgText[:projection.MessageTextPreview] + "..."
	}

	metaFields := map[string]interface{}{
		"last_msg_id":     msgID,
		"last_msg_text":   lastMsgText,
		"last_msg_at":     timestamp,
		"last_msg_sender": msg.SenderID,
	}

	if err := uc.repo.SetConversationMeta(ctx, convID, metaFields); err != nil {
		uc.l.Errorf(ctx, "projection.usecase.ProjectMessageCreated.SetConversationMeta", err)
		return err
	}

	// 3. Increment unread counter for all participants except sender
	for _, userID := range participants {
		if userID == msg.SenderID {
			continue // Skip sender
		}

		if err := uc.repo.IncrementUnread(ctx, convID, userID); err != nil {
			uc.l.Warnf(ctx, "projection.usecase.ProjectMessageCreated.IncrementUnread: %v", err)
			// Non-critical, continue
		}
	}

	// 4. Cache message with 30-day TTL
	msgFields := map[string]interface{}{
		"id":              msgID,
		"conversation_id": convID,
		"sender_id":       msg.SenderID,
		"seq":             msg.Seq,
		"content":         msg.Content,
		"created_at":      msg.CreatedAt.Format(time.RFC3339),
	}

	if msg.ReplyToID != nil {
		msgFields["reply_to_id"] = msg.ReplyToID.String()
	}

	if err := uc.repo.CacheMessage(ctx, msgID, msgFields, int64(projection.MessageCacheTTL.Seconds())); err != nil {
		uc.l.Warnf(ctx, "projection.usecase.ProjectMessageCreated.CacheMessage: %v", err)
		// Non-critical, continue
	}

	// 5. Publish WebSocket event
	wsChannel := fmt.Sprintf("ws:conv:%s", convID)
	event := map[string]interface{}{
		"type": "message.created",
		"data": map[string]interface{}{
			"message": map[string]interface{}{
				"id":              msgID,
				"conversation_id": convID,
				"sender_id":       msg.SenderID,
				"seq":             msg.Seq,
				"content":         msg.Content,
				"created_at":      msg.CreatedAt.Format(time.RFC3339),
			},
		},
	}

	eventJSON, _ := json.Marshal(event)
	if err := uc.repo.PublishEvent(ctx, wsChannel, string(eventJSON)); err != nil {
		uc.l.Warnf(ctx, "projection.usecase.ProjectMessageCreated.PublishEvent: %v", err)
		// Non-critical
	}

	uc.l.Infof(ctx, "projection.usecase.ProjectMessageCreated: message=%s, conv=%s", msgID, convID)
	return nil
}

// ProjectMessageEdited updates Redis projections after a message is edited
func (uc *implUsecase) ProjectMessageEdited(ctx context.Context, msg models.Message, participants []string) error {
	convID := msg.ConversationID.String()
	msgID := msg.ID.String()

	// 1. Update message cache
	msgFields := map[string]interface{}{
		"content": msg.Content,
	}

	if msg.EditedAt != nil {
		msgFields["edited_at"] = msg.EditedAt.Format(time.RFC3339)
	}

	if err := uc.repo.UpdateMessageCache(ctx, msgID, msgFields); err != nil {
		uc.l.Warnf(ctx, "projection.usecase.ProjectMessageEdited.UpdateMessageCache: %v", err)
	}

	// 2. Update conversation metadata if this is the last message
	lastMsgID, err := uc.repo.GetConversationMeta(ctx, convID, "last_msg_id")
	if err == nil && lastMsgID == msgID {
		// Update last_msg_text
		lastMsgText := msg.Content
		if len(lastMsgText) > projection.MessageTextPreview {
			lastMsgText = lastMsgText[:projection.MessageTextPreview] + "..."
		}

		if err := uc.repo.SetConversationMeta(ctx, convID, map[string]interface{}{
			"last_msg_text": lastMsgText,
		}); err != nil {
			uc.l.Warnf(ctx, "projection.usecase.ProjectMessageEdited.SetConversationMeta: %v", err)
		}
	}

	// 3. Publish WebSocket event
	wsChannel := fmt.Sprintf("ws:conv:%s", convID)
	event := map[string]interface{}{
		"type": "message.edited",
		"data": map[string]interface{}{
			"message": map[string]interface{}{
				"id":         msgID,
				"content":    msg.Content,
				"edited_at":  msg.EditedAt,
				"updated_at": time.Now().Format(time.RFC3339),
			},
		},
	}

	eventJSON, _ := json.Marshal(event)
	if err := uc.repo.PublishEvent(ctx, wsChannel, string(eventJSON)); err != nil {
		uc.l.Warnf(ctx, "projection.usecase.ProjectMessageEdited.PublishEvent: %v", err)
	}

	uc.l.Infof(ctx, "projection.usecase.ProjectMessageEdited: message=%s", msgID)
	return nil
}

// ProjectMessageDeleted updates Redis projections after a message is deleted
func (uc *implUsecase) ProjectMessageDeleted(ctx context.Context, messageID string, conversationID string, participants []string) error {
	// 1. Remove message cache
	if err := uc.repo.DeleteMessageCache(ctx, messageID); err != nil {
		uc.l.Warnf(ctx, "projection.usecase.ProjectMessageDeleted.DeleteMessageCache: %v", err)
	}

	// 2. Publish WebSocket event
	wsChannel := fmt.Sprintf("ws:conv:%s", conversationID)
	event := map[string]interface{}{
		"type": "message.deleted",
		"data": map[string]interface{}{
			"message_id":      messageID,
			"conversation_id": conversationID,
		},
	}

	eventJSON, _ := json.Marshal(event)
	if err := uc.repo.PublishEvent(ctx, wsChannel, string(eventJSON)); err != nil {
		uc.l.Warnf(ctx, "projection.usecase.ProjectMessageDeleted.PublishEvent: %v", err)
	}

	uc.l.Infof(ctx, "projection.usecase.ProjectMessageDeleted: message=%s", messageID)
	return nil
}
