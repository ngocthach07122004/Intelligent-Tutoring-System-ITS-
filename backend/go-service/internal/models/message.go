package models

import (
	"time"

	"github.com/google/uuid"
)

// MessageType represents the type of message
type MessageType string

const (
	MessageTypeText   MessageType = "text"   // Regular text message
	MessageTypeSystem MessageType = "system" // System-generated message
)

// Message represents a chat message
type Message struct {
	ID             uuid.UUID   `db:"id" json:"id"`
	ConversationID uuid.UUID   `db:"conversation_id" json:"conversation_id"`
	SenderID       string      `db:"sender_id" json:"sender_id"` // MongoDB User ID
	Seq            int64       `db:"seq" json:"seq"`             // Sequence number in conversation
	Type           MessageType `db:"type" json:"type"`
	Content        string      `db:"content" json:"content"`
	Attachments    *string     `db:"attachments" json:"attachments,omitempty"` // JSON array
	ReplyToID      *uuid.UUID  `db:"reply_to_id" json:"reply_to_id,omitempty"`
	EditedAt       *time.Time  `db:"edited_at" json:"edited_at,omitempty"`
	CreatedAt      time.Time   `db:"created_at" json:"created_at"`
	DeletedAt      *time.Time  `db:"deleted_at" json:"deleted_at,omitempty"`
}
