package usecase

import (
	"context"
	"encoding/json"
	"fmt"

	"init-src/internal/models"
	"init-src/internal/notification"
	"init-src/pkg/util"
)

// HandleMessageCreatedNotification handles notification generation for new messages
func (uc *implUsecase) HandleMessageCreatedNotification(ctx context.Context, msg models.Message, participants []string) error {
	// Create notification for each participant except the sender
	for _, userID := range participants {
		if userID == msg.SenderID {
			continue // Skip sender
		}

		// Prepare notification data
		msgID := msg.ID
		convID := msg.ConversationID
		data := fmt.Sprintf(`{"message_id":"%s","conversation_id":"%s","sender_id":"%s"}`,
			msgID.String(), convID.String(), msg.SenderID)

		// Create notification
		msgIDStr := msgID.String()
		input := notification.CreateInput{
			UserID:     userID,
			Type:       models.NotificationNewMessage,
			Title:      "New message",
			Body:       util.TruncateString(msg.Content, 100),
			EntityType: util.StringPtr("message"),
			EntityID:   &msgIDStr,
			Data:       &data,
		}

		createdNotif, err := uc.Create(ctx, input)
		if err != nil {
			uc.l.Errorf(ctx, "notification.usecase.HandleMessageCreatedNotification.Create: user=%s, err=%v", userID, err)
			// Continue to next participant even if one fails
			continue
		}

		// Publish notification event to Redis Pub/Sub for WebSocket broadcasting
		if err := uc.publishNotificationEvent(ctx, userID, createdNotif); err != nil {
			uc.l.Warnf(ctx, "notification.usecase.HandleMessageCreatedNotification.Publish: user=%s, err=%v", userID, err)
			// Non-critical, continue
		}

		uc.l.Infof(ctx, "notification.usecase.HandleMessageCreatedNotification: created notification for user=%s, msg=%s", userID, msgID.String())
	}

	return nil
}

// HandleClassMemberAddedNotification handles notification generation for class invitations
func (uc *implUsecase) HandleClassMemberAddedNotification(ctx context.Context, class models.Class, member models.ClassMember) error {
	// Prepare notification data
	classID := class.ID
	data := fmt.Sprintf(`{"class_id":"%s","class_name":"%s","role":"%s"}`,
		classID.String(), class.Name, member.Role)

	// Create notification
	classIDStr := classID.String()
	input := notification.CreateInput{
		UserID:     member.UserID,
		Type:       models.NotificationClassInvite,
		Title:      "Class invitation",
		Body:       fmt.Sprintf("You have been added to class: %s", class.Name),
		EntityType: util.StringPtr("class"),
		EntityID:   &classIDStr,
		Data:       &data,
	}

	createdNotif, err := uc.Create(ctx, input)
	if err != nil {
		uc.l.Errorf(ctx, "notification.usecase.HandleClassMemberAddedNotification.Create", err)
		return err
	}

	// Publish notification event to Redis Pub/Sub for WebSocket broadcasting
	if err := uc.publishNotificationEvent(ctx, member.UserID, createdNotif); err != nil {
		uc.l.Warnf(ctx, "notification.usecase.HandleClassMemberAddedNotification.Publish: user=%s, err=%v", member.UserID, err)
		// Non-critical
	}

	uc.l.Infof(ctx, "notification.usecase.HandleClassMemberAddedNotification: created notification for user=%s, class=%s", member.UserID, classID.String())
	return nil
}

// publishNotificationEvent publishes notification event to Redis Pub/Sub channel
func (uc *implUsecase) publishNotificationEvent(ctx context.Context, userID string, notif models.Notification) error {
	wsChannel := fmt.Sprintf("ws:user:%s", userID)
	event := map[string]interface{}{
		"type": "notification.new",
		"data": map[string]interface{}{
			"notification": notif,
		},
	}

	eventJSON, err := json.Marshal(event)
	if err != nil {
		return fmt.Errorf("failed to marshal event: %w", err)
	}

	if err := uc.redis.Publish(ctx, wsChannel, string(eventJSON)); err != nil {
		return fmt.Errorf("failed to publish to Redis: %w", err)
	}

	return nil
}
