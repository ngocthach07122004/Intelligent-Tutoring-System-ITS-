package postgres

import (
	"init-src/internal/class"
	"init-src/pkg/log"
	"init-src/pkg/postgres"
)

type implRepository struct {
	l  log.Logger
	db postgres.Database
}

// New creates a new class repository
func New(l log.Logger, db postgres.Database) class.Repository {
	return &implRepository{
		l:  l,
		db: db,
	}
}
