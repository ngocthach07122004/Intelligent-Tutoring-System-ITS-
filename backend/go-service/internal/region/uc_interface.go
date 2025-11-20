package region

import (
	"context"

	"init-src/internal/models"
)

//go:generate mockery --name=Usecase
type Usecase interface {
	Create(ctx context.Context, sc models.Scope, input CreateInput) (models.Region, error)
	List(ctx context.Context, sc models.Scope, input ListInput) ([]models.Region, error)
	Get(ctx context.Context, sc models.Scope, input GetInput) (GetOutput, error)
	GetOne(ctx context.Context, sc models.Scope, input GetOneInput) (GetOneOutput, error)
	Update(ctx context.Context, sc models.Scope, id string, input UpdateInput) (models.Region, error)
	Delete(ctx context.Context, sc models.Scope, id string) (string, error)
	// GetByID(ctx context.Context, sc models.Scope, id string) (models.Region, error)
	// GetByCode(ctx context.Context, sc models.Scope, code string) (models.Region, error)
}
