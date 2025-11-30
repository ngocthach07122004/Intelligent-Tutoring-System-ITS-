package user

import (
	"context"

	"init-src/internal/models"
)

// Repository defines the small surface we need from the user domain.
type Repository interface {
	// List returns every user that the repository knows about.
	List(ctx context.Context) ([]models.User, error)
	// GetUser fetches a single user by id.
	GetUser(ctx context.Context, id string) (models.User, error)
	// GetUsers fetches multiple users by their ids.
	GetUsers(ctx context.Context, ids []string) ([]models.User, error)
	// Create inserts a brand new user entry.
	Create(ctx context.Context, input CreateInput) (models.User, error)
	// Update mutates an existing user entry.
	Update(ctx context.Context, id string, input UpdateInput) (models.User, error)
	// Delete removes a user entry.
	Delete(ctx context.Context, id string) error
}
