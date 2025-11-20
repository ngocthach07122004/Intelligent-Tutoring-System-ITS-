package redis

import (
	"context"
	"fmt"

	pkgRedis "init-src/pkg/redis"
)

// AddToConversationList adds a conversation to user's conversation list
func (r *implRepository) AddToConversationList(ctx context.Context, userID string, conversationID string, timestamp int64) error {
	key := fmt.Sprintf("conv:%s:list", userID)
	return r.redis.ZAdd(ctx, key, pkgRedis.Z{
		Score:  float64(timestamp),
		Member: conversationID,
	})
}

// RemoveFromConversationList removes a conversation from user's list
func (r *implRepository) RemoveFromConversationList(ctx context.Context, userID string, conversationID string) error {
	key := fmt.Sprintf("conv:%s:list", userID)
	return r.redis.ZRem(ctx, key, conversationID)
}

// LimitConversationList limits the conversation list to most recent N conversations
func (r *implRepository) LimitConversationList(ctx context.Context, userID string, limit int) error {
	key := fmt.Sprintf("conv:%s:list", userID)
	// Keep top N, remove rest (0-indexed, so we remove 0 to -(limit+1))
	return r.redis.ZRemRangeByRank(ctx, key, 0, int64(-limit-1))
}

// SetConversationMeta sets conversation metadata fields
func (r *implRepository) SetConversationMeta(ctx context.Context, conversationID string, fields map[string]interface{}) error {
	key := fmt.Sprintf("conv:%s:meta", conversationID)
	return r.redis.HSet(ctx, key, fields)
}

// GetConversationMeta gets a specific field from conversation metadata
func (r *implRepository) GetConversationMeta(ctx context.Context, conversationID string, field string) (string, error) {
	key := fmt.Sprintf("conv:%s:meta", conversationID)
	return r.redis.HGet(ctx, key, field)
}

// IncrementUnread increments unread counter for a user in a conversation
func (r *implRepository) IncrementUnread(ctx context.Context, conversationID string, userID string) error {
	key := fmt.Sprintf("conv:%s:unread:%s", conversationID, userID)
	return r.redis.Incr(ctx, key)
}

// ResetUnread resets unread counter to 0
func (r *implRepository) ResetUnread(ctx context.Context, conversationID string, userID string) error {
	key := fmt.Sprintf("conv:%s:unread:%s", conversationID, userID)
	return r.redis.Set(ctx, key, "0", 0) // No TTL
}

// GetUnread gets unread count
func (r *implRepository) GetUnread(ctx context.Context, conversationID string, userID string) (int64, error) {
	key := fmt.Sprintf("conv:%s:unread:%s", conversationID, userID)
	val, err := r.redis.Get(ctx, key)
	if err != nil {
		return 0, err
	}

	// Parse to int64
	var count int64
	fmt.Sscanf(string(val), "%d", &count)
	return count, nil
}

// AddParticipant adds a participant to conversation's participant set
func (r *implRepository) AddParticipant(ctx context.Context, conversationID string, userID string) error {
	key := fmt.Sprintf("conv:%s:participants", conversationID)
	return r.redis.SAdd(ctx, key, userID)
}

// RemoveParticipant removes a participant from conversation
func (r *implRepository) RemoveParticipant(ctx context.Context, conversationID string, userID string) error {
	key := fmt.Sprintf("conv:%s:participants", conversationID)
	return r.redis.SRem(ctx, key, userID)
}

// GetParticipants gets all participants of a conversation
func (r *implRepository) GetParticipants(ctx context.Context, conversationID string) ([]string, error) {
	key := fmt.Sprintf("conv:%s:participants", conversationID)

	// Use RawClient for SMEMBERS
	members, err := r.redis.RawClient().SMembers(ctx, key).Result()
	if err != nil {
		return nil, err
	}

	return members, nil
}
