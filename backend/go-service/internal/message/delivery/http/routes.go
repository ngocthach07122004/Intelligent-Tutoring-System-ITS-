package http

import (
	"init-src/internal/middleware"

	"github.com/gin-gonic/gin"
)

// MapRoutes maps all message-related routes
func MapRoutes(api *gin.RouterGroup, mw middleware.Middleware, h Handler) {
	// Conversation-scoped message routes
	conversations := api.Group("/conversations/:id")
	conversations.Use(mw.Auth(), mw.Authorize())
	{
		// Send message
		conversations.POST("/messages", h.send)

		// List/Get messages
		conversations.GET("/messages", h.list)

		// Search in conversation
		conversations.GET("/messages/search", h.search)

		// Message-specific operations
		conversations.GET("/messages/:message_id", h.findByID)
		conversations.PUT("/messages/:message_id", h.edit)
		conversations.DELETE("/messages/:message_id", h.delete)
	}

	// Global message routes
	messages := api.Group("/messages")
	messages.Use(mw.Auth(), mw.Authorize())
	{
		// Global search across all conversations
		messages.GET("/search", h.searchGlobal)
	}
}
