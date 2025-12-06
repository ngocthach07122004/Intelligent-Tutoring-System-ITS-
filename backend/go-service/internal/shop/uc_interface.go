package shop

import (
	"init-src/internal/models"
	// "init-src/pkg/paginator"

	"context"
)

//go:generate mockery --name=Usecase
type Usecase interface {
	Create(ctx context.Context, sc models.Scope, input CreateInput) (models.Shop, error)
	List(ctx context.Context, sc models.Scope, input ListInput) ([]models.Shop, error)
	Get(ctx context.Context, sc models.Scope, input GetInput) (GetOutput, error)
	GetOne(ctx context.Context, sc models.Scope, input GetOneInput) (GetOneOutput, error)
	Update(ctx context.Context, sc models.Scope, id string, input UpdateInput) (models.Shop, error)
	Delete(ctx context.Context, sc models.Scope, id string) (string, error)
}
