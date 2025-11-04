package postgres

import (
	"init-src/internal/message"
	"init-src/pkg/log"
	"init-src/pkg/postgres"
)

type implRepository struct {
	l  log.Logger
	db postgres.Database
}

// New creates a new message repository
func New(l log.Logger, db postgres.Database) message.Repository {
	return &implRepository{
		l:  l,
		db: db,
	}
}
