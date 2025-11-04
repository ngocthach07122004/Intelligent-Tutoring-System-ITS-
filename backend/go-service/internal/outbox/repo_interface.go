package outbox

import (
	"context"

	"init-src/internal/models"
	"init-src/pkg/postgres"
)

// Repository is the interface for outbox repository
//
//go:generate mockery --name=Repository
type Repository interface {
	// Create inserts a new outbox event
	Create(ctx context.Context, tx postgres.Tx, opts CreateOptions) (models.OutboxEvent, error)

	// FetchPending retrieves pending events for processing
	FetchPending(ctx context.Context, limit int) ([]models.OutboxEvent, error)

	// MarkProcessing updates event status to processing
	MarkProcessing(ctx context.Context, id int64) error

	// MarkProcessed updates event status to processed
	MarkProcessed(ctx context.Context, id int64) error

	// MarkFailed updates event status to failed with error message
	MarkFailed(ctx context.Context, id int64, errorMsg string) error
}
