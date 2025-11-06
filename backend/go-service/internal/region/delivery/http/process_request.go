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

	var req createReq
	if err := c.ShouldBindJSON(&req); err != nil {
		h.l.Warnf(ctx, "event.branch.http.processCreateRequest.ShouldBindJSON: %v", err)
		return createReq{}, models.Scope{}, errWrongBody
	}

	if err := req.validate(); err != nil {
		h.l.Warnf(ctx, "event.branch.http.processCreateRequest.validate: %v", err)
		return createReq{}, models.Scope{}, err
	}

	sc := jwt.NewScope(payload)

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
		h.l.Warnf(ctx, "event.branch.http.processUpdateRequest.ShouldBindJSON: %v", err)
		return updateReq{}, models.Scope{}, "", errWrongBody
	}

	if err := req.validate(); err != nil {
		h.l.Warnf(ctx, "event.branch.http.processUpdateRequest.validate: %v", err)
		return updateReq{}, models.Scope{}, "", err
	}

	sc := jwt.NewScope(payload)
	id := c.Param("id")

	return req, sc, id, nil
}

func (h handler) processDeleteRequest(c *gin.Context) (models.Scope, string, error) {
	ctx := c.Request.Context()

	payload, ok := jwt.GetPayloadFromContext(ctx)
	if !ok {
		h.l.Warnf(ctx, "event.branch.http.processDeleteRequest.GetPayloadFromContext: unauthorized")
		return models.Scope{}, "", pkgErrors.NewUnauthorizedHTTPError()
	}

	sc := jwt.NewScope(payload)
	id := c.Param("id")

	return sc, id, nil
}

func (h handler) processGetRequest(c *gin.Context) (GetRequest, paginator.PaginatorQuery, models.Scope, error) {
	ctx := c.Request.Context()

	payload, ok := jwt.GetPayloadFromContext(ctx)
	if !ok {
		h.l.Warnf(ctx, "event.region.http.processGetRequest.GetPayloadFromContext: unauthorized")
		return GetRequest{}, paginator.PaginatorQuery{}, models.Scope{}, pkgErrors.NewUnauthorizedHTTPError()
	}
	sc := jwt.NewScope(payload)

	var pagin paginator.PaginatorQuery
	if err := c.ShouldBindQuery(&pagin); err != nil {
		h.l.Warnf(ctx, "event.region.http.processGetRequest.ShouldBindQuery: %v", err)
		return GetRequest{}, paginator.PaginatorQuery{}, models.Scope{}, errWrongQuery
	}

	req := GetRequest{
		ID:     c.Query("id"),
		Name:   c.Query("name"),
		Code:   c.Query("code"),
		Alias:  c.Query("alias"),
		ShopID: c.Query("shop_id"),
	}

	return req, pagin, sc, nil
}

func (h handler) processGetByIDRequest(c *gin.Context) (GetOneRequest, models.Scope, error) {
	ctx := c.Request.Context()

	payload, ok := jwt.GetPayloadFromContext(ctx)
	if !ok {
		h.l.Warnf(ctx, "event.region.http.processGetOneRequest.GetPayloadFromContext: unauthorized")
		return GetOneRequest{}, models.Scope{}, pkgErrors.NewUnauthorizedHTTPError()
	}
	sc := jwt.NewScope(payload)

	id := c.Param("id")

	req := GetOneRequest{
		ID: id,
	}

	return req, sc, nil
}
