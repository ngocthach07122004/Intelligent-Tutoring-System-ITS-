package class

import (
	"init-src/internal/models"
	"init-src/pkg/paginator"
)

// CreateInput for creating a class
type CreateInput struct {
	Name        string
	Description string
}

// UpdateInput for updating a class
type UpdateInput struct {
	Name        string
	Description string
	Archived    bool
}

// AddMemberInput for adding a member to a class
type AddMemberInput struct {
	UserID string // MongoDB User ID
	Role   models.ClassMemberRole
}

// Filter for querying classes
type Filter struct {
	ID        string
	Name      string
	Code      string
	CreatedBy string
	MemberID  string // Added: Filter classes by member ID
	Archived  *bool  // Nullable to allow filtering by archived status
}

// ListInput for listing classes
type ListInput struct {
	Filter Filter
}

// GetInput for getting classes with pagination
type GetInput struct {
	Filter Filter
	Pagin  paginator.PaginatorQuery
}

// GetOneInput for getting a single class
type GetOneInput struct {
	Filter Filter
}

// GetOutput for Get response
type GetOutput struct {
	Classes []models.Class
	Pagin   paginator.Paginator
}

// GetOneOutput for GetOne response
type GetOneOutput struct {
	Class models.Class
}
