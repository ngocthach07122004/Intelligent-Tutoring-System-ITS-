package asynq

import (
	"context"

	"init-src/internal/notification"
	"init-src/pkg/asynq"
	"init-src/pkg/log"
)

// Handler interface for notification task handlers
type Handler interface {
	HandleNewMessage(ctx context.Context, task *asynq.Task) error
	HandleClassInvite(ctx context.Context, task *asynq.Task) error
}

type handler struct {
	l  log.Logger
	uc notification.Usecase
}

// New creates a new notification handler instance
func New(l log.Logger, uc notification.Usecase) Handler {
	return &handler{
		l:  l,
		uc: uc,
	}
}
