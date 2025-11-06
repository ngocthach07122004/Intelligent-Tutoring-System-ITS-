package worker

import (
	"time"

	"init-src/internal/outbox"
	"init-src/pkg/log"
)

// Worker handles outbox polling in a background goroutine
type Worker struct {
	l            log.Logger
	uc           outbox.UseCase
	pollInterval time.Duration
}

// New creates a new outbox worker
func New(l log.Logger, uc outbox.UseCase) *Worker {
	return &Worker{
		l:            l,
		uc:           uc,
		pollInterval: 100 * time.Millisecond, // Poll every 100ms
	}
}

// SetPollInterval sets the polling interval (for testing/configuration)
func (w *Worker) SetPollInterval(interval time.Duration) {
	w.pollInterval = interval
}
