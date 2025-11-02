package conversation

import (
	"init-src/internal/models"
	"init-src/pkg/paginator"
)

// CreateOptions contains parameters for creating a conversation
type CreateOptions struct {
	Type      models.ConversationType
	Name      *string // Optional for direct chats
	ClassID   *string // For class conversations
	CreatedBy string  // MongoDB User ID
}

// AddParticipantOptions contains parameters for adding a participant
type AddParticipantOptions struct {
	ConversationID string
	UserID         string
}

// Filter contains query filters for conversations
type Filter struct {
	ID        string
	Type      models.ConversationType
	ClassID   *string
	UserID    string // Filter by participant user ID
	NotLeftAt bool   // Only active participants
}

// ListInput contains parameters for listing conversations
type ListInput struct {
	Filter Filter
}

// GetInput contains parameters for getting conversations with pagination
type GetInput struct {
	Filter Filter
	Pagin  paginator.PaginatorQuery
}

// GetOneInput contains parameters for getting a single conversation
type GetOneInput struct {
	Filter Filter
}
