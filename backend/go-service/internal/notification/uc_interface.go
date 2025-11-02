package notification

import (
	"context"

	"init-src/internal/models"
)

//go:generate mockery --name=Usecase
type Usecase interface {
	// Query operations
	List(ctx context.Context, sc models.Scope, input ListInput) ([]models.Notification, error)
	Get(ctx context.Context, sc models.Scope, input GetInput) (GetOutput, error)
	GetOne(ctx context.Context, sc models.Scope, input GetOneInput) (GetOneOutput, error)
	CountUnread(ctx context.Context, sc models.Scope) (int64, error)

	// Mark as read operations
	MarkAsRead(ctx context.Context, sc models.Scope, id string) error
	MarkAllAsRead(ctx context.Context, sc models.Scope) error

	// Delete operation
	Delete(ctx context.Context, sc models.Scope, id string) (string, error)

	// Create operation (used by workers)
	Create(ctx context.Context, input CreateInput) (models.Notification, error)

	// Asynq notification handlers (used by delivery layer)
	HandleMessageCreatedNotification(ctx context.Context, msg models.Message, participants []string) error
	HandleClassMemberAddedNotification(ctx context.Context, class models.Class, member models.ClassMember) error
}