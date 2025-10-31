package websocket

import (
	"context"

	"github.com/coder/websocket/wsjson"
)

// Read reads a JSON message from the connection and unmarshals it into v
func Read(ctx context.Context, c Conn, v interface{}) error {
	// Get the underlying websocket.Conn for wsjson operations
	underlyingConn := c.GetUnderlyingConn()
	return wsjson.Read(ctx, underlyingConn, v)
}

// Write marshals v as JSON and writes it to the connection
func Write(ctx context.Context, c Conn, v interface{}) error {
	// Get the underlying websocket.Conn for wsjson operations
	underlyingConn := c.GetUnderlyingConn()
	return wsjson.Write(ctx, underlyingConn, v)
}
