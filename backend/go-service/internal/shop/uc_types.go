package shop

import (
	"init-src/internal/models"
	paginator "init-src/pkg/paginator"
)

type CreateInput struct {
	Name string
}

type UpdateInput struct {
	Name string
}

type Filter struct {
	ID    string
	Name  string
	Alias string
	Code  string
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
	Shops []models.Shop
	Pagin paginator.Paginator
}

type GetOneOutput struct {
	Shop models.Shop
}
