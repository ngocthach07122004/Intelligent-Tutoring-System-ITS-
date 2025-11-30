package http

import (
	"init-src/internal/middleware"

	"github.com/gin-gonic/gin"
)

// MapRoutes maps the routes to the handler functions
func MapRoutes(r *gin.RouterGroup, mw middleware.Middleware, h Handler) {
	classes := r.Group("/classes")
	classes.Use(mw.Auth())

	// Class CRUD operations
	classes.POST("", h.create)
	classes.GET("", h.list)
	classes.GET("/:id", h.findByID)
	classes.PUT("/:id", h.update)
	classes.DELETE("/:id", h.delete)

	// Member management
	classes.POST("/:id/members", h.addMember)
	classes.DELETE("/:id/members/:userId", h.removeMember)
	classes.GET("/:id/members", h.listMembers)

	// Join by code
	// Join by code
	classes.POST("/join", h.joinByCode)

	// User classes
	r.GET("/users/me/classes", mw.Auth(), h.listUserClasses)
}
