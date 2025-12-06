package usecase

import (
	"init-src/internal/conversation"
	"init-src/internal/outbox"
	"init-src/pkg/log"
	"init-src/pkg/postgres"
)

type implUsecase struct {
	l          log.Logger
	repo       conversation.Repository
	outboxRepo outbox.Repository
	db         postgres.Database
}

// New creates a new conversation use case
func New(l log.Logger, repo conversation.Repository, outboxRepo outbox.Repository, db postgres.Database) conversation.Usecase {
	return &implUsecase{
		l:          l,
		repo:       repo,
		outboxRepo: outboxRepo,
		db:         db,
	}
}
