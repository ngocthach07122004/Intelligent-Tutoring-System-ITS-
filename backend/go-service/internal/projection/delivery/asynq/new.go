package asynq

import (
	"context"
	"init-src/internal/projection"
	"init-src/pkg/asynq"
	"init-src/pkg/log"
)

type Handler interface {
	HandleMessage(ctx context.Context, task *asynq.Task) error
	HandleConversation(ctx context.Context, task *asynq.Task) error
}
type handler struct {
	l  log.Logger
	uc projection.Usecase
}

// NewProjectionHandlers creates a new projection handlers instance
func New(l log.Logger, uc projection.Usecase) Handler {
	return &handler{
		l:  l,
		uc: uc,
	}
}
