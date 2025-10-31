package asynq

import (
	"context"
	"encoding/json"
	"fmt"
	"init-src/internal/models"
	"init-src/pkg/asynq"
)

func (h *handler) HandleMessage(ctx context.Context, task *asynq.Task) error {
	// Parse payload
	var payload struct {
		EventType    string         `json:"event_type"`
		Message      models.Message `json:"message"`
		MessageID    string         `json:"message_id"`
		ConvID       string         `json:"conversation_id"`
		Participants []string       `json:"participants"`
	}

	if err := json.Unmarshal(task.Payload(), &payload); err != nil {
		h.l.Errorf(ctx, "projection.HandleProjectMessage.Unmarshal", err)
		return fmt.Errorf("failed to unmarshal payload: %w", err)
	}

	h.l.Infof(ctx, "projection.HandleProjectMessage: event=%s, msg=%s", payload.EventType, payload.Message.ID.String())

	// Route to appropriate handler based on event type
	switch payload.EventType {
	case models.EventMessageCreated:
		if err := h.uc.ProjectMessageCreated(ctx, payload.Message, payload.Participants); err != nil {
			h.l.Errorf(ctx, "projection.HandleProjectMessage.ProjectMessageCreated", err)
			return err
		}

	case models.EventMessageEdited:
		if err := h.uc.ProjectMessageEdited(ctx, payload.Message, payload.Participants); err != nil {
			h.l.Errorf(ctx, "projection.HandleProjectMessage.ProjectMessageEdited", err)
			return err
		}

	case models.EventMessageDeleted:
		if err := h.uc.ProjectMessageDeleted(ctx, payload.MessageID, payload.ConvID, payload.Participants); err != nil {
			h.l.Errorf(ctx, "projection.HandleProjectMessage.ProjectMessageDeleted", err)
			return err
		}

	default:
		h.l.Warnf(ctx, "projection.HandleProjectMessage: unknown event type: %s", payload.EventType)
		return fmt.Errorf("unknown event type: %s", payload.EventType)
	}

	h.l.Infof(ctx, "projection.HandleProjectMessage: success for event=%s", payload.EventType)
	return nil
}

// HandleProjectConversation processes conversation projection tasks
func (h *handler) HandleConversation(ctx context.Context, task *asynq.Task) error {
	// Parse payload
	var payload struct {
		EventType    string                           `json:"event_type"`
		Conversation models.Conversation              `json:"conversation"`
		Participant  models.ConversationParticipant   `json:"participant"`
		Participants []models.ConversationParticipant `json:"participants"`
		UserID       string                           `json:"user_id"`
		Seq          int64                            `json:"seq"`
	}

	if err := json.Unmarshal(task.Payload(), &payload); err != nil {
		h.l.Errorf(ctx, "projection.HandleProjectConversation.Unmarshal", err)
		return fmt.Errorf("failed to unmarshal payload: %w", err)
	}

	h.l.Infof(ctx, "projection.HandleProjectConversation: event=%s, conv=%s", payload.EventType, payload.Conversation.ID.String())

	// Route to appropriate handler based on event type
	switch payload.EventType {
	case models.EventConversationCreated:
		if err := h.uc.ProjectConversationCreated(ctx, payload.Conversation, payload.Participants); err != nil {
			h.l.Errorf(ctx, "projection.HandleProjectConversation.ProjectConversationCreated", err)
			return err
		}

	case models.EventParticipantJoined:
		if err := h.uc.ProjectParticipantJoined(ctx, payload.Conversation, payload.Participant); err != nil {
			h.l.Errorf(ctx, "projection.HandleProjectConversation.ProjectParticipantJoined", err)
			return err
		}

	case models.EventParticipantLeft:
		convID := payload.Conversation.ID.String()
		if err := h.uc.ProjectParticipantLeft(ctx, convID, payload.UserID); err != nil {
			h.l.Errorf(ctx, "projection.HandleProjectConversation.ProjectParticipantLeft", err)
			return err
		}

	case models.EventConversationRead:
		convID := payload.Conversation.ID.String()
		if err := h.uc.ProjectLastReadSeq(ctx, convID, payload.UserID, payload.Seq); err != nil {
			h.l.Errorf(ctx, "projection.HandleProjectConversation.ProjectLastReadSeq", err)
			return err
		}

	default:
		h.l.Warnf(ctx, "projection.HandleProjectConversation: unknown event type: %s", payload.EventType)
		return fmt.Errorf("unknown event type: %s", payload.EventType)
	}

	h.l.Infof(ctx, "projection.HandleProjectConversation: success for event=%s", payload.EventType)
	return nil
}
