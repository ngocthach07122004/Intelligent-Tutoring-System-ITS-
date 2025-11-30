package conversation

import (
	"context"

	"init-src/internal/models"
)

//go:generate mockery --name=Usecase
type Usecase interface {
	// Conversation operations
	Create(ctx context.Context, sc models.Scope, input CreateInput) (models.Conversation, error)
	List(ctx context.Context, sc models.Scope, input ListInput) ([]models.Conversation, error)
	Get(ctx context.Context, sc models.Scope, input GetInput) (GetOutput, error)
	GetOne(ctx context.Context, sc models.Scope, input GetOneInput) (GetOneOutput, error)
	Leave(ctx context.Context, sc models.Scope, id string) (string, error)

	// Participant operations
	AddParticipants(ctx context.Context, sc models.Scope, conversationID string, input AddParticipantsInput) error
	GetParticipants(ctx context.Context, sc models.Scope, conversationID string) ([]models.ConversationParticipant, error)
	MarkAsRead(ctx context.Context, sc models.Scope, conversationID string, seq int64) error

	// Class Channel operations
	GetClassChannels(ctx context.Context, sc models.Scope, classID string) ([]models.Conversation, error)
	CreateClassChannel(ctx context.Context, sc models.Scope, input CreateChannelInput) (models.Conversation, error)
}
