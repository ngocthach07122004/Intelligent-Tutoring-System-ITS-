package department

import (
	"init-src/internal/models"
	paginator "init-src/pkg/paginator"
)

type CreateInput struct {
	Name     string
	RegionID string
	ShopID   string
	BranchID string
}

type UpdateInput struct {
	Name     string
	BranchID string
}

type Filter struct {
	ID       string
	Name     string
	Code     string
	Alias    string
	RegionID string
	ShopID   string
	BranchID string
}

type ListInput struct {
	Filter Filter
}

type GetInput struct {
	Filter Filter
	Pagin  paginator.PaginatorQuery
}

type GetOneInput struct {
	Filter Filter
}

type GetOutput struct {
	Departments []models.Department
	Pagin       paginator.Paginator
}

type GetOneOutput struct {
	Department models.Department
}
