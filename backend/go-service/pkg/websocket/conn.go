package websocket

import (
	"context"
	"net/http"

	"github.com/coder/websocket"
)

// Conn represents a WebSocket connection interface
// This interface abstracts the underlying websocket implementation
// to allow for easier testing and potential implementation swaps
type Conn interface {
	// Close closes the WebSocket connection with a status code and reason
	Close(code StatusCode, reason string) error

	// Ping sends a ping frame to the peer and waits for a pong
	Ping(ctx context.Context) error

	// Write writes a message to the connection
	Write(ctx context.Context, typ MessageType, data []byte) error

	// GetUnderlyingConn returns the underlying websocket connection
	// This is used internally for wsjson operations
	GetUnderlyingConn() *websocket.Conn
}

// conn wraps the underlying websocket connection
type conn struct {
	*websocket.Conn
}

// NewConn creates a new wrapped connection
func NewConn(c *websocket.Conn) Conn {
	return &conn{Conn: c}
}

// Close implements the Conn interface
func (c *conn) Close(code StatusCode, reason string) error {
	return c.Conn.Close(websocket.StatusCode(code), reason)
}

// Ping implements the Conn interface
func (c *conn) Ping(ctx context.Context) error {
	return c.Conn.Ping(ctx)
}

// Write implements the Conn interface
func (c *conn) Write(ctx context.Context, typ MessageType, data []byte) error {
	return c.Conn.Write(ctx, websocket.MessageType(typ), data)
}

// GetUnderlyingConn returns the underlying websocket connection
func (c *conn) GetUnderlyingConn() *websocket.Conn {
	return c.Conn
}

// Accept accepts a WebSocket handshake from a client and upgrades the HTTP connection
func Accept(w http.ResponseWriter, r *http.Request, opts *AcceptOptions) (Conn, error) {
	var acceptOpts *websocket.AcceptOptions
	if opts != nil {
		acceptOpts = &websocket.AcceptOptions{
			OriginPatterns: opts.OriginPatterns,
			Subprotocols:   opts.Subprotocols,
		}
	}

	c, err := websocket.Accept(w, r, acceptOpts)
	if err != nil {
		return nil, err
	}

	return NewConn(c), nil
}
