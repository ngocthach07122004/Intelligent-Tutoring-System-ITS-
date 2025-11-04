package http

import (
	"init-src/internal/message"
	"init-src/pkg/log"

	"github.com/gin-gonic/gin"
)

type Handler interface {
	send(c *gin.Context)
	list(c *gin.Context)
	findByID(c *gin.Context)
	edit(c *gin.Context)
	delete(c *gin.Context)
	search(c *gin.Context)
	searchGlobal(c *gin.Context)
}

type handler struct {
	l  log.Logger
	uc message.Usecase
}

// New returns a new instance of the HTTPHandler interface
func New(l log.Logger, uc message.Usecase) Handler {
	return handler{
		l:  l,
		uc: uc,
	}
}
