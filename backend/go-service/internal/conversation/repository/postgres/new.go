package postgres

import (
	"init-src/internal/conversation"
	"init-src/pkg/log"
	"init-src/pkg/postgres"
)

type implRepository struct {
	l  log.Logger
	db postgres.Database
}

// New creates a new conversation repository
func New(l log.Logger, db postgres.Database) conversation.Repository {
	return &implRepository{
		l:  l,
		db: db,
	}
}
