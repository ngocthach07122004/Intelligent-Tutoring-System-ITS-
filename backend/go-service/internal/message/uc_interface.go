package message

import (
	"context"

	"init-src/internal/models"
)

//go:generate mockery --name=Usecase
type Usecase interface {
	// Message operations
	Send(ctx context.Context, sc models.Scope, input SendInput) (models.Message, error)
	List(ctx context.Context, sc models.Scope, input ListInput) ([]models.Message, error)
	Get(ctx context.Context, sc models.Scope, input GetInput) (GetOutput, error)
	GetOne(ctx context.Context, sc models.Scope, input GetOneInput) (GetOneOutput, error)
	Edit(ctx context.Context, sc models.Scope, input EditMessageInput) (models.Message, error)
	Delete(ctx context.Context, sc models.Scope, input DeleteInput) (string, error)

	// Search operations
	Search(ctx context.Context, sc models.Scope, input SearchInput) ([]models.Message, error)
	SearchGlobal(ctx context.Context, sc models.Scope, input SearchGlobalInput) ([]models.Message, error)
}
