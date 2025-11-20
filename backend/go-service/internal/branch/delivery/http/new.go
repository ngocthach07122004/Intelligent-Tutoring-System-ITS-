package http

import (
	"init-src/internal/branch"
	"init-src/pkg/log"

	"github.com/gin-gonic/gin"
)

type Handler interface {
	create(c *gin.Context)
	list(c *gin.Context)
	findByID(c *gin.Context)
	update(c *gin.Context)
	delete(c *gin.Context)
}

type handler struct {
	l  log.Logger
	uc branch.Usecase
}

// New returns a new instance of the HTTPHandler interface
func New(l log.Logger, uc branch.Usecase) Handler {
	return handler{
		l:  l,
		uc: uc,
	}
}
