package class

import "init-src/internal/models"

// CreateOptions contains parameters for creating a class
type CreateOptions struct {
	Name        string
	Description string
	Code        string
	CreatedBy   string // MongoDB User ID
}

// UpdateOptions contains parameters for updating a class
type UpdateOptions struct {
	Class       models.Class // Existing class
	Name        string
	Description string
	Archived    bool
}

// AddMemberOptions contains parameters for adding a member to a class
type AddMemberOptions struct {
	ClassID string
	UserID  string // MongoDB User ID
	Role    models.ClassMemberRole
}
