package postgres

import (
	"fmt"

	"init-src/internal/conversation"
	"init-src/internal/models"

	"github.com/google/uuid"
)

func (repo *implRepository) buildCreateConversation(opts conversation.CreateOptions) (models.Conversation, error) {
	conv := models.Conversation{
		ID:        uuid.New(),
		Type:      opts.Type,
		Name:      opts.Name,
		CreatedBy: opts.CreatedBy,
	}

	// Parse ClassID if provided
	if opts.ClassID != nil && *opts.ClassID != "" {
		classID, err := uuid.Parse(*opts.ClassID)
		if err != nil {
			return models.Conversation{}, fmt.Errorf("invalid class ID: %w", err)
		}
		conv.ClassID = &classID
	}

	return conv, nil
}

func (repo *implRepository) buildAddParticipant(opts conversation.AddParticipantOptions) (models.ConversationParticipant, error) {
	convID, err := uuid.Parse(opts.ConversationID)
	if err != nil {
		return models.ConversationParticipant{}, fmt.Errorf("invalid conversation ID: %w", err)
	}

	participant := models.ConversationParticipant{
		ID:             uuid.New(),
		ConversationID: convID,
		UserID:         opts.UserID,
		LastReadSeq:    0,
	}

	return participant, nil
}
