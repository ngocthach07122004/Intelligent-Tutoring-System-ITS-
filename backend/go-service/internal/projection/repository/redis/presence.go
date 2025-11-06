package redis

import (
	"context"
	"fmt"
)

// SetPresence sets user presence status with TTL
func (r *implRepository) SetPresence(ctx context.Context, userID string, status string, ttl int64) error {
	key := fmt.Sprintf("presence:%s", userID)
	return r.redis.Set(ctx, key, status, int(ttl))
}

// GetPresence gets user presence status
func (r *implRepository) GetPresence(ctx context.Context, userID string) (string, error) {
	key := fmt.Sprintf("presence:%s", userID)
	val, err := r.redis.Get(ctx, key)
	if err != nil {
		return "", err
	}
	return string(val), nil
}
