package asynq

import (
	"context"

	"github.com/hibiken/asynq"
	"github.com/redis/go-redis/v9"
)

// Server wraps asynq.Server
type Server struct {
	server *asynq.Server
	mux    *asynq.ServeMux
}

// ServerConfig holds configuration for Asynq server
type ServerConfig struct {
	RedisClient *redis.Client
	Concurrency int // Number of concurrent workers
}

// NewServer creates a new Asynq server
func NewServer(cfg ServerConfig) *Server {
	concurrency := cfg.Concurrency
	if concurrency == 0 {
		concurrency = 10 // Default
	}

	asynqServer := asynq.NewServer(
		asynq.RedisClientOpt{
			Addr:     cfg.RedisClient.Options().Addr,
			Password: cfg.RedisClient.Options().Password,
			DB:       cfg.RedisClient.Options().DB,
		},
		asynq.Config{
			Concurrency: concurrency,
			Queues: map[string]int{
				"critical": 6, // 60% of workers
				"default":  3, // 30% of workers
				"low":      1, // 10% of workers
			},
		},
	)

	mux := asynq.NewServeMux()

	return &Server{
		server: asynqServer,
		mux:    mux,
	}
}

// HandlerFunc is the handler function type for tasks
type HandlerFunc func(context.Context, *Task) error

// HandleFunc registers a handler function for a task type
func (s *Server) HandleFunc(pattern string, handler HandlerFunc) {
	// Wrap our handler to work with asynq's handler
	s.mux.HandleFunc(pattern, func(ctx context.Context, t *asynq.Task) error {
		// Wrap the asynq.Task in our Task wrapper
		wrappedTask := &Task{task: t}
		return handler(ctx, wrappedTask)
	})
}

// Start starts the Asynq server
func (s *Server) Start() error {
	return s.server.Run(s.mux)
}

// Shutdown gracefully shuts down the server
func (s *Server) Shutdown() {
	s.server.Shutdown()
}

// Payload returns the payload data of the task
func (t *Task) Payload() []byte {
	return t.task.Payload()
}

// Type returns the type name of the task
func (t *Task) Type() string {
	return t.task.Type()
}
