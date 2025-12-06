package http

import (
	"init-src/internal/shop"
	"init-src/pkg/log"

	"github.com/gin-gonic/gin"
)

type Handler interface {
	Create(c *gin.Context)
	List(c *gin.Context)
	FindByID(c *gin.Context)
	Update(c *gin.Context)
	Delete(c *gin.Context)
}

type handler struct {
	l  log.Logger
	uc shop.Usecase
}

// New returns a new instance of the HTTPHandler interface
func New(l log.Logger, uc shop.Usecase) Handler {
	return handler{
		l:  l,
		uc: uc,
	}
}
