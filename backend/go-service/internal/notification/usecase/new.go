package usecase

import (
	"init-src/internal/notification"
	"init-src/pkg/log"
	"init-src/pkg/postgres"
	"init-src/pkg/redis"
)

type implUsecase struct {
	l     log.Logger
	repo  notification.Repository
	db    postgres.Database
	redis redis.Client
}

// New creates a new notification use case
func New(l log.Logger, repo notification.Repository, db postgres.Database, redisClient redis.Client) notification.Usecase {
	return &implUsecase{
		l:     l,
		repo:  repo,
		db:    db,
		redis: redisClient,
	}
}
