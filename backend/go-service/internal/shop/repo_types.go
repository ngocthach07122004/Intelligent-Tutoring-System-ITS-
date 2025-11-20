package shop

import "init-src/internal/models"

type CreateOptions struct {
	Name  string
	Alias string
	Code  string
}

type UpdateOptions struct {
	Shop  models.Shop
	Name  string
	Alias string
	Code  string
}
