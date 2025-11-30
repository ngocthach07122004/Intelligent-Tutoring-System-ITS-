package message

import (
	"init-src/internal/models"
	"init-src/pkg/paginator"
)

// SendInput contains parameters for sending a message
type SendInput struct {
	ConversationID string
	Content        string
	Attachments    *string // JSON array
	ReplyToID      *string // Message ID being replied to
}

// EditMessageInput contains parameters for editing a message with context
type EditMessageInput struct {
	Filter  Filter // ID and ConversationID
	Content string // New message content
}

// DeleteInput contains parameters for deleting a message
type DeleteInput struct {
	Filter Filter // ID and ConversationID
}

// SearchInput contains parameters for searching messages in a conversation
type SearchInput struct {
	ConversationID string
	Query          string
}

// SearchGlobalInput contains parameters for global message search
type SearchGlobalInput struct {
	Query string
}

// GetOutput contains the result of Get operation
type GetOutput struct {
	Messages []MessageWithSender
	Pagin    paginator.Paginator
}

// GetOneOutput contains the result of GetOne operation
type GetOneOutput struct {
	Message MessageWithSender
}

// Filter contains query filters for messages
type Filter struct {
	ID             string
	ConversationID string
	SenderID       string
	Type           models.MessageType
	MinSeq         *int64 // For pagination/sync
	MaxSeq         *int64
}

// ListInput contains parameters for listing messages
type ListInput struct {
	Filter Filter
}

// GetInput contains parameters for getting messages with pagination
type GetInput struct {
	Filter Filter
	Pagin  paginator.PaginatorQuery
}

// GetOneInput contains parameters for getting a single message
type GetOneInput struct {
	Filter Filter
}