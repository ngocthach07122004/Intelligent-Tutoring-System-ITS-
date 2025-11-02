package middleware

import (
	"context"
	"strings"

	"init-src/internal/models"
	"init-src/internal/user"
	pkgErrors "init-src/pkg/errors"
	"init-src/pkg/jwt"
	"init-src/pkg/response"

	"github.com/gin-gonic/gin"
)

// Resource types
const (
	ResourceUser       = "users"
	ResourceShop       = "shops"
	ResourceRegion     = "regions"
	ResourceBranch     = "branches"
	ResourceDepartment = "departments"
)

// HTTP methods
const (
	MethodGET    = "GET"
	MethodPOST   = "POST"
	MethodPUT    = "PUT"
	MethodDELETE = "DELETE"
)

var (
	ErrForbidden = pkgErrors.NewHTTPError(403, "Forbidden")
)

func (m Middleware) Authorize() gin.HandlerFunc {
	return func(c *gin.Context) {
		payload, ok := jwt.GetPayloadFromContext(c.Request.Context())
		if !ok {
			m.l.Warnf(c.Request.Context(), "middleware.Authorize.GetPayloadFromContext: no payload found")
			response.Unauthorized(c)
			c.Abort()
			return
		}

		sc := jwt.NewScope(payload)
		u, err := m.userUC.GetOne(c.Request.Context(), sc, user.GetOneInput{Filter: user.Filter{ID: payload.UserID}})
		if err != nil {
			m.l.Warnf(c.Request.Context(), "middleware.Authorize.GetOne: %v", err)
			response.Error(c, err)
			c.Abort()
			return
		}

		if err = m.checkPermission(c, u.Role); err != nil {
			m.l.Warnf(c.Request.Context(), "middleware.Authorize.checkPermission: %v", err)
			response.Forbidden(c)
			c.Abort()
			return
		}

		ctxWithUser := context.WithValue(c.Request.Context(), "user", u)
		c.Request = c.Request.WithContext(ctxWithUser)

		c.Next()
	}
}

func (m Middleware) checkPermission(c *gin.Context, role string) error {
	method := c.Request.Method
	path := c.Request.URL.Path

	resource := m.extractResource(path)

	if role == models.RoleAdmin {
		return nil
	}

	switch role {
	case models.RoleManager:
		return m.checkManagerPermission(resource)
	case models.RoleRegionManager:
		return m.checkRegionManagerPermission(resource)
	case models.RoleBranchManager:
		return m.checkBranchManagerPermission(resource)
	case models.RoleHeadOfDept:
		return m.checkHeadOfDeptPermission(resource)
	case models.RoleEmployee:
		return m.checkEmployeePermission(method, resource)
	default:
		return ErrForbidden
	}
}

func (m Middleware) extractResource(path string) string {
	// Remove /api/v1/ prefix
	cleanPath := strings.TrimPrefix(path, "/api/v1/")

	// Extract resource name (first segment)
	segments := strings.Split(cleanPath, "/")
	if len(segments) > 0 {
		return segments[0]
	}
	return ""
}

func (m Middleware) checkManagerPermission(resource string) error {
	switch resource {
	case ResourceUser, ResourceRegion, ResourceBranch, ResourceDepartment, ResourceShop:
		return nil
	default:
		return ErrForbidden
	}
}

func (m Middleware) checkRegionManagerPermission(resource string) error {
	switch resource {
	case ResourceUser, ResourceBranch, ResourceDepartment, ResourceRegion:
		return nil
	case ResourceShop:
		return ErrForbidden
	default:
		return ErrForbidden
	}
}

func (m Middleware) checkBranchManagerPermission(resource string) error {
	switch resource {
	case ResourceUser, ResourceDepartment, ResourceBranch:
		return nil
	case ResourceShop, ResourceRegion:
		return ErrForbidden
	default:
		return ErrForbidden
	}
}

func (m Middleware) checkHeadOfDeptPermission(resource string) error {
	switch resource {
	case ResourceUser, ResourceDepartment:
		return nil
	case ResourceShop, ResourceRegion, ResourceBranch:
		return ErrForbidden
	default:
		return ErrForbidden
	}
}

func (m Middleware) checkEmployeePermission(method, resource string) error {
	switch resource {
	case ResourceUser:
		if method == MethodGET || method == MethodPUT {
			return nil
		}
		return ErrForbidden
	case ResourceShop, ResourceRegion, ResourceBranch, ResourceDepartment:
		return ErrForbidden
	default:
		return ErrForbidden
	}
}
