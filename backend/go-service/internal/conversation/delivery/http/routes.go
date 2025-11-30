package http

import (
	"init-src/internal/middleware"

	"github.com/gin-gonic/gin"
)

// MapRoutes maps the routes to the handler functions
func MapRoutes(r *gin.RouterGroup, mw middleware.Middleware, h Handler) {
	conversations := r.Group("/conversations")
	conversations.Use(mw.Auth())

	// Conversation CRUD operations
	conversations.POST("", h.create)
	conversations.GET("", h.list)
	conversations.GET("/:id", h.findByID)
	conversations.DELETE("/:id", h.leave)

	// Participant management
	conversations.POST("/:id/participants", h.addParticipants)
	conversations.GET("/:id/participants", h.getParticipants)

	// Mark as read
	conversations.POST("/:id/read", h.markAsRead)

	// Class channels
	classes := r.Group("/classes")
	classes.Use(mw.Auth())
	classes.GET("/:id/channels", h.getClassChannels)
	classes.POST("/:id/channels", h.createClassChannel)
}
