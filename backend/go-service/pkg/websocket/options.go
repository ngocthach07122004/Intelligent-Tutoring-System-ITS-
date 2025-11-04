package websocket

// AcceptOptions represents options for accepting a WebSocket connection
type AcceptOptions struct {
	// OriginPatterns lists the host patterns for authorized origins.
	// The request host is always authorized.
	// Use this to allow cross-origin requests.
	OriginPatterns []string

	// Subprotocols lists the WebSocket subprotocols to accept.
	Subprotocols []string
}
