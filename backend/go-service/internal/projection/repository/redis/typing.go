package redis

import (
	"context"
	"fmt"
	"strings"
)

// SetTyping sets typing indicator for a user in a conversation
func (r *implRepository) SetTyping(ctx context.Context, conversationID string, userID string, ttl int64) error {
	key := fmt.Sprintf("typing:%s:%s", conversationID, userID)
	return r.redis.Set(ctx, key, "1", int(ttl))
}

// GetTypingUsers gets all users currently typing in a conversation
func (r *implRepository) GetTypingUsers(ctx context.Context, conversationID string) ([]string, error) {
	pattern := fmt.Sprintf("typing:%s:*", conversationID)

	// Use RawClient for KEYS operation
	keys, err := r.redis.RawClient().Keys(ctx, pattern).Result()
	if err != nil {
		return nil, err
	}

	// Extract userIDs from keys
	var userIDs []string
	prefix := fmt.Sprintf("typing:%s:", conversationID)
	for _, key := range keys {
		if strings.HasPrefix(key, prefix) {
			userID := strings.TrimPrefix(key, prefix)
			userIDs = append(userIDs, userID)
		}
	}

	return userIDs, nil
}
