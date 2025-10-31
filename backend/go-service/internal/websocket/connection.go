package websocket

import (
	"context"
	"encoding/json"
	"sync"
	"time"

	"init-src/pkg/log"
	pkgWs "init-src/pkg/websocket"

	"github.com/google/uuid"
)

const (
	// Time allowed to write a message to the peer
	writeWait = 10 * time.Second

	// Time allowed to read the next pong message from the peer
	pongWait = 60 * time.Second

	// Send pings to peer with this period (must be less than pongWait)
	pingPeriod = 30 * time.Second

	// Maximum message size allowed from peer
	maxMessageSize = 8192 // 8KB
)

// Connection represents a WebSocket connection
type Connection struct {
	conn          pkgWs.Conn
	sessionID     string
	userID        string
	conversations map[string]struct{}
	convMu        sync.RWMutex
	send          chan ServerMessage
	hub           *Hub
	l             log.Logger
	ctx           context.Context
	cancel        context.CancelFunc
	writeMu       sync.Mutex
}

// NewConnection creates a new WebSocket connection
func NewConnection(ctx context.Context, conn pkgWs.Conn, hub *Hub, l log.Logger) *Connection {
	connCtx, cancel := context.WithCancel(ctx)

	return &Connection{
		sessionID:     uuid.New().String(),
		conn:          conn,
		send:          make(chan ServerMessage, 256),
		conversations: make(map[string]struct{}),
		hub:           hub,
		l:             l,
		ctx:           connCtx,
		cancel:        cancel,
	}
}

// GetUserID returns the user ID of this connection
func (c *Connection) GetUserID() string {
	return c.userID
}

// SetUserID sets the user ID after authentication
func (c *Connection) SetUserID(userID string) {
	c.userID = userID
}

// GetSessionID returns the session ID
func (c *Connection) GetSessionID() string {
	return c.sessionID
}

// SubscribeConversations adds conversations to the subscription list
func (c *Connection) SubscribeConversations(convIDs []string) {
	c.convMu.Lock()
	defer c.convMu.Unlock()

	for _, convID := range convIDs {
		c.conversations[convID] = struct{}{}
	}
}

// IsSubscribedTo checks if connection is subscribed to a conversation
func (c *Connection) IsSubscribedTo(convID string) bool {
	c.convMu.RLock()
	defer c.convMu.RUnlock()

	_, ok := c.conversations[convID]
	return ok
}

// SendMessage sends a message to the WebSocket client
func (c *Connection) SendMessage(msg ServerMessage) {
	select {
	case c.send <- msg:
	default:
		c.l.Warnf(c.ctx, "websocket.Connection.SendMessage: send buffer full, dropping message for user=%s", c.userID)
	}
}

// ReadPump pumps messages from the WebSocket connection to the hub
func (c *Connection) ReadPump() {
	defer func() {
		c.hub.Unregister(c)
		c.cancel()
	}()

	for {
		var msg ClientMessage
		err := pkgWs.Read(c.ctx, c.conn, &msg)
		if err != nil {
			if pkgWs.CloseStatus(err) != pkgWs.StatusNormalClosure {
				c.l.Warnf(c.ctx, "websocket.Connection.ReadPump: read error: %v", err)
			}
			break
		}

		// Handle message based on type
		c.handleClientMessage(msg)
	}
}

// WritePump pumps messages from the hub to the WebSocket connection
func (c *Connection) WritePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.conn.Close(pkgWs.StatusNormalClosure, "")
	}()

	for {
		select {
		case message, ok := <-c.send:
			if !ok {
				// Hub closed the channel
				c.writeMessage(ServerMessage{
					Type: TypeError,
					Payload: ErrorPayload{
						Code:    1000,
						Message: "Connection closed",
					},
				})
				return
			}

			if err := c.writeMessage(message); err != nil {
				c.l.Errorf(c.ctx, "websocket.Connection.WritePump: write error: %v", err)
				return
			}

		case <-ticker.C:
			if err := c.writePing(); err != nil {
				c.l.Warnf(c.ctx, "websocket.Connection.WritePump: ping error: %v", err)
				return
			}

		case <-c.ctx.Done():
			return
		}
	}
}

// writeMessage writes a message to the WebSocket connection
func (c *Connection) writeMessage(msg ServerMessage) error {
	c.writeMu.Lock()
	defer c.writeMu.Unlock()

	ctx, cancel := context.WithTimeout(c.ctx, writeWait)
	defer cancel()

	return pkgWs.Write(ctx, c.conn, msg)
}

// writePing writes a ping message
func (c *Connection) writePing() error {
	c.writeMu.Lock()
	defer c.writeMu.Unlock()

	ctx, cancel := context.WithTimeout(c.ctx, writeWait)
	defer cancel()

	return c.conn.Ping(ctx)
}

