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
		h.l.Warnf(ctx, "conversation.http.processCreateRequest.GetPayloadFromContext: unauthorized")
		return createReq{}, models.Scope{}, pkgErrors.NewUnauthorizedHTTPError()
	}

	sc := jwt.NewScope(payload)

	var req createReq
	if err := c.ShouldBindJSON(&req); err != nil {
		h.l.Errorf(ctx, "conversation.http.processCreateRequest.ShouldBindJSON", err)
		return createReq{}, sc, errWrongBody
	}

	if err := req.validate(); err != nil {
		h.l.Errorf(ctx, "conversation.http.processCreateRequest.validate", err)
		return createReq{}, sc, err
	}

	return req, sc, nil
}

func (h handler) processGetByIDRequest(c *gin.Context) (models.Scope, GetByIDRequest, error) {
	ctx := c.Request.Context()

	payload, ok := jwt.GetPayloadFromContext(ctx)
	if !ok {
		h.l.Warnf(ctx, "conversation.http.processGetByIDRequest.GetPayloadFromContext: unauthorized")
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
		h.l.Warnf(ctx, "conversation.http.processListRequest.GetPayloadFromContext: unauthorized")
		return GetRequest{}, paginator.PaginatorQuery{}, models.Scope{}, pkgErrors.NewUnauthorizedHTTPError()
	}

	sc := jwt.NewScope(payload)
	var pagin paginator.PaginatorQuery
	if err := c.ShouldBindQuery(&pagin); err != nil {
		h.l.Warnf(ctx, "conversation.http.processListRequest.ShouldBindQuery: %v", err)
		return GetRequest{}, pagin, models.Scope{}, errWrongQuery
	}
	pagin.Adjust()

	// Parse ClassID query param
	var classID *string
	if classIDStr := c.Query("class_id"); classIDStr != "" {
		classID = &classIDStr
	}

	req := GetRequest{
		ID:      c.Query("id"),
		Type:    c.Query("type"),
		ClassID: classID,
	}
	return req, pagin, sc, nil
}

func (h handler) processLeaveRequest(c *gin.Context) (models.Scope, string, error) {
	ctx := c.Request.Context()

	payload, ok := jwt.GetPayloadFromContext(ctx)
	if !ok {
		h.l.Warnf(ctx, "conversation.http.processLeaveRequest.GetPayloadFromContext: unauthorized")
		return models.Scope{}, "", pkgErrors.NewUnauthorizedHTTPError()
	}

	id := c.Param("id")
	sc := jwt.NewScope(payload)

	return sc, id, nil
}

func (h handler) processAddParticipantsRequest(c *gin.Context) (addParticipantsReq, models.Scope, string, error) {
	ctx := c.Request.Context()

	payload, ok := jwt.GetPayloadFromContext(ctx)
	if !ok {
		h.l.Warnf(ctx, "conversation.http.processAddParticipantsRequest.GetPayloadFromContext: unauthorized")
		return addParticipantsReq{}, models.Scope{}, "", pkgErrors.NewUnauthorizedHTTPError()
	}

	sc := jwt.NewScope(payload)

	var req addParticipantsReq
	if err := c.ShouldBindJSON(&req); err != nil {
		h.l.Errorf(ctx, "conversation.http.processAddParticipantsRequest.ShouldBindJSON", err)
		return addParticipantsReq{}, sc, "", errWrongBody
	}

	if err := req.validate(); err != nil {
		h.l.Errorf(ctx, "conversation.http.processAddParticipantsRequest.validate", err)
		return addParticipantsReq{}, sc, "", err
	}

	conversationID := c.Param("id")

	return req, sc, conversationID, nil
}

func (h handler) processGetParticipantsRequest(c *gin.Context) (models.Scope, string, error) {
	ctx := c.Request.Context()

	payload, ok := jwt.GetPayloadFromContext(ctx)
	if !ok {
		h.l.Warnf(ctx, "conversation.http.processGetParticipantsRequest.GetPayloadFromContext: unauthorized")
		return models.Scope{}, "", pkgErrors.NewUnauthorizedHTTPError()
	}

	sc := jwt.NewScope(payload)
	conversationID := c.Param("id")

	return sc, conversationID, nil
}

func (h handler) processMarkAsReadRequest(c *gin.Context) (markAsReadReq, models.Scope, string, error) {
	ctx := c.Request.Context()

	payload, ok := jwt.GetPayloadFromContext(ctx)
	if !ok {
		h.l.Warnf(ctx, "conversation.http.processMarkAsReadRequest.GetPayloadFromContext: unauthorized")
		return markAsReadReq{}, models.Scope{}, "", pkgErrors.NewUnauthorizedHTTPError()
	}

	sc := jwt.NewScope(payload)

	var req markAsReadReq
	if err := c.ShouldBindJSON(&req); err != nil {
		h.l.Errorf(ctx, "conversation.http.processMarkAsReadRequest.ShouldBindJSON", err)
		return markAsReadReq{}, sc, "", errWrongBody
	}

	if err := req.validate(); err != nil {
		h.l.Errorf(ctx, "conversation.http.processMarkAsReadRequest.validate", err)
		return markAsReadReq{}, sc, "", err
	}

	conversationID := c.Param("id")

	return req, sc, conversationID, nil
}
