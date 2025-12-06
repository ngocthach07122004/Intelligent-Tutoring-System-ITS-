package middleware

import (
	"init-src/internal/user"
	"init-src/pkg/log"

	pkgCrt "init-src/pkg/encrypter"
	"init-src/pkg/jwt"
)

type Middleware struct {
	l          log.Logger
	jwtManager jwt.Manager
	encrypter  pkgCrt.Encrypter
	userUC     user.Usecase
}

func New(l log.Logger, jwtManager jwt.Manager, encrypter pkgCrt.Encrypter, userUsecase user.Usecase) Middleware {
	return Middleware{
		l:          l,
		jwtManager: jwtManager,
		encrypter:  encrypter,
		userUC:     userUsecase,
	}
}
