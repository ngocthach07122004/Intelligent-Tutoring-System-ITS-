package models

import (
	"time"

	"github.com/google/uuid"
)

// ConversationType represents the type of conversation
type ConversationType string

const (
	ConversationDirect ConversationType = "direct" // 1-1 chat
	ConversationGroup  ConversationType = "group"  // Group chat
	ConversationClass  ConversationType = "class"  // Class discussion
)

// Conversation represents a chat conversation
type Conversation struct {
	ID        uuid.UUID        `db:"id" json:"id"`
	Type      ConversationType `db:"type" json:"type"`
	Name      *string          `db:"name" json:"name,omitempty"` // Nullable for direct chats
	ClassID   *uuid.UUID       `db:"class_id" json:"class_id,omitempty"`
	CreatedBy string           `db:"created_by" json:"created_by"` // MongoDB User ID
	CreatedAt time.Time        `db:"created_at" json:"created_at"`
	UpdatedAt time.Time        `db:"updated_at" json:"updated_at"`
	DeletedAt *time.Time       `db:"deleted_at" json:"deleted_at,omitempty"`
}

// ConversationParticipant represents a participant in a conversation
type ConversationParticipant struct {
	ID             uuid.UUID  `db:"id" json:"id"`
	ConversationID uuid.UUID  `db:"conversation_id" json:"conversation_id"`
	UserID         string     `db:"user_id" json:"user_id"` // MongoDB User ID
	LastReadSeq    int64      `db:"last_read_seq" json:"last_read_seq"`
	LeftAt         *time.Time `db:"left_at" json:"left_at,omitempty"`
	JoinedAt       time.Time  `db:"joined_at" json:"joined_at"`
	CreatedAt      time.Time  `db:"created_at" json:"created_at"`
}
