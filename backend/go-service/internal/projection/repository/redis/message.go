package redis

import (
	"context"
	"fmt"
	"time"
)

// CacheMessage caches a message with TTL
func (r *implRepository) CacheMessage(ctx context.Context, messageID string, fields map[string]interface{}, ttl int64) error {
	key := fmt.Sprintf("msg:%s", messageID)

	// Set fields
	if err := r.redis.HSet(ctx, key, fields); err != nil {
		return err
	}

	// Set TTL (convert seconds to duration)
	return r.redis.Expire(ctx, key, time.Duration(ttl)*time.Second)
}

// UpdateMessageCache updates specific fields of a cached message
func (r *implRepository) UpdateMessageCache(ctx context.Context, messageID string, fields map[string]interface{}) error {
	key := fmt.Sprintf("msg:%s", messageID)
	return r.redis.HSet(ctx, key, fields)
}

// DeleteMessageCache deletes a cached message
func (r *implRepository) DeleteMessageCache(ctx context.Context, messageID string) error {
	key := fmt.Sprintf("msg:%s", messageID)
	return r.redis.Del(ctx, key)
}
