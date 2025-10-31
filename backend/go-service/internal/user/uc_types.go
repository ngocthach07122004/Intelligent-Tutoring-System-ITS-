package user

import (
	"init-src/internal/models"
	paginator "init-src/pkg/paginator"
)

type SignUpInput struct {
	Username string
	Email    string
	Password string
	ShopName string
}

type UpdateInput struct {
	Username     string
	Email        string
	Password     string
	Role         string
	ShopID       string
	RegionID     string
	BranchID     string
	DepartmentID string
}

type CreateUserInput struct {
	Username     string
	Email        string
	Password     string
	Role         string
	ShopID       string
	RegionID     string
	BranchID     string
	DepartmentID string
}

type LoginInput struct {
	Email    string
	Password string
	ShopID   string
}

type ChangeBranchInput struct {
	BranchID string
}

type Filter struct {
	ID           string
	Username     string
	Email        string
	Role         string
	ShopID       string
	RegionID     string
	BranchID     string
	DepartmentID string
}

type ListInput struct {
	Filter
}

type GetInput struct {
	Filter Filter
	Pagin  paginator.PaginatorQuery
}

type GetOneInput struct {
	Filter
}

type GetOutPut struct {
	Users       []models.User
	Shops       []models.Shop
	Regions     []models.Region
	Branches    []models.Branch
	Departments []models.Department
	Pagin       paginator.Paginator
}

type GetOneOutPut struct {
	User       models.User
	Shop       *models.Shop
	Region     *models.Region
	Branch     *models.Branch
	Department *models.Department
}
