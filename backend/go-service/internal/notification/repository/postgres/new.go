package postgres

import (
	"init-src/internal/notification"
	"init-src/pkg/log"
	"init-src/pkg/postgres"
)

type implRepository struct {
	l  log.Logger
	db postgres.Database
}

// New creates a new notification repository
func New(l log.Logger, db postgres.Database) notification.Repository {
	return &implRepository{
		l:  l,
		db: db,
	}
}
