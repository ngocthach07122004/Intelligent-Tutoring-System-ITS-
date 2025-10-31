package http

import (
	websocket "init-src/internal/websocket"
	"init-src/pkg/log"

	"github.com/gin-gonic/gin"
)

// Handler handles HTTP requests for WebSocket upgrade
type Handler struct {
	gateway *websocket.WSGateway
	l       log.Logger
}

// New creates a new HTTP handler for WebSocket
func New(l log.Logger, gateway *websocket.WSGateway) *Handler {
	return &Handler{
		gateway: gateway,
		l:       l,
	}
}

// HandleWebSocket handles WebSocket upgrade request
func (h *Handler) HandleWebSocket(c *gin.Context) {
	h.gateway.HandleWebSocket(c.Writer, c.Request)
}

// HandleHealth returns the health status and connection count
func (h *Handler) HandleHealth(c *gin.Context) {
	c.JSON(200, gin.H{
		"status":      "ok",
		"connections": h.gateway.GetConnectionCount(),
	})
}
