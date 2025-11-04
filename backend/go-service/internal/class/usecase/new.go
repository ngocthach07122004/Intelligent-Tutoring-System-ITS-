package usecase

import (
	"init-src/internal/class"
	"init-src/internal/outbox"
	"init-src/pkg/log"
	"init-src/pkg/postgres"
)

type implUsecase struct {
	l          log.Logger
	repo       class.Repository
	outboxRepo outbox.Repository
	db         postgres.Database
}

// New creates a new class use case
func New(l log.Logger, repo class.Repository, outboxRepo outbox.Repository, db postgres.Database) class.Usecase {
	return &implUsecase{
		l:          l,
		repo:       repo,
		outboxRepo: outboxRepo,
		db:         db,
	}
}
