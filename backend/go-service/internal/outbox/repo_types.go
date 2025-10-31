package outbox

import "github.com/google/uuid"

// CreateOptions contains parameters for creating an outbox event
type CreateOptions struct {
	AggregateType string
	AggregateID   uuid.UUID
	EventType     string
	Payload       string // JSON string
}
