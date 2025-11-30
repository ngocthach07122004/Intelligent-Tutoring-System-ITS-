package usecase

import (
	"init-src/internal/conversation"
	"init-src/internal/message"
	"init-src/internal/outbox"
	"init-src/internal/user" // Import the user package

	"init-src/pkg/log"
	"init-src/pkg/postgres"
)

type implUsecase struct {
	l                log.Logger
	repo             message.Repository
	conversationRepo conversation.Repository
	outboxRepo       outbox.Repository
	userRepo         user.Repository // Add user repository
	db               postgres.Database
}

// New creates a new message use case
func New(l log.Logger, repo message.Repository, conversationRepo conversation.Repository, outboxRepo outbox.Repository, userRepo user.Repository, db postgres.Database) message.Usecase {
	return &implUsecase{
		l:                l,
		repo:             repo,
		conversationRepo: conversationRepo,
		outboxRepo:       outboxRepo,
		userRepo:         userRepo, // Assign user repository
		db:               db,
	}
}
