package usecase

import (
	"init-src/internal/outbox"
	"init-src/pkg/asynq"
	"init-src/pkg/log"
)

type implUsecase struct {
	l           log.Logger
	repo        outbox.Repository
	asynqClient *asynq.Client
	config      outbox.PollConfig
}

// New creates a new outbox use case
func New(
	l log.Logger,
	repo outbox.Repository,
	asynqClient *asynq.Client,
	config outbox.PollConfig,
) outbox.UseCase {
	return &implUsecase{
		l:           l,
		repo:        repo,
		asynqClient: asynqClient,
		config:      config,
	}
}
