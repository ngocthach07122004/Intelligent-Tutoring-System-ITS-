package branch

import (
	"context"

	"init-src/internal/models"
	"init-src/pkg/paginator"
)

// Repository is the interface for todo repository
//
//go:generate mockery --name=Repository
type Repository interface {
	Create(ctx context.Context, sc models.Scope, opts CreateOptions) (models.Branch, error)
	List(ctx context.Context, sc models.Scope, input ListInput) ([]models.Branch, error)
	Get(ctx context.Context, sc models.Scope, input GetInput) ([]models.Branch, paginator.Paginator, error)
	GetOne(ctx context.Context, sc models.Scope, input GetOneInput) (models.Branch, error)
	Update(ctx context.Context, sc models.Scope, id string, opts UpdateOptions) (models.Branch, error)
	Delete(ctx context.Context, sc models.Scope, id string) (string, error)
}
