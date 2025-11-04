package middleware

import (
	"strings"

	"github.com/gin-gonic/gin"
	// pkgErrors "init-src/pkg/errors"
	"init-src/pkg/jwt"
	"init-src/pkg/response"
)

// var (
// 	errInvalidToken = pkgErrors.NewHTTPError(401, "invalid token")
// )

func (m Middleware) Auth() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := strings.ReplaceAll(c.GetHeader("Authorization"), "Bearer ", "")
		if tokenString == "" {
			response.Unauthorized(c)
			c.Abort()
			return
		}

		payload, err := m.jwtManager.Verify(tokenString)
		if err != nil {
			response.Unauthorized(c)
			c.Abort()
			return
		}

		ctx := c.Request.Context()
		ctx = jwt.SetPayloadToContext(ctx, payload)
		c.Request = c.Request.WithContext(ctx)

		c.Next()
	}
}
