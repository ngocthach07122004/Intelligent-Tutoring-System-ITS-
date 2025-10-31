package usecase

import (
	"init-src/internal/branch"
	"init-src/internal/department"
	"init-src/pkg/log"
)

type implUsecase struct {
	l      log.Logger
	repo   branch.Repository
	deptUC department.Usecase
}

func New(l log.Logger, repo branch.Repository, deptUC department.Usecase) branch.Usecase {
	return &implUsecase{
		l:      l,
		repo:   repo,
		deptUC: deptUC,
	}
}
