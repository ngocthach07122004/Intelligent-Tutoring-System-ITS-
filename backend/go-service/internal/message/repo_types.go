package message

import (
	"init-src/internal/models"
	"init-src/pkg/paginator"
)

// CreateOptions contains parameters for creating a message
type CreateOptions struct {
	ConversationID string
	SenderID       string
	Type           models.MessageType
	Content        string
	Attachments    *string    // JSON array
	ReplyToID      *string    // Message ID being replied to
}

// UpdateOptions contains parameters for updating a message
type UpdateOptions struct {
	Message models.Message
	Content string
}

// ListInput contains parameters for listing messages
type ListOptions struct {
	Filter Filter
}

// GetInput contains parameters for getting messages with pagination
type GetOptions struct {
	Filter Filter
	Pagin  paginator.PaginatorQuery
}

// GetOneOptions contains parameters for getting a single message
type GetOneOptions struct {
	Filter Filter
}