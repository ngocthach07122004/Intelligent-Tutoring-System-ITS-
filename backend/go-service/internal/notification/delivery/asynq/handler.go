package asynq

import (
	"context"
	"encoding/json"
	"fmt"

	"init-src/internal/models"
	"init-src/pkg/asynq"
)

// HandleNewMessage processes new message notification tasks
func (h *handler) HandleNewMessage(ctx context.Context, task *asynq.Task) error {
	// Parse payload
	var payload struct {
		EventType    string         `json:"event_type"`
		Message      models.Message `json:"message"`
		Participants []string       `json:"participants"`
	}

	if err := json.Unmarshal(task.Payload(), &payload); err != nil {
		h.l.Errorf(ctx, "notification.delivery.HandleNewMessage.Unmarshal", err)
		return fmt.Errorf("failed to unmarshal payload: %w", err)
	}

	h.l.Infof(ctx, "notification.delivery.HandleNewMessage: msg=%s", payload.Message.ID.String())

	// Delegate to use case
	if err := h.uc.HandleMessageCreatedNotification(ctx, payload.Message, payload.Participants); err != nil {
		h.l.Errorf(ctx, "notification.delivery.HandleNewMessage.HandleMessageCreatedNotification", err)
		return err
	}

	h.l.Infof(ctx, "notification.delivery.HandleNewMessage: success for msg=%s", payload.Message.ID.String())
	return nil
}

// HandleClassInvite processes class invite notification tasks
func (h *handler) HandleClassInvite(ctx context.Context, task *asynq.Task) error {
	// Parse payload
	var payload struct {
		EventType   string             `json:"event_type"`
		Class       models.Class       `json:"class"`
		ClassMember models.ClassMember `json:"class_member"`
	}

	if err := json.Unmarshal(task.Payload(), &payload); err != nil {
		h.l.Errorf(ctx, "notification.delivery.HandleClassInvite.Unmarshal", err)
		return fmt.Errorf("failed to unmarshal payload: %w", err)
	}

	h.l.Infof(ctx, "notification.delivery.HandleClassInvite: class=%s, user=%s",
		payload.Class.ID.String(), payload.ClassMember.UserID)

	// Delegate to use case
	if err := h.uc.HandleClassMemberAddedNotification(ctx, payload.Class, payload.ClassMember); err != nil {
		h.l.Errorf(ctx, "notification.delivery.HandleClassInvite.HandleClassMemberAddedNotification", err)
		return err
	}

	h.l.Infof(ctx, "notification.delivery.HandleClassInvite: success for class=%s", payload.Class.ID.String())
	return nil
}
