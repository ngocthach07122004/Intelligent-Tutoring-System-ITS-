package class

import (
	"context"

	"init-src/internal/models"
	"init-src/pkg/paginator"
	"init-src/pkg/postgres"
)

// Repository is the interface for class repository
//
//go:generate mockery --name=Repository
type Repository interface {
	// Class operations
	Create(ctx context.Context, tx postgres.Tx, opts CreateOptions) (models.Class, error)
	List(ctx context.Context, sc models.Scope, input ListInput) ([]models.Class, error)
	Get(ctx context.Context, sc models.Scope, input GetInput) ([]models.Class, paginator.Paginator, error)
	GetOne(ctx context.Context, sc models.Scope, input GetOneInput) (models.Class, error)
	GetByCode(ctx context.Context, code string) (models.Class, error)
	Update(ctx context.Context, tx postgres.Tx, id string, opts UpdateOptions) (models.Class, error)
	Delete(ctx context.Context, tx postgres.Tx, id string) (string, error)

	// Member operations
	AddMember(ctx context.Context, tx postgres.Tx, opts AddMemberOptions) (models.ClassMember, error)
	RemoveMember(ctx context.Context, tx postgres.Tx, classID string, userID string) error
	ListMembers(ctx context.Context, classID string) ([]models.ClassMember, error)
	GetMember(ctx context.Context, classID string, userID string) (models.ClassMember, error)
	IsMember(ctx context.Context, classID string, userID string) (bool, error)
}
