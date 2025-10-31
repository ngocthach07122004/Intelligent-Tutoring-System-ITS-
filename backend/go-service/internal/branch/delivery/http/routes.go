package http

import (
	"init-src/internal/middleware"

	"github.com/gin-gonic/gin"
)

// MapRoutes maps the routes to the handler functions
func MapRoutes(r *gin.RouterGroup, mw middleware.Middleware, h Handler) {
	branch := r.Group("/branches")
	branch.Use(mw.Auth(), mw.Authorize())
	branch.POST("", h.create)
	branch.GET("", h.list)
	branch.GET("/:id", h.findByID)
	branch.PUT("/:id", h.update)
	branch.DELETE("/:id", h.delete)
}
