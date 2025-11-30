package postgres

import (
	"init-src/internal/forum"
	"init-src/pkg/log"
	"init-src/pkg/postgres"
)

type implRepository struct {
	l  log.Logger
	db postgres.Database
}

func New(l log.Logger, db postgres.Database) forum.Repository {
	return &implRepository{
		l:  l,
		db: db,
	}
}
