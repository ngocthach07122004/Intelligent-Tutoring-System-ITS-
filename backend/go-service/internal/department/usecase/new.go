package usecase

import (
	"init-src/internal/department"
	"init-src/pkg/log"
)

type implUsecase struct {
	l    log.Logger
	repo department.Repository
}

func New(l log.Logger, repo department.Repository) department.Usecase {
	return &implUsecase{
		repo: repo,
		l:    l,
	}
}
