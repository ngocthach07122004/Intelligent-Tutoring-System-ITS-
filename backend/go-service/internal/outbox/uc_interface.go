package outbox

import "context"

//go:generate mockery --name=UseCase
type UseCase interface {
	// PollAndProcess polls pending events and processes them
	PollAndProcess(ctx context.Context) error
}
