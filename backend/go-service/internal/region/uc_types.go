package region

import (
	"init-src/internal/models"
	"init-src/pkg/paginator"
)

type CreateInput struct {
	Name   string
	ShopID string
}

type UpdateInput struct {
	Name string
}

type Filter struct {
	ID     string
	Name   string
	Code   string
	Alias  string
	ShopID string
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
	Regions []models.Region
	Pagin   paginator.Paginator
}

type GetOneOutput struct {
	Region models.Region
}
