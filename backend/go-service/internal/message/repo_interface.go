package message

import (
	"context"

	"init-src/internal/models"
	"init-src/pkg/paginator"
	"init-src/pkg/postgres"
)

// Repository is the interface for message repository
//
//go:generate mockery --name=Repository
type Repository interface {
	// Message operations
	Create(ctx context.Context, tx postgres.Tx, opts CreateOptions) (models.Message, error)
	List(ctx context.Context, sc models.Scope, opts ListOptions) ([]models.Message, error)
	Get(ctx context.Context, sc models.Scope, opts GetOptions) ([]models.Message, paginator.Paginator, error)
	GetOne(ctx context.Context, sc models.Scope, opts GetOneOptions) (models.Message, error)
	GetByID(ctx context.Context, id string) (models.Message, error)
	GetBySeq(ctx context.Context, conversationID string, seq int64) (models.Message, error)
	Update(ctx context.Context, tx postgres.Tx, id string, opts UpdateOptions) (models.Message, error)
	Delete(ctx context.Context, tx postgres.Tx, id string) (string, error)

	// Search operations
	Search(ctx context.Context, conversationID string, query string, limit int) ([]models.Message, error)
	SearchGlobal(ctx context.Context, userID string, query string, limit int) ([]models.Message, error)
}
