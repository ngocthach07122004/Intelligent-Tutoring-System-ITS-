package http

import (
	"init-src/internal/notification"
	"init-src/pkg/log"

	"github.com/gin-gonic/gin"
)

// Handler interface for notification HTTP handlers
type Handler interface {
	list(c *gin.Context)
	markAsRead(c *gin.Context)
	markAllAsRead(c *gin.Context)
	delete(c *gin.Context)
	countUnread(c *gin.Context)
}

type handler struct {
	l  log.Logger
	uc notification.Usecase
}

// New creates a new notification HTTP handler
func New(l log.Logger, uc notification.Usecase) Handler {
	return handler{
		l:  l,
		uc: uc,
	}
}
