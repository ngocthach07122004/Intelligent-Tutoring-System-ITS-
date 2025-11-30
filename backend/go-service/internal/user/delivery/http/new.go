package http

import (
	"init-src/internal/user"

	"github.com/gin-gonic/gin"
)

type Handler interface {
	List(*gin.Context)
	Get(*gin.Context)
	Create(*gin.Context)
	Update(*gin.Context)
	Delete(*gin.Context)
}

type handler struct {
	repo user.Repository
}

func New(repo user.Repository) Handler {
	return &handler{repo: repo}
}
