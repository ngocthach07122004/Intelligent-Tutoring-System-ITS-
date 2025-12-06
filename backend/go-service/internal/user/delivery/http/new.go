package http

import (
	"init-src/internal/user"
	"init-src/pkg/log"

	"github.com/gin-gonic/gin"
)

type Handler interface {
	SignUp(c *gin.Context)
	Login(c *gin.Context)
	Get(c *gin.Context)
	GetByID(c *gin.Context)
	Update(c *gin.Context)
	Delete(c *gin.Context)
	Create(c *gin.Context)
}

type handler struct {
	l  log.Logger
	uc user.Usecase
}

// New returns a new instance of the HTTPHandler interface
func New(l log.Logger, uc user.Usecase) Handler {
	return handler{
		l:  l,
		uc: uc,
	}
}
