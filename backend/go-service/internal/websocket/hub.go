package websocket

import (
	"context"
	"sync"

	"init-src/internal/projection"
	"init-src/pkg/jwt"
	"init-src/pkg/log"
)

// Hub maintains the set of active connections and broadcasts messages
type Hub struct {
	connections   map[string]*Connection
	connMu        sync.RWMutex
	userSessions  map[string]map[string]struct{}
	userMu        sync.RWMutex
	register      chan *Connection
	unregister    chan *Connection
	broadcastConv chan *ConversationBroadcast
	broadcastUser chan *UserBroadcast
	jwtManager    jwt.Manager
	projector     projection.Usecase
	l             log.Logger
	ctx           context.Context
	cancel        context.CancelFunc
}

// ConversationBroadcast represents a broadcast to a conversation
type ConversationBroadcast struct {
	ConversationID string
	Message        ServerMessage
	ExcludeSession string // Optional: exclude this session from broadcast
}

// UserBroadcast represents a broadcast to a specific user
type UserBroadcast struct {
	UserID  string
	Message ServerMessage
}

// NewHub creates a new Hub
func NewHub(ctx context.Context, jwtManager jwt.Manager, projector projection.Usecase, l log.Logger) *Hub {
	hubCtx, cancel := context.WithCancel(ctx)

	return &Hub{
		connections:   make(map[string]*Connection),
		userSessions:  make(map[string]map[string]struct{}),
		register:      make(chan *Connection, 256),
		unregister:    make(chan *Connection, 256),
		broadcastConv: make(chan *ConversationBroadcast, 256),
		broadcastUser: make(chan *UserBroadcast, 256),
		jwtManager:    jwtManager,
		projector:     projector,
		l:             l,
		ctx:           hubCtx,
		cancel:        cancel,
	}
}

// Run starts the hub's main loop
func (h *Hub) Run() {
	for {
		select {
		case conn := <-h.register:
			h.registerConnection(conn)

		case conn := <-h.unregister:
			h.unregisterConnection(conn)

		case broadcast := <-h.broadcastConv:
			h.handleConversationBroadcast(broadcast)

		case broadcast := <-h.broadcastUser:
			h.handleUserBroadcast(broadcast)

		case <-h.ctx.Done():
			h.l.Infof(h.ctx, "websocket.Hub: shutting down")
			h.closeAllConnections()
			return
		}
	}
}

// Register registers a new connection
func (h *Hub) Register(conn *Connection) {
	h.register <- conn
}

// Unregister unregisters a connection
func (h *Hub) Unregister(conn *Connection) {
	h.unregister <- conn
}

// BroadcastToConversation broadcasts a message to all connections subscribed to a conversation
func (h *Hub) BroadcastToConversation(convID string, msg ServerMessage, excludeSessionID string) {
	h.broadcastConv <- &ConversationBroadcast{
		ConversationID: convID,
		Message:        msg,
		ExcludeSession: excludeSessionID,
	}
}

// BroadcastToUser broadcasts a message to all connections of a specific user
func (h *Hub) BroadcastToUser(userID string, msg ServerMessage) {
	h.broadcastUser <- &UserBroadcast{
		UserID:  userID,
		Message: msg,
	}
}

// ValidateToken validates JWT token and returns user ID
func (h *Hub) ValidateToken(ctx context.Context, token string) (string, error) {
	payload, err := h.jwtManager.Verify(token)
	if err != nil {
		return "", err
	}

	return payload.UserID, nil
}

// registerConnection adds a connection to the hub
func (h *Hub) registerConnection(conn *Connection) {
	h.connMu.Lock()
	h.connections[conn.sessionID] = conn
	h.connMu.Unlock()

	// If already authenticated, add to user sessions and update presence
	if conn.userID != "" {
		h.addUserSession(conn.userID, conn.sessionID)
		h.updatePresenceOnline(conn.userID)
	}

	h.l.Infof(h.ctx, "websocket.Hub: connection registered, session=%s, total=%d", conn.sessionID, len(h.connections))
}

// addUserSession adds a session to user's session list
func (h *Hub) addUserSession(userID, sessionID string) {
	h.userMu.Lock()
	defer h.userMu.Unlock()

	if _, ok := h.userSessions[userID]; !ok {
		h.userSessions[userID] = make(map[string]struct{})
	}
	h.userSessions[userID][sessionID] = struct{}{}

	// Update presence to online when first session connects
	h.updatePresenceOnline(userID)
}

// unregisterConnection removes a connection from the hub
func (h *Hub) unregisterConnection(conn *Connection) {
	h.connMu.Lock()
	delete(h.connections, conn.sessionID)
	h.connMu.Unlock()

	// Remove from user sessions if authenticated
	if conn.userID != "" {
		h.userMu.Lock()
		lastSession := false
		if sessions, ok := h.userSessions[conn.userID]; ok {
			delete(sessions, conn.sessionID)
			if len(sessions) == 0 {
				delete(h.userSessions, conn.userID)
				lastSession = true
			}
		}
		h.userMu.Unlock()

		// Update presence to offline only if this was the last session
		if lastSession {
			h.updatePresenceOffline(conn.userID)
		}
	}

	conn.Close()

	h.l.Infof(h.ctx, "websocket.Hub: connection unregistered, session=%s, user=%s, total=%d", conn.sessionID, conn.userID, len(h.connections))
}

