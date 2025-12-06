package conversation

import (
	"init-src/internal/models"
	"init-src/pkg/paginator"
)

// CreateInput contains parameters for creating a conversation
type CreateInput struct {
	Type           models.ConversationType
	Name           *string  // Optional for direct chats, required for group
	ClassID        *string  // For class conversations
	ParticipantIDs []string // User IDs to add as participants (excluding creator)
}

// AddParticipantsInput contains parameters for adding participants
type AddParticipantsInput struct {
	UserIDs []string
}

// GetOutput contains the result of Get operation
type GetOutput struct {
	Conversations []models.Conversation
	Pagin         paginator.Paginator
}

// GetOneOutput contains the result of GetOne operation
type GetOneOutput struct {
	Conversation models.Conversation
}
