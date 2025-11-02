package redis

import (
	"context"
	"time"

	"github.com/redis/go-redis/v9"
)

// Z represents a sorted set member with score
type Z struct {
	Score  float64
	Member interface{}
}

// toRedisZ converts our Z to redis.Z
func toRedisZ(z Z) redis.Z {
	return redis.Z{
		Score:  z.Score,
		Member: z.Member,
	}
}

func Connect(opts ClientOptions) (Client, error) {
	cl := redis.NewClient(opts.clo)
	return &redisClient{cl: cl}, nil
}

type Database interface {
	Client() Client
}

type Client interface {
	Disconnect() error

	// String operations
	Get(ctx context.Context, key string) ([]byte, error)
	Set(ctx context.Context, key string, value interface{}, expiration int) error
	Incr(ctx context.Context, key string) error
	Del(ctx context.Context, keys ...string) error
	Expire(ctx context.Context, key string, expiration time.Duration) error

	// Hash operations
	HSet(ctx context.Context, key string, values map[string]interface{}) error
	HGet(ctx context.Context, key string, field string) (string, error)

	// Set operations
	SAdd(ctx context.Context, key string, members ...interface{}) error
	SRem(ctx context.Context, key string, members ...interface{}) error

	// Sorted Set operations
	ZAdd(ctx context.Context, key string, z Z) error
	ZRem(ctx context.Context, key string, members ...interface{}) error
	ZRemRangeByRank(ctx context.Context, key string, start int64, stop int64) error

	// Pub/Sub operations
	Publish(ctx context.Context, channel string, message interface{}) error
	Subscribe(ctx context.Context, channels ...string) *redis.PubSub
	PSubscribe(ctx context.Context, patterns ...string) *redis.PubSub

	RawClient() *redis.Client // Expose underlying client for integrations
}

type redisClient struct {
	cl *redis.Client
}

func (rc *redisClient) Disconnect() error {
	return rc.cl.Close()
}

// String operations
func (rc *redisClient) Get(ctx context.Context, key string) ([]byte, error) {
	return rc.cl.Get(ctx, key).Bytes()
}

func (rc *redisClient) Set(ctx context.Context, key string, value interface{}, expiration int) error {
	return rc.cl.Set(ctx, key, value, time.Second*time.Duration(expiration)).Err()
}

func (rc *redisClient) Incr(ctx context.Context, key string) error {
	return rc.cl.Incr(ctx, key).Err()
}

func (rc *redisClient) Del(ctx context.Context, keys ...string) error {
	return rc.cl.Del(ctx, keys...).Err()
}

func (rc *redisClient) Expire(ctx context.Context, key string, expiration time.Duration) error {
	return rc.cl.Expire(ctx, key, expiration).Err()
}

// Hash operations
func (rc *redisClient) HSet(ctx context.Context, key string, values map[string]interface{}) error {
	return rc.cl.HSet(ctx, key, values).Err()
}

func (rc *redisClient) HGet(ctx context.Context, key string, field string) (string, error) {
	return rc.cl.HGet(ctx, key, field).Result()
}

// Set operations
func (rc *redisClient) SAdd(ctx context.Context, key string, members ...interface{}) error {
	return rc.cl.SAdd(ctx, key, members...).Err()
}

func (rc *redisClient) SRem(ctx context.Context, key string, members ...interface{}) error {
	return rc.cl.SRem(ctx, key, members...).Err()
}

// Sorted Set operations
func (rc *redisClient) ZAdd(ctx context.Context, key string, z Z) error {
	return rc.cl.ZAdd(ctx, key, toRedisZ(z)).Err()
}

func (rc *redisClient) ZRem(ctx context.Context, key string, members ...interface{}) error {
	return rc.cl.ZRem(ctx, key, members...).Err()
}

func (rc *redisClient) ZRemRangeByRank(ctx context.Context, key string, start int64, stop int64) error {
	return rc.cl.ZRemRangeByRank(ctx, key, start, stop).Err()
}

// Pub/Sub operations
func (rc *redisClient) Publish(ctx context.Context, channel string, message interface{}) error {
	return rc.cl.Publish(ctx, channel, message).Err()
}

func (rc *redisClient) Subscribe(ctx context.Context, channels ...string) *redis.PubSub {
	return rc.cl.Subscribe(ctx, channels...)
}

func (rc *redisClient) PSubscribe(ctx context.Context, patterns ...string) *redis.PubSub {
	return rc.cl.PSubscribe(ctx, patterns...)
}

func (rc *redisClient) RawClient() *redis.Client {
	return rc.cl
}
