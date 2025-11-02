package projection

import (
	"context"

	"init-src/internal/models"
)

//go:generate mockery --name=Projector
type Usecase interface {
	// Message projections
	ProjectMessageCreated(ctx context.Context, msg models.Message, participants []string) error
	ProjectMessageEdited(ctx context.Context, msg models.Message, participants []string) error
	ProjectMessageDeleted(ctx context.Context, messageID string, conversationID string, participants []string) error

	// Conversation projections
	ProjectConversationCreated(ctx context.Context, conv models.Conversation, participants []models.ConversationParticipant) error
	ProjectParticipantJoined(ctx context.Context, conv models.Conversation, participant models.ConversationParticipant) error
	ProjectParticipantLeft(ctx context.Context, conversationID string, userID string) error
	ProjectLastReadSeq(ctx context.Context, conversationID string, userID string, seq int64) error

	// Presence projections
	SetUserPresence(ctx context.Context, userID string, status string) error
	GetUserPresence(ctx context.Context, userID string) (string, error)

	// Typing indicator projections
	SetTyping(ctx context.Context, conversationID string, userID string) error
	GetTypingUsers(ctx context.Context, conversationID string) ([]string, error)
}
