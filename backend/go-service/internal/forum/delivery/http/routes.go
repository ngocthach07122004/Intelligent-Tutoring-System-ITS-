package http

import (
	"init-src/internal/middleware"

	"github.com/gin-gonic/gin"
)

func MapRoutes(r *gin.RouterGroup, mw middleware.Middleware, h *handlers) {
	posts := r.Group("/posts")
	posts.Use(mw.Auth())
	{
		posts.POST("", h.CreatePost)
		posts.GET("", h.ListPosts)
		posts.GET("/:id", h.GetPost)
		posts.POST("/:id/comments", h.CreateComment)
		posts.POST("/:id/vote", h.VotePost)
	}

	comments := r.Group("/comments")
	comments.Use(mw.Auth())
	{
		comments.POST("/:id/vote", h.VoteComment)
	}
}
