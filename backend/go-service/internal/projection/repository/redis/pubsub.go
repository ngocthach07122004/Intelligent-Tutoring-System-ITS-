package redis

import (
	"context"
)

// PublishEvent publishes an event to a Redis Pub/Sub channel
func (r *implRepository) PublishEvent(ctx context.Context, channel string, event string) error {
	return r.redis.Publish(ctx, channel, event)
}
