package websocket

import (
	"context"
	"encoding/json"
	"strings"

	"init-src/pkg/log"
	"init-src/pkg/redis"
)

// Subscriber listens to Redis Pub/Sub and broadcasts to WebSocket clients
type Subscriber struct {
	redis redis.Client
	hub   *Hub
	l     log.Logger
	ctx   context.Context
}

// NewSubscriber creates a new Redis subscriber
func NewSubscriber(ctx context.Context, redis redis.Client, hub *Hub, l log.Logger) *Subscriber {
	return &Subscriber{
		redis: redis,
		hub:   hub,
		l:     l,
		ctx:   ctx,
	}
}

// Run starts listening to Redis Pub/Sub channels
func (s *Subscriber) Run() {
	// Subscribe to all ws:* channels using pattern
	pubsub := s.redis.PSubscribe(s.ctx, "ws:*")
	defer pubsub.Close()

	s.l.Infof(s.ctx, "websocket.Subscriber: started listening to Redis Pub/Sub pattern: ws:*")

	// Listen for messages
	ch := pubsub.Channel()
	for {
		select {
		case msg := <-ch:
			if msg == nil {
				continue
			}
			s.handleRedisMessage(msg.Channel, msg.Payload)

		case <-s.ctx.Done():
			s.l.Infof(s.ctx, "websocket.Subscriber: shutting down")
			return
		}
	}
}

// handleRedisMessage processes messages from Redis Pub/Sub
func (s *Subscriber) handleRedisMessage(channel string, payload string) {
	// Parse channel pattern: ws:conv:{id} or ws:user:{id}
	parts := strings.Split(channel, ":")
	if len(parts) != 3 {
		s.l.Warnf(s.ctx, "websocket.Subscriber: invalid channel format: %s", channel)
		return
	}

	channelType := parts[1] // "conv" or "user"
	channelID := parts[2]   // conversation_id or user_id

	// Parse payload as JSON
	var rawMsg map[string]interface{}
	if err := json.Unmarshal([]byte(payload), &rawMsg); err != nil {
		s.l.Errorf(s.ctx, "websocket.Subscriber: failed to unmarshal payload: %v", err)
		return
	}

	// Extract message type
	msgType, ok := rawMsg["type"].(string)
	if !ok {
		s.l.Warnf(s.ctx, "websocket.Subscriber: missing type in payload from channel: %s", channel)
		return
	}

	// Create WebSocket message
	wsMessage := ServerMessage{
		Type:    MessageType(msgType),
		Payload: rawMsg["data"],
	}

	// Broadcast based on channel type
	switch channelType {
	case "conv":
		// Broadcast to conversation subscribers
		s.hub.BroadcastToConversation(channelID, wsMessage, "")
		s.l.Debugf(s.ctx, "websocket.Subscriber: broadcast to conversation %s, type=%s", channelID, msgType)

	case "user":
		// Broadcast to specific user
		s.hub.BroadcastToUser(channelID, wsMessage)
		s.l.Debugf(s.ctx, "websocket.Subscriber: broadcast to user %s, type=%s", channelID, msgType)

	default:
		s.l.Warnf(s.ctx, "websocket.Subscriber: unknown channel type: %s", channelType)
	}
}

// Subscribe dynamically subscribes to a specific channel
func (s *Subscriber) Subscribe(channel string) error {
	// This can be used for dynamic subscription if needed
	return nil
}

// Unsubscribe dynamically unsubscribes from a channel
func (s *Subscriber) Unsubscribe(channel string) error {
	// This can be used for dynamic unsubscription if needed
	return nil
}
