package usecase

import (
	"init-src/internal/forum"
	"init-src/internal/user"
	"init-src/pkg/log"
	"init-src/pkg/postgres"
)

type implUsecase struct {
	l        log.Logger
	repo     forum.Repository
	userRepo user.Repository
	db       postgres.Database
}

func New(l log.Logger, repo forum.Repository, userRepo user.Repository, db postgres.Database) forum.Usecase {
	return &implUsecase{
		l:        l,
		repo:     repo,
		userRepo: userRepo,
		db:       db,
	}
}
