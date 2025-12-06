package http

import (
	"init-src/internal/middleware"

	"github.com/gin-gonic/gin"
)

// MapRoutes maps the routes to the handler functions
func MapRoutes(r *gin.RouterGroup, mw middleware.Middleware, h Handler) {
	shop := r.Group("/shops")
	shop.Use(mw.Auth(), mw.Authorize())
	shop.POST("", h.Create)
	shop.GET("", h.List)
	shop.GET("/:id", h.FindByID)
	shop.PUT("/:id", h.Update)
	shop.DELETE("/:id", h.Delete)
}
