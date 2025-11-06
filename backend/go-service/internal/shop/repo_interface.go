package shop

import (
	"context"

	"init-src/internal/models"
	"init-src/pkg/paginator"
)

//go:generate mockery --name=Repository
type Repository interface {
	Create(ctx context.Context, sc models.Scope, opts CreateOptions) (models.Shop, error)
	List(ctx context.Context, sc models.Scope, input ListInput) ([]models.Shop, error)
	Get(ctx context.Context, sc models.Scope, input GetInput) ([]models.Shop, paginator.Paginator, error)
	GetOne(ctx context.Context, sc models.Scope, input GetOneInput) (models.Shop, error)
	Update(ctx context.Context, sc models.Scope, id string, opts UpdateOptions) (models.Shop, error)
	Delete(ctx context.Context, sc models.Scope, id string) (string, error)

	// FindByID(ctx context.Context, sc models.Scope, id string) (models.Shop, error)
	// FindByCode(ctx context.Context, sc models.Scope, code string) (models.Shop, error)
}
