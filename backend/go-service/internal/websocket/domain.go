package websocket

import (
	"context"

	pkgWs "init-src/pkg/websocket"
)

// ConnInterface represents a WebSocket connection abstraction
// Single Responsibility: Handle WebSocket communication for a single client
type ConnInterface interface {
	// GetUserID returns the authenticated user ID
	GetUserID() string

	// GetSessionID returns the unique session ID
	GetSessionID() string

	// SetUserID sets the user ID after authentication
	SetUserID(userID string)

	// IsSubscribedTo checks if connection is subscribed to a conversation
	IsSubscribedTo(conversationID string) bool

	// SubscribeConversations adds conversations to subscription list
	SubscribeConversations(conversationIDs []string)

	// SendMessage sends a message to the client
	SendMessage(msg ServerMessage)

	// Close closes the connection
	Close()
}

// ConnectionManager manages all active WebSocket connections
// Single Responsibility: Manage connection lifecycle and routing
type ConnectionManager interface {
	// Register registers a new connection
	Register(conn ConnInterface)

	// Unregister removes a connection
	Unregister(conn ConnInterface)

	// GetConnection retrieves a connection by session ID
	GetConnection(sessionID string) ConnInterface

	// GetUserSessions returns all session IDs for a user
	GetUserSessions(userID string) []string

	// GetConnectionCount returns total active connections
	GetConnectionCount() int

	// GetUserConnectionCount returns active connections for a user
	GetUserConnectionCount(userID string) int
}

// Broadcaster handles message broadcasting to connections
// Single Responsibility: Broadcast messages to target recipients
type Broadcaster interface {
	// BroadcastToConversation broadcasts to all subscribers of a conversation
	BroadcastToConversation(conversationID string, msg ServerMessage, excludeSessionID string)

	// BroadcastToUser broadcasts to all connections of a specific user
	BroadcastToUser(userID string, msg ServerMessage)

	// BroadcastToSession broadcasts to a specific session
	BroadcastToSession(sessionID string, msg ServerMessage)
}

// PresenceManager manages user online/offline presence
// Single Responsibility: Track and update user presence status
type PresenceManager interface {
	// SetOnline marks a user as online
	SetOnline(ctx context.Context, userID string) error

	// SetOffline marks a user as offline
	SetOffline(ctx context.Context, userID string) error

	// GetPresence gets user presence status
	GetPresence(ctx context.Context, userID string) (string, error)

	// Heartbeat refreshes presence TTL
	Heartbeat(ctx context.Context, userID string) error
}

// TypingManager manages typing indicators
// Single Responsibility: Track who is typing in conversations
type TypingManager interface {
	// SetTyping sets typing indicator for a user in a conversation
	SetTyping(ctx context.Context, conversationID, userID string) error

	// GetTypingUsers gets all users currently typing in a conversation
	GetTypingUsers(ctx context.Context, conversationID string) ([]string, error)
}

// SubscriberInterface listens to external events and forwards them
// Single Responsibility: Subscribe to Redis Pub/Sub and forward events
type SubscriberInterface interface {
	// Run starts the subscriber (blocking)
	Run()

	// Stop stops the subscriber
	Stop()
}

// ConnectionFactory creates WebSocket connections
// Single Responsibility: Abstract connection creation
type ConnectionFactory interface {
	// CreateConnection creates a new Connection from raw WebSocket
	CreateConnection(ctx context.Context, conn pkgWs.Conn) ConnInterface
}

// Authenticator handles WebSocket authentication
// Single Responsibility: Validate authentication tokens
type Authenticator interface {
	// ValidateToken validates JWT token and returns user ID
	ValidateToken(ctx context.Context, token string) (string, error)
}
