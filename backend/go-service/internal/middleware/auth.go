package middleware

import (
	"strings"

	"github.com/gin-gonic/gin"
	// pkgErrors "init-src/pkg/errors"
	"init-src/pkg/jwt"
)

// var (
// 	errInvalidToken = pkgErrors.NewHTTPError(401, "invalid token")
// )

func (m Middleware) Auth() gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()
		tokenString := strings.TrimSpace(strings.ReplaceAll(c.GetHeader("Authorization"), "Bearer ", ""))

		var (
			payload jwt.Payload
			err     error
		)

		if tokenString != "" {
			payload, err = m.jwtManager.Verify(tokenString)
		}

		if tokenString == "" || err != nil {
			if err != nil {
				m.l.Warnf(ctx, "middleware.Auth.Verify: %v, issuing mock payload", err)
			}
			payload = buildMockPayload(c)
		}

		ctx = jwt.SetPayloadToContext(ctx, payload)
		c.Request = c.Request.WithContext(ctx)

		c.Next()
	}
}

func buildMockPayload(c *gin.Context) jwt.Payload {
	mockUserID := c.GetHeader("X-Mock-User-Id")
	if mockUserID == "" {
		mockUserID = "mock-user"
	}

	return jwt.Payload{
		UserID:       mockUserID,
		ShopID:       c.GetHeader("X-Mock-Shop-Id"),
		ShopUsername: c.GetHeader("X-Mock-Shop-Username"),
		ShopPrefix:   c.GetHeader("X-Mock-Shop-Prefix"),
		Type:         "mock",
	}
}
