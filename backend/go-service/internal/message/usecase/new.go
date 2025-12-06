package usecase

import (
	"init-src/internal/conversation"
	"init-src/internal/message"
	"init-src/internal/outbox"
	"init-src/pkg/log"
	"init-src/pkg/postgres"
)

type implUsecase struct {
	l                log.Logger
	repo             message.Repository
	conversationRepo conversation.Repository
	outboxRepo       outbox.Repository
	db               postgres.Database
}

// New creates a new message use case
func New(l log.Logger, repo message.Repository, conversationRepo conversation.Repository, outboxRepo outbox.Repository, db postgres.Database) message.Usecase {
	return &implUsecase{
		l:                l,
		repo:             repo,
		conversationRepo: conversationRepo,
		outboxRepo:       outboxRepo,
		db:               db,
	}
}
