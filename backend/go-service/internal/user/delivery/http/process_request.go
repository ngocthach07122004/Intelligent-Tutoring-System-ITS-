package http

import (
	"init-src/internal/models"
	"init-src/internal/user"
	pkgErrors "init-src/pkg/errors"
	"init-src/pkg/jwt"
	"init-src/pkg/paginator"

	"github.com/gin-gonic/gin"
)

func (h handler) processSignupRequest(c *gin.Context) (SignupRequest, error) {
	ctx := c.Request.Context()

	var req SignupRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.l.Warnf(ctx, "event.user.http.processSignupRequest.ShouldBindJSON: %v", err)
		return SignupRequest{}, errWrongBody
	}

	if err := req.validate(); err != nil {
		h.l.Warnf(ctx, "event.user.http.processSignupRequest.validate: %v", err)
		return SignupRequest{}, err
	}

	return req, nil
}

func (h handler) processLoginRequest(c *gin.Context) (LoginRequest, error) {
	ctx := c.Request.Context()

	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.l.Warnf(ctx, "event.user.http.processLoginRequest.ShouldBindJSON: %v", err)
		return LoginRequest{}, errWrongBody
	}

	if err := req.validate(); err != nil {
		h.l.Warnf(ctx, "event.user.http.processLoginRequest.validate: %v", err)
		return LoginRequest{}, err
	}

	return req, nil
}

func (h handler) processGetByIDRequest(c *gin.Context) (models.Scope, string, error) {
	ctx := c.Request.Context()

	payload, ok := jwt.GetPayloadFromContext(ctx)
	if !ok {
		h.l.Warnf(ctx, "event.user.http.processGetOneRequest.GetPayloadFromContext: unauthorized")
		return models.Scope{}, "", pkgErrors.NewUnauthorizedHTTPError()
	}
	sc := jwt.NewScope(payload)

	id := c.Param("id")
	if id == "" {
		h.l.Warnf(ctx, "event.user.http.processGetOneRequest.Params.Get: id not found")
		return sc, "", errWrongBody
	}

	return sc, id, nil
}

func (h handler) processUpdateRequest(c *gin.Context) (UpdateRequest, models.Scope, string, error) {
	ctx := c.Request.Context()

	payload, ok := jwt.GetPayloadFromContext(ctx)
	if !ok {
		h.l.Warnf(ctx, "event.user.http.processUpdateRequest.GetPayloadFromContext: unauthorized")
		return UpdateRequest{}, models.Scope{}, "", pkgErrors.NewUnauthorizedHTTPError()
	}

	id := c.Param("id")
	if id == "" {
		h.l.Warnf(ctx, "event.user.http.processUpdateRequest.Params.Get: id not found")
		return UpdateRequest{}, models.Scope{}, "", pkgErrors.NewHTTPError(400, "id not found")
	}
	sc := jwt.NewScope(payload)

	var req UpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.l.Warnf(ctx, "event.user.http.processUpdateRequest.ShouldBindJSON: %v", err)
		return UpdateRequest{}, sc, "", errWrongBody
	}

	if err := req.validate(); err != nil {
		h.l.Warnf(ctx, "event.user.http.processUpdateRequest.validate: %v", err)
		return UpdateRequest{}, sc, "", err
	}

	return req, sc, id, nil
}

func (h handler) processDeleteRequest(c *gin.Context) (string, models.Scope, error) {
	ctx := c.Request.Context()

	payload, ok := jwt.GetPayloadFromContext(ctx)
	if !ok {
		h.l.Warnf(ctx, "event.user.http.processDeleteRequest.GetPayloadFromContext: unauthorized")
		return "", models.Scope{}, pkgErrors.NewUnauthorizedHTTPError()
	}
	sc := jwt.NewScope(payload)

	id, b := c.Params.Get("id")
	if !b {
		h.l.Warnf(ctx, "event.user.http.processDeleteRequest.Params.Get: id not found")
		return "", models.Scope{}, pkgErrors.NewHTTPError(400, "id not found")
	}

	return id, sc, nil
}

func (h handler) processCreateRequest(c *gin.Context) (CreateRequest, models.Scope, error) {
	ctx := c.Request.Context()

	payload, ok := jwt.GetPayloadFromContext(ctx)
	if !ok {
		h.l.Warnf(ctx, "event.user.http.processCreateRequest.GetPayloadFromContext: unauthorized")
		return CreateRequest{}, models.Scope{}, pkgErrors.NewUnauthorizedHTTPError()
	}
	sc := jwt.NewScope(payload)

	var req CreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.l.Warnf(ctx, "event.user.http.processCreateRequest.ShouldBindJSON: %v", err)
		return CreateRequest{}, sc, errWrongBody
	}

	if err := req.validate(); err != nil {
		h.l.Warnf(ctx, "event.user.http.processCreateRequest.validate: %v", err)
		return CreateRequest{}, sc, err
	}

	return req, sc, nil
}

func (h handler) processGetRequest(c *gin.Context) (user.GetInput, models.Scope, error) {
	ctx := c.Request.Context()

	payload, ok := jwt.GetPayloadFromContext(ctx)
	if !ok {
		h.l.Warnf(ctx, "event.user.http.processGetRequest.GetPayloadFromContext: unauthorized")
		return user.GetInput{}, models.Scope{}, pkgErrors.NewUnauthorizedHTTPError()
	}
	sc := jwt.NewScope(payload)

	var paginReq paginator.PaginatorQuery
	if err := c.ShouldBindQuery(&paginReq); err != nil {
		return user.GetInput{}, sc, errWrongQuery
	}
	paginReq.Adjust()

	req := user.GetInput{
		Filter: user.Filter{
			ShopID:       c.Query("shop_id"),
			RegionID:     c.Query("region_id"),
			BranchID:     c.Query("branch_id"),
			DepartmentID: c.Query("department_id"),
		},
		Pagin: paginReq,
	}

	return req, sc, nil
}
