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
		h.l.Warnf(ctx, "class.http.processCreateRequest.GetPayloadFromContext: unauthorized")
		return createReq{}, models.Scope{}, pkgErrors.NewUnauthorizedHTTPError()
	}

	sc := jwt.NewScope(payload)

	var req createReq
	if err := c.ShouldBindJSON(&req); err != nil {
		h.l.Errorf(ctx, "class.http.processCreateRequest.ShouldBindJSON", err)
		return createReq{}, sc, errWrongBody
	}

	if err := req.validate(); err != nil {
		h.l.Errorf(ctx, "class.http.processCreateRequest.validate", err)
		return createReq{}, sc, err
	}

	return req, sc, nil
}

func (h handler) processUpdateRequest(c *gin.Context) (updateReq, models.Scope, string, error) {
	ctx := c.Request.Context()

	payload, ok := jwt.GetPayloadFromContext(ctx)
	if !ok {
		h.l.Warnf(ctx, "class.http.processUpdateRequest.GetPayloadFromContext: unauthorized")
		return updateReq{}, models.Scope{}, "", pkgErrors.NewUnauthorizedHTTPError()
	}

	var req updateReq
	if err := c.ShouldBindJSON(&req); err != nil {
		h.l.Errorf(ctx, "class.http.processUpdateRequest.ShouldBindJSON", err)
		return updateReq{}, models.Scope{}, "", errWrongBody
	}

	if err := req.validate(); err != nil {
		h.l.Errorf(ctx, "class.http.processUpdateRequest.validate", err)
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
		h.l.Warnf(ctx, "class.http.processGetByIDRequest.GetPayloadFromContext: unauthorized")
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
		h.l.Warnf(ctx, "class.http.processListRequest.GetPayloadFromContext: unauthorized")
		return GetRequest{}, paginator.PaginatorQuery{}, models.Scope{}, pkgErrors.NewUnauthorizedHTTPError()
	}

	sc := jwt.NewScope(payload)
	var pagin paginator.PaginatorQuery
	if err := c.ShouldBindQuery(&pagin); err != nil {
		h.l.Warnf(ctx, "class.http.processListRequest.ShouldBindQuery: %v", err)
		return GetRequest{}, pagin, models.Scope{}, errWrongQuery
	}
	pagin.Adjust()

	// Parse archived query param
	var archived *bool
	if archivedStr := c.Query("archived"); archivedStr != "" {
		if archivedStr == "true" {
			val := true
			archived = &val
		} else if archivedStr == "false" {
			val := false
			archived = &val
		}
	}

	req := GetRequest{
		ID:       c.Query("id"),
		Name:     c.Query("name"),
		Code:     c.Query("code"),
		Archived: archived,
	}
	return req, pagin, sc, nil
}

func (h handler) processDeleteRequest(c *gin.Context) (models.Scope, string, error) {
	ctx := c.Request.Context()

	payload, ok := jwt.GetPayloadFromContext(ctx)
	if !ok {
		h.l.Warnf(ctx, "class.http.processDeleteRequest.GetPayloadFromContext: unauthorized")
		return models.Scope{}, "", pkgErrors.NewUnauthorizedHTTPError()
	}

	id := c.Param("id")
	sc := jwt.NewScope(payload)

	return sc, id, nil
}

func (h handler) processAddMemberRequest(c *gin.Context) (addMemberReq, models.Scope, string, error) {
	ctx := c.Request.Context()

	payload, ok := jwt.GetPayloadFromContext(ctx)
	if !ok {
		h.l.Warnf(ctx, "class.http.processAddMemberRequest.GetPayloadFromContext: unauthorized")
		return addMemberReq{}, models.Scope{}, "", pkgErrors.NewUnauthorizedHTTPError()
	}

	sc := jwt.NewScope(payload)

	var req addMemberReq
	if err := c.ShouldBindJSON(&req); err != nil {
		h.l.Errorf(ctx, "class.http.processAddMemberRequest.ShouldBindJSON", err)
		return addMemberReq{}, sc, "", errWrongBody
	}

	if err := req.validate(); err != nil {
		h.l.Errorf(ctx, "class.http.processAddMemberRequest.validate", err)
		return addMemberReq{}, sc, "", err
	}

	classID := c.Param("id")

	return req, sc, classID, nil
}

func (h handler) processRemoveMemberRequest(c *gin.Context) (models.Scope, string, string, error) {
	ctx := c.Request.Context()

	payload, ok := jwt.GetPayloadFromContext(ctx)
	if !ok {
		h.l.Warnf(ctx, "class.http.processRemoveMemberRequest.GetPayloadFromContext: unauthorized")
		return models.Scope{}, "", "", pkgErrors.NewUnauthorizedHTTPError()
	}

	sc := jwt.NewScope(payload)
	classID := c.Param("id")
	userID := c.Param("userId")

	return sc, classID, userID, nil
}

func (h handler) processListMembersRequest(c *gin.Context) (models.Scope, string, error) {
	ctx := c.Request.Context()

	payload, ok := jwt.GetPayloadFromContext(ctx)
	if !ok {
		h.l.Warnf(ctx, "class.http.processListMembersRequest.GetPayloadFromContext: unauthorized")
		return models.Scope{}, "", pkgErrors.NewUnauthorizedHTTPError()
	}

	sc := jwt.NewScope(payload)
	classID := c.Param("id")

	return sc, classID, nil
}

func (h handler) processJoinByCodeRequest(c *gin.Context) (joinByCodeReq, models.Scope, error) {
	ctx := c.Request.Context()

	payload, ok := jwt.GetPayloadFromContext(ctx)
	if !ok {
		h.l.Warnf(ctx, "class.http.processJoinByCodeRequest.GetPayloadFromContext: unauthorized")
		return joinByCodeReq{}, models.Scope{}, pkgErrors.NewUnauthorizedHTTPError()
	}

	sc := jwt.NewScope(payload)

	var req joinByCodeReq
	if err := c.ShouldBindJSON(&req); err != nil {
		h.l.Errorf(ctx, "class.http.processJoinByCodeRequest.ShouldBindJSON", err)
		return joinByCodeReq{}, sc, errWrongBody
	}

	if err := req.validate(); err != nil {
		h.l.Errorf(ctx, "class.http.processJoinByCodeRequest.validate", err)
		return joinByCodeReq{}, sc, err
	}

	return req, sc, nil
}
