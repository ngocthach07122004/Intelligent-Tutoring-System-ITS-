package middleware

import (
	"init-src/pkg/log"

	"init-src/pkg/jwt"
)

type Middleware struct {
	l          log.Logger
	jwtManager jwt.Manager
}

func New(l log.Logger, jwtManager jwt.Manager) Middleware {
	return Middleware{
		l:          l,
		jwtManager: jwtManager,
	}
}
