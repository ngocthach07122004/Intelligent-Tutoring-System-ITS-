package notification

import (
	"init-src/internal/models"
	"init-src/pkg/paginator"
)

// CreateOptions contains parameters for creating a notification
type CreateOptions struct {
	UserID     string
	Type       models.NotificationType
	Title      string
	Body       string
	EntityType *string
	EntityID   *string
	Data       *string // JSON
}

// Filter contains query filters for notifications
type Filter struct {
	ID         string
	UserID     string
	Type       models.NotificationType
	Unread     bool // If true, only unread notifications
	EntityType *string
	EntityID   *string
}

// ListInput contains parameters for listing notifications
type ListInput struct {
	Filter Filter
}

// GetInput contains parameters for getting notifications with pagination
type GetInput struct {
	Filter Filter
	Pagin  paginator.PaginatorQuery
}

// GetOneInput contains parameters for getting a single notification
type GetOneInput struct {
	Filter Filter
}
