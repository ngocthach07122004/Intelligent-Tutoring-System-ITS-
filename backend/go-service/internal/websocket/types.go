package websocket

import "encoding/json"

// MessageType represents the type of WebSocket message
type MessageType string

const (
	// Client → Server messages
	TypeAuth      MessageType = "auth"
	TypeSubscribe MessageType = "subscribe"
	TypeTyping    MessageType = "typing"
	TypePing      MessageType = "ping"

	// Server → Client messages
	TypeAuthSuccess     MessageType = "auth.success"
	TypeAuthError       MessageType = "auth.error"
	TypeSubscribed      MessageType = "subscribed"
	TypeMessageNew      MessageType = "message.new"
	TypeMessageEdited   MessageType = "message.edited"
	TypeMessageDeleted  MessageType = "message.deleted"
	TypeTypingStart     MessageType = "typing.start"
	TypePresenceUpdate  MessageType = "presence.update"
	TypeNotificationNew MessageType = "notification.new"
	TypePong            MessageType = "pong"
	TypeError           MessageType = "error"
)

// ClientMessage represents a message from client to server
type ClientMessage struct {
	Type    MessageType     `json:"type"`
	Payload json.RawMessage `json:"payload,omitempty"`
}

// ServerMessage represents a message from server to client
type ServerMessage struct {
	Type    MessageType `json:"type"`
	Payload interface{} `json:"payload,omitempty"`
}

// AuthPayload is the payload for auth message
type AuthPayload struct {
	Token string `json:"token"`
}

// AuthSuccessPayload is the response for successful auth
type AuthSuccessPayload struct {
	UserID    string `json:"user_id"`
	SessionID string `json:"session_id"`
}

// SubscribePayload is the payload for subscribe message
type SubscribePayload struct {
	ConversationIDs []string `json:"conversation_ids"`
}

// SubscribedPayload is the response for subscribe
type SubscribedPayload struct {
	ConversationIDs []string `json:"conversation_ids"`
}

// TypingPayload is the payload for typing indicator
type TypingPayload struct {
	ConversationID string `json:"conversation_id"`
}

// ErrorPayload is the payload for error messages
type ErrorPayload struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}
