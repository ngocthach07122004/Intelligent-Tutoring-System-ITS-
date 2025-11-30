package conversation

import (
	"context"

	"init-src/internal/models"
	"init-src/pkg/paginator"
	"init-src/pkg/postgres"
)

// Repository is the interface for conversation repository
//
//go:generate mockery --name=Repository
type Repository interface {
	// Conversation operations
	Create(ctx context.Context, tx postgres.Tx, opts CreateOptions) (models.Conversation, error)
	List(ctx context.Context, sc models.Scope, input ListInput) ([]models.Conversation, error)
	Get(ctx context.Context, sc models.Scope, input GetInput) ([]models.Conversation, paginator.Paginator, error)
	GetOne(ctx context.Context, sc models.Scope, input GetOneInput) (models.Conversation, error)
	GetByID(ctx context.Context, id string) (models.Conversation, error)
	Delete(ctx context.Context, tx postgres.Tx, id string) (string, error)

	// Participant operations
	AddParticipant(ctx context.Context, tx postgres.Tx, opts AddParticipantOptions) (models.ConversationParticipant, error)
	AddParticipants(ctx context.Context, tx postgres.Tx, conversationID string, userIDs []string) error
	RemoveParticipant(ctx context.Context, tx postgres.Tx, conversationID string, userID string) error
	GetParticipants(ctx context.Context, conversationID string) ([]models.ConversationParticipant, error)
	GetParticipant(ctx context.Context, conversationID string, userID string) (models.ConversationParticipant, error)
	IsParticipant(ctx context.Context, conversationID string, userID string) (bool, error)
	UpdateLastReadSeq(ctx context.Context, tx postgres.Tx, conversationID string, userID string, seq int64) error

	// Direct conversation check
	GetDirectConversation(ctx context.Context, user1ID string, user2ID string) (models.Conversation, error)

	// Class channels
	GetClassChannels(ctx context.Context, classID string) ([]models.Conversation, error)
}
