package http

import (
	"init-src/internal/forum"
	"init-src/pkg/log"
)

type handlers struct {
	l  log.Logger
	uc forum.Usecase
}

func New(l log.Logger, uc forum.Usecase) *handlers {
	return &handlers{
		l:  l,
		uc: uc,
	}
}
