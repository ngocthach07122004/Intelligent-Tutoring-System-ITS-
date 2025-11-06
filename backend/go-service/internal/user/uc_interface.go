package user

import (
	"context"

	"init-src/internal/models"
)

//go:generate mockery --name=Usecase
type Usecase interface {
	SignUp(ctx context.Context, sc models.Scope, input SignUpInput) (models.User, error)
	Login(ctx context.Context, input LoginInput) (string, error)
	List(ctx context.Context, scope models.Scope, input ListInput) ([]models.User, error)
	GetOne(ctx context.Context, scope models.Scope, input GetOneInput) (models.User, error)
	Get(ctx context.Context, scope models.Scope, input GetInput) (GetOutPut, error)
	Update(ctx context.Context, scope models.Scope, id string, input UpdateInput) (models.User, error)
	Delete(ctx context.Context, scope models.Scope, id string) (string, error)
	Create(ctx context.Context, sc models.Scope, input CreateUserInput) (models.User, error)
	GetByID(ctx context.Context, scope models.Scope, id string) (GetOneOutPut, error)
	UpdatePassword(ctx context.Context, scope models.Scope, id string, input UpdateInput) (models.User, error)
}
