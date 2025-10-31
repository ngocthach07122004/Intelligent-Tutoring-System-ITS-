package outbox

// PollConfig contains configuration for polling behavior
type PollConfig struct {
	BatchSize int // Number of events to process per batch
}
