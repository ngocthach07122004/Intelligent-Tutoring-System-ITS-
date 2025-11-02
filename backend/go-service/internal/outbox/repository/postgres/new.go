package postgres

import (
	"init-src/internal/outbox"
	"init-src/pkg/log"
	"init-src/pkg/postgres"
)

type implRepository struct {
	l  log.Logger
	db postgres.Database
}

// New creates a new outbox repository
func New(l log.Logger, db postgres.Database) outbox.Repository {
	return &implRepository{
		l:  l,
		db: db,
	}
}
