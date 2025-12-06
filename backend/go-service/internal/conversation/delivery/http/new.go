package http

import (
	"init-src/internal/conversation"
	"init-src/pkg/log"

	"github.com/gin-gonic/gin"
)

type Handler interface {
	create(c *gin.Context)
	list(c *gin.Context)
	findByID(c *gin.Context)
	leave(c *gin.Context)
	addParticipants(c *gin.Context)
	getParticipants(c *gin.Context)
	markAsRead(c *gin.Context)
}

type handler struct {
	l  log.Logger
	uc conversation.Usecase
}

// New returns a new instance of the HTTPHandler interface
func New(l log.Logger, uc conversation.Usecase) Handler {
	return handler{
		l:  l,
		uc: uc,
	}
}
