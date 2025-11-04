package asynq

import (
	"github.com/hibiken/asynq"
	"github.com/redis/go-redis/v9"
)

// Client wraps asynq.Client
type Client struct {
	client *asynq.Client
}

// ClientConfig holds configuration for Asynq client
type ClientConfig struct {
	RedisClient *redis.Client
}

// NewClient creates a new Asynq client
func NewClient(cfg ClientConfig) *Client {
	asynqClient := asynq.NewClient(asynq.RedisClientOpt{
		Addr:     cfg.RedisClient.Options().Addr,
		Password: cfg.RedisClient.Options().Password,
		DB:       cfg.RedisClient.Options().DB,
	})

	return &Client{client: asynqClient}
}

// Task represents an Asynq task
type Task struct {
	task *asynq.Task
}

// NewTask creates a new task with the given type name and payload
func NewTask(typename string, payload []byte) *Task {
	return &Task{
		task: asynq.NewTask(typename, payload),
	}
}

// EnqueueOption represents options for enqueuing tasks
type EnqueueOption interface {
	apply() asynq.Option
}

type queueOption struct {
	name string
}

func (q queueOption) apply() asynq.Option {
	return asynq.Queue(q.name)
}

// Queue creates a queue option for task enqueuing
func Queue(name string) EnqueueOption {
	return queueOption{name: name}
}

// Enqueue enqueues a task with optional enqueue options
func (c *Client) Enqueue(task *Task, opts ...EnqueueOption) (*TaskInfo, error) {
	var asynqOpts []asynq.Option
	for _, opt := range opts {
		asynqOpts = append(asynqOpts, opt.apply())
	}

	info, err := c.client.Enqueue(task.task, asynqOpts...)
	if err != nil {
		return nil, err
	}

	return &TaskInfo{
		ID:    info.ID,
		Queue: info.Queue,
		Type:  info.Type,
	}, nil
}

// TaskInfo contains metadata about an enqueued task
type TaskInfo struct {
	ID    string
	Queue string
	Type  string
}

// Close closes the client connection
func (c *Client) Close() error {
	return c.client.Close()
}