// handleClientMessage processes incoming client messages
func (c *Connection) handleClientMessage(msg ClientMessage) {
	switch msg.Type {
	case TypeAuth:
		c.handleAuth(msg.Payload)
	case TypeSubscribe:
		c.handleSubscribe(msg.Payload)
	case TypeTyping:
		c.handleTyping(msg.Payload)
	case TypePing:
		c.handlePing()
	default:
		c.l.Warnf(c.ctx, "websocket.Connection: unknown message type: %s", msg.Type)
		c.SendMessage(ServerMessage{
			Type: TypeError,
			Payload: ErrorPayload{
				Code:    400,
				Message: "Unknown message type",
			},
		})
	}
}

// handleAuth processes authentication
func (c *Connection) handleAuth(payload json.RawMessage) {
	var authPayload AuthPayload
	if err := json.Unmarshal(payload, &authPayload); err != nil {
		c.l.Errorf(c.ctx, "websocket.Connection.handleAuth: unmarshal error: %v", err)
		c.SendMessage(ServerMessage{
			Type: TypeAuthError,
			Payload: ErrorPayload{
				Code:    400,
				Message: "Invalid auth payload",
			},
		})
		return
	}

	// Validate JWT token and get user ID
	userID, err := c.hub.ValidateToken(c.ctx, authPayload.Token)
	if err != nil {
		c.l.Warnf(c.ctx, "websocket.Connection.handleAuth: invalid token: %v", err)
		c.SendMessage(ServerMessage{
			Type: TypeAuthError,
			Payload: ErrorPayload{
				Code:    401,
				Message: "Invalid token",
			},
		})
		return
	}

	c.SetUserID(userID)

	// Add to hub's user sessions
	c.hub.addUserSession(userID, c.sessionID)

	// Send success response
	c.SendMessage(ServerMessage{
		Type: TypeAuthSuccess,
		Payload: AuthSuccessPayload{
			UserID:    userID,
			SessionID: c.sessionID,
		},
	})

	c.l.Infof(c.ctx, "websocket.Connection.handleAuth: user %s authenticated, session=%s", userID, c.sessionID)
}

// handleSubscribe processes subscription requests
func (c *Connection) handleSubscribe(payload json.RawMessage) {
	if c.userID == "" {
		c.SendMessage(ServerMessage{
			Type: TypeError,
			Payload: ErrorPayload{
				Code:    401,
				Message: "Not authenticated",
			},
		})
		return
	}

	var subPayload SubscribePayload
	if err := json.Unmarshal(payload, &subPayload); err != nil {
		c.l.Errorf(c.ctx, "websocket.Connection.handleSubscribe: unmarshal error: %v", err)
		c.SendMessage(ServerMessage{
			Type: TypeError,
			Payload: ErrorPayload{
				Code:    400,
				Message: "Invalid subscribe payload",
			},
		})
		return
	}

	c.SubscribeConversations(subPayload.ConversationIDs)

	c.SendMessage(ServerMessage{
		Type: TypeSubscribed,
		Payload: SubscribedPayload{
			ConversationIDs: subPayload.ConversationIDs,
		},
	})

	c.l.Infof(c.ctx, "websocket.Connection.handleSubscribe: user %s subscribed to %d conversations", c.userID, len(subPayload.ConversationIDs))
}

// handleTyping processes typing indicators
func (c *Connection) handleTyping(payload json.RawMessage) {
	if c.userID == "" {
		return
	}

	var typingPayload TypingPayload
	if err := json.Unmarshal(payload, &typingPayload); err != nil {
		c.l.Errorf(c.ctx, "websocket.Connection.handleTyping: unmarshal error: %v", err)
		return
	}

	// Store typing indicator in Redis
	c.hub.SetTypingIndicator(typingPayload.ConversationID, c.userID)

	// Broadcast typing indicator to conversation participants
	c.hub.BroadcastToConversation(typingPayload.ConversationID, ServerMessage{
		Type: TypeTypingStart,
		Payload: map[string]interface{}{
			"conversation_id": typingPayload.ConversationID,
			"user_id":         c.userID,
		},
	}, c.sessionID) // Exclude sender
}

// handlePing responds with pong and updates presence
func (c *Connection) handlePing() {
	// Update presence heartbeat if authenticated
	if c.userID != "" {
		c.hub.UpdatePresenceHeartbeat(c.userID)
	}

	c.SendMessage(ServerMessage{
		Type: TypePong,
	})
}

// Close closes the connection
func (c *Connection) Close() {
	c.cancel()
	close(c.send)
}
