package class

import (
	"context"

	"init-src/internal/models"
)

//go:generate mockery --name=Usecase
type Usecase interface {
	// Class operations
	Create(ctx context.Context, sc models.Scope, input CreateInput) (models.Class, error)
	List(ctx context.Context, sc models.Scope, input ListInput) ([]models.Class, error)
	Get(ctx context.Context, sc models.Scope, input GetInput) (GetOutput, error)
	GetOne(ctx context.Context, sc models.Scope, input GetOneInput) (GetOneOutput, error)
	Update(ctx context.Context, sc models.Scope, id string, input UpdateInput) (models.Class, error)
	Delete(ctx context.Context, sc models.Scope, id string) (string, error)

	// Member operations
	AddMember(ctx context.Context, sc models.Scope, classID string, input AddMemberInput) (models.ClassMember, error)
	RemoveMember(ctx context.Context, sc models.Scope, classID string, userID string) (string, error)
	ListMembers(ctx context.Context, sc models.Scope, classID string) ([]models.ClassMember, error)

	// Join by code
	JoinByCode(ctx context.Context, sc models.Scope, code string) (models.Class, error)
}
