package notification

import (
	"init-src/internal/models"
	"init-src/pkg/paginator"
)

// CreateInput contains parameters for creating a notification
type CreateInput struct {
	UserID     string
	Type       models.NotificationType
	Title      string
	Body       string
	EntityType *string
	EntityID   *string
	Data       *string // JSON
}

// GetOutput contains the result of Get operation
type GetOutput struct {
	Notifications []models.Notification
	Pagin         paginator.Paginator
}

// GetOneOutput contains the result of GetOne operation
type GetOneOutput struct {
	Notification models.Notification
}
