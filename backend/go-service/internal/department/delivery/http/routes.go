package http

import (
	"init-src/internal/middleware"

	"github.com/gin-gonic/gin"
)

func MapRoutes(r *gin.RouterGroup, mw middleware.Middleware, h Handler) {
	department := r.Group("/departments")
	department.Use(mw.Auth(), mw.Authorize())
	department.POST("", h.create)
	department.GET("", h.list)
	department.GET("/:id", h.findByID)
	department.PUT("/:id", h.update)
	department.DELETE("/:id", h.delete)
}
