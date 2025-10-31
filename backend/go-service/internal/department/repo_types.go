package department

import "init-src/internal/models"

type CreateOptions struct {
	Name     string
	Alias    string
	Code     string
	BranchID string
	ShopID   string
	RegionID string
}

type UpdateOptions struct {
	Dept     models.Department
	Name     string
	Alias    string
	Code     string
	BranchID string
}
