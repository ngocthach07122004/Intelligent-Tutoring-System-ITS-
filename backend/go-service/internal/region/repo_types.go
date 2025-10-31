package region

import models "init-src/internal/models"

type CreateOptions struct {
	Name   string
	Alias  string
	Code   string
	ShopID string
}

type UpdateOptions struct {
	Region models.Region
	Name   string
	Alias  string
	Code   string
}
