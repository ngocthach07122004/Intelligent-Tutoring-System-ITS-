package notification

import (
	"context"

	"init-src/internal/models"
	"init-src/pkg/paginator"
	"init-src/pkg/postgres"
)

//go:generate mockery --name=Repository
type Repository interface {
	// CRUD operations
	Create(ctx context.Context, tx postgres.Tx, opts CreateOptions) (models.Notification, error)
	List(ctx context.Context, sc models.Scope, input ListInput) ([]models.Notification, error)
	Get(ctx context.Context, sc models.Scope, input GetInput) ([]models.Notification, paginator.Paginator, error)
	GetOne(ctx context.Context, sc models.Scope, input GetOneInput) (models.Notification, error)
	Delete(ctx context.Context, tx postgres.Tx, id string) (string, error)

	// Mark as read operations
	MarkAsRead(ctx context.Context, tx postgres.Tx, id string, userID string) error
	MarkAllAsRead(ctx context.Context, tx postgres.Tx, userID string) error

	// Query operations
	CountUnread(ctx context.Context, userID string) (int64, error)
}
