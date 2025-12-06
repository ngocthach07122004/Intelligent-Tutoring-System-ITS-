package usecase

import (
	"init-src/internal/region"
	"init-src/internal/shop"
	"init-src/pkg/log"
)

type implUsecase struct {
	l        log.Logger
	repo     shop.Repository
	regionUC region.Usecase
}

func New(l log.Logger, repo shop.Repository, regionUC region.Usecase) shop.Usecase {
	return &implUsecase{
		l:        l,
		repo:     repo,
		regionUC: regionUC,
	}
}
