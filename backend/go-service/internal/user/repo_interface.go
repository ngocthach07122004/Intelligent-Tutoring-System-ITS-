package user

import (
	"context"

	"init-src/internal/models"
	"init-src/pkg/paginator"
)

// Repository is the interface for todo repository
//
//go:generate mockery --name=Repository
type Repository interface {
	Create(ctx context.Context, sc models.Scope, opts CreateOptions) (models.User, error)
	// FindByEmail(ctx context.Context, sc models.Scope, email string, shopID string) (models.User, error)
	List(ctx context.Context, sc models.Scope, opts ListInput) ([]models.User, error)
	Get(ctx context.Context, sc models.Scope, opts GetInput) ([]models.User, paginator.Paginator, error)
	GetOne(ctx context.Context, sc models.Scope, opts GetOneInput) (models.User, error)
	Update(ctx context.Context, sc models.Scope, id string, opts UpdateOptions) (models.User, error)
	Delete(ctx context.Context, sc models.Scope, id string) (string, error)
}
