package models

import (
	"time"

	"github.com/google/uuid"
)

// EventStatus represents the processing status of an outbox event
type EventStatus string

const (
	EventStatusPending    EventStatus = "pending"
	EventStatusProcessing EventStatus = "processing"
	EventStatusProcessed  EventStatus = "processed"
	EventStatusFailed     EventStatus = "failed"
)

// OutboxEvent represents an event stored in the outbox table
type OutboxEvent struct {
	ID            int64       `db:"id" json:"id"`
	AggregateType string      `db:"aggregate_type" json:"aggregate_type"` // e.g., "message", "class"
	AggregateID   uuid.UUID   `db:"aggregate_id" json:"aggregate_id"`
	EventType     string      `db:"event_type" json:"event_type"` // e.g., "message.created"
	Payload       string      `db:"payload" json:"payload"`       // JSON payload
	Status        EventStatus `db:"status" json:"status"`
	Attempts      int         `db:"attempts" json:"attempts"`
	LastError     *string     `db:"last_error" json:"last_error,omitempty"`
	CreatedAt     time.Time   `db:"created_at" json:"created_at"`
	ProcessedAt   *time.Time  `db:"processed_at" json:"processed_at,omitempty"`
}

// Event types constants
const (
	// Message events
	EventMessageCreated = "message.created"
	EventMessageEdited  = "message.edited"
	EventMessageDeleted = "message.deleted"

	// Class events
	EventClassCreated       = "class.created"
	EventClassMemberAdded   = "class.member.added"
	EventClassMemberRemoved = "class.member.removed"

	// Conversation events
	EventConversationCreated = "conversation.created"
	EventParticipantJoined   = "conversation.participant.joined"
	EventParticipantLeft     = "conversation.participant.left"
	EventConversationRead    = "conversation.read"
)
