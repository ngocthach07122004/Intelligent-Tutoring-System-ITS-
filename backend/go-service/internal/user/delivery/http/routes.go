package http

import (
	"init-src/internal/middleware"

	"github.com/gin-gonic/gin"
)

func MapRoutes(r *gin.RouterGroup, mw middleware.Middleware, h Handler) {
	user := r.Group("/users")
	user.Use(mw.Auth())
	user.GET("", h.List)
	user.GET("/:id", h.Get)
	user.POST("", h.Create)
	user.PUT("/:id", h.Update)
	user.DELETE("/:id", h.Delete)
}
