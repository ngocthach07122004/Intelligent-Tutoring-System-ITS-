package http

import (
	"init-src/internal/middleware"

	"github.com/gin-gonic/gin"
)

func MapRoutes(r *gin.RouterGroup, mw middleware.Middleware, h Handler) {

	r.POST("/signUp", h.SignUp)
	r.POST("/login", h.Login)

	user := r.Group("/users")
	user.Use(mw.Auth(), mw.Authorize())
	user.GET("", h.Get)
	user.GET("/:id", h.GetByID)
	user.PUT("/:id", h.Update)
	user.DELETE("/:id", h.Delete)
	user.POST("", h.Create)
}
