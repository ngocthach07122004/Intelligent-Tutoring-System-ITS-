package redis

import (
	"init-src/internal/projection"
	"init-src/pkg/log"
	"init-src/pkg/redis"
)

type implRepository struct {
	l     log.Logger
	redis redis.Client
}

// New creates a new projection repository
func New(l log.Logger, redisClient redis.Client) projection.Repository {
	return &implRepository{
		l:     l,
		redis: redisClient,
	}
}
