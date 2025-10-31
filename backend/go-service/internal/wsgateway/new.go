package websocket

import (
	"context"
	"init-src/internal/projection"
	"init-src/pkg/jwt"
	"init-src/pkg/log"

	"init-src/internal/websocket"
	"init-src/pkg/redis"
)

type WSGateway struct {
	hub        *websocket.Hub
	subscriber *websocket.Subscriber
	l          log.Logger
	ctx        context.Context
	cancel     context.CancelFunc
}

// NewGateway creates a new WebSocket gateway
func NewGateway(ctx context.Context, jwtManager jwt.Manager, redisClient redis.Client, projector projection.Usecase, l log.Logger) *WSGateway {
	gwCtx, cancel := context.WithCancel(ctx)

	hub := websocket.NewHub(gwCtx, jwtManager, projector, l)
	subscriber := websocket.NewSubscriber(gwCtx, redisClient, hub, l)

	return &WSGateway{
		hub:        hub,
		subscriber: subscriber,
		l:          l,
		ctx:        gwCtx,
		cancel:     cancel,
	}
}
