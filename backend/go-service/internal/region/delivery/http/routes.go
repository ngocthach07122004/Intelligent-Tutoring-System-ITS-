package http

import (
	"init-src/internal/middleware"

	"github.com/gin-gonic/gin"
)

// MapRoutes maps the routes to the handler functions
func MapRoutes(r *gin.RouterGroup, mw middleware.Middleware, h Handler) {
	region := r.Group("/regions")
	region.Use(mw.Auth(), mw.Authorize())
	region.POST("", h.create)
	region.GET("", h.list)
	region.GET("/:id", h.findByID)
	region.PUT("/:id", h.update)
	region.DELETE("/:id", h.delete)
}
