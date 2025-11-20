package usecase

import (
	"init-src/internal/projection"
	"init-src/pkg/log"
)

type implUsecase struct {
	l    log.Logger
	repo projection.Repository
}

// New creates a new projection use case
func New(l log.Logger, repo projection.Repository) projection.Usecase {
	return &implUsecase{
		l:    l,
		repo: repo,
	}
}
