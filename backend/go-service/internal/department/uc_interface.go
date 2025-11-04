package department

import (
	"context"

	"init-src/internal/models"
)

//go:generate mockery --name=Usecase
type Usecase interface {
	Create(ctx context.Context, sc models.Scope, input CreateInput) (models.Department, error)
	List(ctx context.Context, sc models.Scope, input ListInput) ([]models.Department, error)
	Get(ctx context.Context, sc models.Scope, input GetInput) (GetOutput, error)
	GetOne(ctx context.Context, sc models.Scope, input GetOneInput) (GetOneOutput, error)
	Update(ctx context.Context, sc models.Scope, id string, input UpdateInput) (models.Department, error)
	Delete(ctx context.Context, sc models.Scope, id string) (string, error)
}
