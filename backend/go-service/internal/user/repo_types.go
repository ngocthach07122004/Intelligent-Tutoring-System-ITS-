package user

// CreateInput captures the minimum information for creating a mock user.
type CreateInput struct {
	Username string
	Name     string
	Avatar   string
	Role     string
}

// UpdateInput captures optional fields for updating a mock user.
type UpdateInput struct {
	Username *string
	Name     *string
	Avatar   *string
	Role     *string
}
