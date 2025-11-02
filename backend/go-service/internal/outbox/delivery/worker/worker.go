package worker

import (
	"context"
	"time"
)

// Start starts the outbox poller worker
// This method blocks until the context is cancelled
func (w *Worker) Start(ctx context.Context) {
	ticker := time.NewTicker(w.pollInterval)
	defer ticker.Stop()

	w.l.Infof(ctx, "outbox.worker.Start: polling every %v", w.pollInterval)

	for {
		select {
		case <-ctx.Done():
			w.l.Infof(ctx, "outbox.worker.Stop: context cancelled")
			return
		case <-ticker.C:
			if err := w.poll(ctx); err != nil {
				w.l.Warnf(ctx, "outbox.worker.poll error: %v", err)
			}
		}
	}
}

func (w *Worker) poll(ctx context.Context) error {
	return w.uc.PollAndProcess(ctx)
}
