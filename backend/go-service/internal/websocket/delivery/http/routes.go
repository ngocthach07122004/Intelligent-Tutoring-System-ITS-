package http

import "github.com/gin-gonic/gin"

// MapRoutes maps HTTP routes for WebSocket
func MapRoutes(router *gin.RouterGroup, h *Handler) {
	// WebSocket upgrade endpoint
	router.GET("/ws", h.HandleWebSocket)

	// Health check endpoint
	router.GET("/health", h.HandleHealth)
}
