package http

import (
	"init-src/internal/models"
	pkgErrors "init-src/pkg/errors"
	"init-src/pkg/jwt"
	"init-src/pkg/paginator"

	"github.com/gin-gonic/gin"
)

func (h handler) processCreateRequest(c *gin.Context) (createReq, models.Scope, error) {
	ctx := c.Request.Context()

	payload, ok := jwt.GetPayloadFromContext(ctx)
	if !ok {
		h.l.Warnf(ctx, "event.branch.http.processCreateRequest.GetPayloadFromContext: unauthorized")
		return createReq{}, models.Scope{}, pkgErrors.NewUnauthorizedHTTPError()
	}

	sc := jwt.NewScope(payload)

	var req createReq
	if err := c.ShouldBindJSON(&req); err != nil {
		h.l.Errorf(ctx, "event.branch.http.processCreateRequest.ShouldBindJSON", err)
		return createReq{}, sc, errWrongBody
	}

	if err := req.validate(); err != nil {
		h.l.Errorf(ctx, "event.branch.http.processCreateRequest.validate", err)
		return createReq{}, sc, err
	}

	return req, sc, nil
}

func (h handler) processUpdateRequest(c *gin.Context) (updateReq, models.Scope, string, error) {
	ctx := c.Request.Context()

	payload, ok := jwt.GetPayloadFromContext(ctx)
	if !ok {
		h.l.Warnf(ctx, "event.branch.http.processUpdateRequest.GetPayloadFromContext: unauthorized")
		return updateReq{}, models.Scope{}, "", pkgErrors.NewUnauthorizedHTTPError()
	}

	var req updateReq
	if err := c.ShouldBindJSON(&req); err != nil {
		h.l.Errorf(ctx, "event.branch.http.processUpdateRequest.ShouldBindJSON", err)
		return updateReq{}, models.Scope{}, "", errWrongBody
	}

	if err := req.validate(); err != nil {
		h.l.Errorf(ctx, "event.branch.http.processUpdateRequest.validate", err)
		return updateReq{}, models.Scope{}, "", err
	}

	id := c.Param("id")
	sc := jwt.NewScope(payload)

	return req, sc, id, nil
}

func (h handler) processGetByIDRequest(c *gin.Context) (models.Scope, GetByIDRequest, error) {
	ctx := c.Request.Context()

	payload, ok := jwt.GetPayloadFromContext(ctx)
	if !ok {
		h.l.Warnf(ctx, "event.branch.http.processGetByIDRequest.GetPayloadFromContext: unauthorized")
		return models.Scope{}, GetByIDRequest{}, pkgErrors.NewUnauthorizedHTTPError()
	}

	sc := jwt.NewScope(payload)
	req := GetByIDRequest{
		ID: c.Param("id"),
	}

	return sc, req, nil
}

func (h handler) processListRequest(c *gin.Context) (GetRequest, paginator.PaginatorQuery, models.Scope, error) {
	ctx := c.Request.Context()

	payload, ok := jwt.GetPayloadFromContext(ctx)
	if !ok {
		h.l.Warnf(ctx, "event.branch.http.processListRequest.GetPayloadFromContext: unauthorized")
		return GetRequest{}, paginator.PaginatorQuery{}, models.Scope{}, pkgErrors.NewUnauthorizedHTTPError()
	}

	sc := jwt.NewScope(payload)
	var pagin paginator.PaginatorQuery
	if err := c.ShouldBindQuery(&pagin); err != nil {
		h.l.Warnf(ctx, "event.branch.http.processListRequest.ShouldBindQuery: %v", err)
		return GetRequest{}, pagin, models.Scope{}, errWrongQuery
	}
	pagin.Adjust()

	req := GetRequest{
		ID:       c.Query("id"),
		Name:     c.Query("name"),
		Code:     c.Query("code"),
		Alias:    c.Query("alias"),
		ShopID:   c.Query("shop_id"),
		RegionID: c.Query("region_id"),
	}
	return req, pagin, sc, nil
}

func (h handler) processDeleteRequest(c *gin.Context) (models.Scope, string, error) {
	ctx := c.Request.Context()

	payload, ok := jwt.GetPayloadFromContext(ctx)
	if !ok {
		h.l.Warnf(ctx, "event.branch.http.processDeleteRequest.GetPayloadFromContext: unauthorized")
		return models.Scope{}, "", pkgErrors.NewUnauthorizedHTTPError()
	}

	id := c.Param("id")
	sc := jwt.NewScope(payload)

	return sc, id, nil
}
