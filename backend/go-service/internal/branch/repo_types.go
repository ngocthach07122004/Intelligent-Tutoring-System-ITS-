package branch

import models "init-src/internal/models"

type CreateOptions struct {
	Name     string
	RegionID string
	ShopID   string
	Alias    string
	Code     string
}

type UpdateOptions struct {
	Branch   models.Branch
	Name     string
	RegionID string
	Alias    string
	Code     string
}