// handleConversationBroadcast broadcasts message to conversation subscribers
func (h *Hub) handleConversationBroadcast(broadcast *ConversationBroadcast) {
	h.connMu.RLock()
	defer h.connMu.RUnlock()

	sent := 0
	for sessionID, conn := range h.connections {
		// Skip excluded session
		if sessionID == broadcast.ExcludeSession {
			continue
		}

		// Check if connection is subscribed to this conversation
		if conn.IsSubscribedTo(broadcast.ConversationID) {
			conn.SendMessage(broadcast.Message)
			sent++
		}
	}

	h.l.Debugf(h.ctx, "websocket.Hub: broadcast to conversation %s, sent to %d connections", broadcast.ConversationID, sent)
}

// handleUserBroadcast broadcasts message to all user's connections
func (h *Hub) handleUserBroadcast(broadcast *UserBroadcast) {
	h.userMu.RLock()
	sessions, ok := h.userSessions[broadcast.UserID]
	h.userMu.RUnlock()

	if !ok {
		h.l.Debugf(h.ctx, "websocket.Hub: user %s has no active sessions", broadcast.UserID)
		return
	}

	h.connMu.RLock()
	defer h.connMu.RUnlock()

	sent := 0
	for sessionID := range sessions {
		if conn, ok := h.connections[sessionID]; ok {
			conn.SendMessage(broadcast.Message)
			sent++
		}
	}

	h.l.Debugf(h.ctx, "websocket.Hub: broadcast to user %s, sent to %d connections", broadcast.UserID, sent)
}

// closeAllConnections closes all active connections
func (h *Hub) closeAllConnections() {
	h.connMu.Lock()
	defer h.connMu.Unlock()

	for _, conn := range h.connections {
		conn.Close()
	}

	h.connections = make(map[string]*Connection)
	h.userSessions = make(map[string]map[string]struct{})
}

// Shutdown gracefully shuts down the hub
func (h *Hub) Shutdown() {
	h.cancel()
}

// GetConnectionCount returns the number of active connections
func (h *Hub) GetConnectionCount() int {
	h.connMu.RLock()
	defer h.connMu.RUnlock()
	return len(h.connections)
}

// GetUserConnectionCount returns the number of active connections for a user
func (h *Hub) GetUserConnectionCount(userID string) int {
	h.userMu.RLock()
	defer h.userMu.RUnlock()

	if sessions, ok := h.userSessions[userID]; ok {
		return len(sessions)
	}
	return 0
}

// updatePresenceOnline sets user presence to online
func (h *Hub) updatePresenceOnline(userID string) {
	if h.projector == nil {
		return
	}

	if err := h.projector.SetUserPresence(h.ctx, userID, "online"); err != nil {
		h.l.Warnf(h.ctx, "websocket.Hub.updatePresenceOnline: failed for user=%s, err=%v", userID, err)
	}
}

// updatePresenceOffline sets user presence to offline (by not renewing TTL)
func (h *Hub) updatePresenceOffline(userID string) {
	// No need to explicitly set offline - TTL expiration handles this
	// But we log it for tracking
	h.l.Debugf(h.ctx, "websocket.Hub.updatePresenceOffline: user=%s went offline", userID)
}

// UpdatePresenceHeartbeat refreshes user presence TTL (called on ping)
func (h *Hub) UpdatePresenceHeartbeat(userID string) {
	if h.projector == nil {
		return
	}

	if err := h.projector.SetUserPresence(h.ctx, userID, "online"); err != nil {
		h.l.Warnf(h.ctx, "websocket.Hub.UpdatePresenceHeartbeat: failed for user=%s, err=%v", userID, err)
	}
}

// SetTypingIndicator sets typing indicator for a user in a conversation
func (h *Hub) SetTypingIndicator(conversationID string, userID string) {
	if h.projector == nil {
		return
	}

	if err := h.projector.SetTyping(h.ctx, conversationID, userID); err != nil {
		h.l.Warnf(h.ctx, "websocket.Hub.SetTypingIndicator: failed for conv=%s, user=%s, err=%v", conversationID, userID, err)
	}
}

// GetUserPresence gets user presence status
func (h *Hub) GetUserPresence(ctx context.Context, userID string) (string, error) {
	if h.projector == nil {
		return "offline", nil
	}
	return h.projector.GetUserPresence(ctx, userID)
}

// GetTypingUsers gets users currently typing in a conversation
func (h *Hub) GetTypingUsers(ctx context.Context, conversationID string) ([]string, error) {
	if h.projector == nil {
		return []string{}, nil
	}
	return h.projector.GetTypingUsers(ctx, conversationID)
}
