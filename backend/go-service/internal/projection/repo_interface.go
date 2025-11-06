package projection

import (
	"context"
)

// Repository is the interface for projection repository
//
//go:generate mockery --name=Repository
type Repository interface {
	// Conversation list projections
	AddToConversationList(ctx context.Context, userID string, conversationID string, timestamp int64) error
	RemoveFromConversationList(ctx context.Context, userID string, conversationID string) error
	LimitConversationList(ctx context.Context, userID string, limit int) error

	// Conversation metadata
	SetConversationMeta(ctx context.Context, conversationID string, fields map[string]interface{}) error
	GetConversationMeta(ctx context.Context, conversationID string, field string) (string, error)

	// Unread counters
	IncrementUnread(ctx context.Context, conversationID string, userID string) error
	ResetUnread(ctx context.Context, conversationID string, userID string) error
	GetUnread(ctx context.Context, conversationID string, userID string) (int64, error)

	// Message cache
	CacheMessage(ctx context.Context, messageID string, fields map[string]interface{}, ttl int64) error
	UpdateMessageCache(ctx context.Context, messageID string, fields map[string]interface{}) error
	DeleteMessageCache(ctx context.Context, messageID string) error

	// Participants set
	AddParticipant(ctx context.Context, conversationID string, userID string) error
	RemoveParticipant(ctx context.Context, conversationID string, userID string) error
	GetParticipants(ctx context.Context, conversationID string) ([]string, error)

	// Presence
	SetPresence(ctx context.Context, userID string, status string, ttl int64) error
	GetPresence(ctx context.Context, userID string) (string, error)

	// Typing indicators
	SetTyping(ctx context.Context, conversationID string, userID string, ttl int64) error
	GetTypingUsers(ctx context.Context, conversationID string) ([]string, error)

	// WebSocket Pub/Sub
	PublishEvent(ctx context.Context, channel string, event string) error
}
