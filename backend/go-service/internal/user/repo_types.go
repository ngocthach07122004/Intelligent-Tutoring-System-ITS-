package user

import models "init-src/internal/models"

type CreateOptions struct {
	Username     string
	Email        string
	Password     string
	Role         string
	ShopID       string
	RegionID     string
	BranchID     string
	DepartmentID string
}

type UpdateOptions struct {
	User         models.User
	Username     string
	Email        string
	Password     string
	Role         string
	ShopID       string
	RegionID     string
	BranchID     string
	DepartmentID string
}
