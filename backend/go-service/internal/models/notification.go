package models

import (
	"time"

	"github.com/google/uuid"
)

// NotificationType represents the type of notification
type NotificationType string

const (
	NotificationClassInvite NotificationType = "class_invite"  // Invited to class
	NotificationMention     NotificationType = "mention"       // Mentioned in message
	NotificationNewMessage  NotificationType = "new_message"   // New message in conversation
)

// Notification represents an in-app notification
type Notification struct {
	ID         uuid.UUID        `db:"id" json:"id"`
	UserID     string           `db:"user_id" json:"user_id"` // MongoDB User ID (recipient)
	Type       NotificationType `db:"type" json:"type"`
	Title      string           `db:"title" json:"title"`
	Body       string           `db:"body" json:"body"`
	EntityType *string          `db:"entity_type" json:"entity_type,omitempty"` // e.g., "class", "message"
	EntityID   *uuid.UUID       `db:"entity_id" json:"entity_id,omitempty"`
	Data       *string          `db:"data" json:"data,omitempty"` // JSON metadata
	ReadAt     *time.Time       `db:"read_at" json:"read_at,omitempty"`
	CreatedAt  time.Time        `db:"created_at" json:"created_at"`
	DeletedAt  *time.Time       `db:"deleted_at" json:"deleted_at,omitempty"`
}
