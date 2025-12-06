package department

import (
	"context"

	"init-src/internal/models"
	"init-src/pkg/paginator"
)

//go:generate mockery --name=Repository
type Repository interface {
	Create(ctx context.Context, sc models.Scope, opts CreateOptions) (models.Department, error)
	List(ctx context.Context, sc models.Scope, input ListInput) ([]models.Department, error)
	Get(ctx context.Context, sc models.Scope, input GetInput) ([]models.Department, paginator.Paginator, error)
	GetOne(ctx context.Context, sc models.Scope, input GetOneInput) (models.Department, error)
	Update(ctx context.Context, sc models.Scope, id string, opts UpdateOptions) (models.Department, error)
	Delete(ctx context.Context, sc models.Scope, id string) (string, error)
}
