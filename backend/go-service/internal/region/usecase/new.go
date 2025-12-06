package usecase

import (
	"init-src/internal/branch"
	"init-src/internal/region"
	"init-src/pkg/log"
)

type implUsecase struct {
	l        log.Logger
	repo     region.Repository
	branchUC branch.Usecase
}

func New(l log.Logger, repo region.Repository, branchUC branch.Usecase) region.Usecase {
	return &implUsecase{
		l:        l,
		repo:     repo,
		branchUC: branchUC,
	}
}
