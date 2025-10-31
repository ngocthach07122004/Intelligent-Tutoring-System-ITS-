package websocket

import (

)

// WSGateway is the main WebSocket gateway


// Run starts the gateway
func (g *WSGateway) Run() {
	// Start hub
	go g.hub.Run()
	g.l.Infof(g.ctx, "websocket.Gateway: hub started")

	// Start subscriber
	go g.subscriber.Run()
	g.l.Infof(g.ctx, "websocket.Gateway: subscriber started")
}

// Shutdown gracefully shuts down the gateway
func (g *WSGateway) Shutdown() {
	g.l.Infof(g.ctx, "websocket.Gateway: shutting down")
	g.hub.Shutdown()
	g.cancel()
}

// // HandleWebSocket handles WebSocket upgrade and connection
// func (g *WSGateway) HandleWebSocket(w http.ResponseWriter, r *http.Request) {
// 	// Upgrade HTTP connection to WebSocket
// 	conn, err := pkgWs.Accept(w, r, &pkgWs.AcceptOptions{
// 		OriginPatterns: []string{"*"}, // TODO: Configure CORS properly
// 	})
// 	if err != nil {
// 		g.l.Errorf(r.Context(), "websocket.Gateway.HandleWebSocket: failed to upgrade: %v", err)
// 		http.Error(w, "Failed to upgrade connection", http.StatusInternalServerError)
// 		return
// 	}

// 	// Create connection wrapper
// 	wsConn := NewConnection(g.ctx, conn, g.hub, g.l)

// 	// Register connection
// 	g.hub.Register(wsConn)

// 	// Start read/write pumps
// 	go wsConn.WritePump()
// 	wsConn.ReadPump() // Blocks until connection closes
// }

// // GetHub returns the hub (for external access if needed)
// func (g *WSGateway) GetHub() *Hub {
// 	return g.hub
// }

// // GetConnectionCount returns the number of active connections
// func (g *WSGateway) GetConnectionCount() int {
// 	return g.hub.GetConnectionCount()
// }
