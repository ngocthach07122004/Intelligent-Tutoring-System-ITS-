package postgres

import (
	"fmt"

	"init-src/internal/message"
	"init-src/internal/models"

	"github.com/google/uuid"
)

func (repo *implRepository) buildCreateMessage(opts message.CreateOptions) (models.Message, error) {
	convID, err := uuid.Parse(opts.ConversationID)
	if err != nil {
		return models.Message{}, fmt.Errorf("invalid conversation ID: %w", err)
	}

	msg := models.Message{
		ID:             uuid.New(),
		ConversationID: convID,
		SenderID:       opts.SenderID,
		Type:           opts.Type,
		Content:        opts.Content,
		Attachments:    opts.Attachments,
	}

	// Parse ReplyToID if provided
	if opts.ReplyToID != nil && *opts.ReplyToID != "" {
		replyToID, err := uuid.Parse(*opts.ReplyToID)
		if err != nil {
			return models.Message{}, fmt.Errorf("invalid reply_to_id: %w", err)
		}
		msg.ReplyToID = &replyToID
	}

	return msg, nil
}

func (repo *implRepository) buildUpdateMessage(opts message.UpdateOptions) (models.Message, error) {
	// Update content
	opts.Message.Content = opts.Content

	return opts.Message, nil
}
