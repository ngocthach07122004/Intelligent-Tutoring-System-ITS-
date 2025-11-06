package mongo

import (
	"time"

	"init-src/internal/shop"
	"init-src/pkg/log"
	"init-src/pkg/mongo"
)

type implRepository struct {
	l     log.Logger
	db    mongo.Database
	clock func() time.Time
}

func New(l log.Logger, db mongo.Database) shop.Repository {
	return &implRepository{
		l:     l,
		db:    db,
		clock: time.Now,
	}
}
