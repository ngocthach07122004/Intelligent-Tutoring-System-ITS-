package http

import (
	"init-src/internal/models"
	"init-src/internal/user"
)

type userRequest struct {
	Username string `json:"username" binding:"required"`
	Name     string `json:"name" binding:"required"`
	Avatar   string `json:"avatar"`
	Role     string `json:"role"`
}

type updateUserRequest struct {
	Username *string `json:"username"`
	Name     *string `json:"name"`
	Avatar   *string `json:"avatar"`
	Role     *string `json:"role"`
}

type userResponse struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	Name     string `json:"name"`
	Avatar   string `json:"avatar"`
	Role     string `json:"role"`
}

func (r userRequest) toCreateInput() user.CreateInput {
	return user.CreateInput{
		Username: r.Username,
		Name:     r.Name,
		Avatar:   r.Avatar,
		Role:     r.Role,
	}
}

func (r updateUserRequest) toUpdateInput() user.UpdateInput {
	return user.UpdateInput{
		Username: r.Username,
		Name:     r.Name,
		Avatar:   r.Avatar,
		Role:     r.Role,
	}
}

func newUserResponse(u models.User) userResponse {
	return userResponse{
		ID:       u.ID.Hex(),
		Username: u.Username,
		Name:     u.Name,
		Avatar:   u.Avatar,
		Role:     u.Role,
	}
}

func newUserListResponse(users []models.User) []userResponse {
	res := make([]userResponse, len(users))
	for i, u := range users {
		res[i] = newUserResponse(u)
	}
	return res
}
