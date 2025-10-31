package region

import (
	"context"

	"init-src/internal/models"
	"init-src/pkg/paginator"
)

//go:generate mockery --name=Repository
type Repository interface {
	Create(ctx context.Context, sc models.Scope, opts CreateOptions) (models.Region, error)
	List(ctx context.Context, sc models.Scope, input ListInput) ([]models.Region, error)
	Get(ctx context.Context, sc models.Scope, input GetInput) ([]models.Region, paginator.Paginator, error)
	GetOne(ctx context.Context, sc models.Scope, input GetOneInput) (models.Region, error)
	Update(ctx context.Context, sc models.Scope, id string, opts UpdateOptions) (models.Region, error)
	Delete(ctx context.Context, sc models.Scope, id string) (string, error)
}
