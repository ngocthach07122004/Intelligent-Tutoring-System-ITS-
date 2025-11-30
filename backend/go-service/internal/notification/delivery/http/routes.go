package http

import (
	"init-src/internal/middleware"

	"github.com/gin-gonic/gin"
)

// MapRoutes maps all notification-related routes
func MapRoutes(r *gin.RouterGroup, mw middleware.Middleware, h Handler) {
	notifications := r.Group("/notifications")
	notifications.Use(mw.Auth())
	{
		// List notifications
		notifications.GET("", h.list)

		// Mark all as read (must be before /:id routes)
		notifications.PUT("/read-all", h.markAllAsRead)

		// Count unread
		notifications.GET("/unread/count", h.countUnread)

		// Mark single notification as read
		notifications.PUT("/:id/read", h.markAsRead)

		// Delete notification
		notifications.DELETE("/:id", h.delete)
	}
}
