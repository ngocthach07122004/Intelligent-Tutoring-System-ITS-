package http

import (
	"strings"

	"init-src/internal/models"
	"init-src/pkg/paginator"

	"github.com/gin-gonic/gin"
)

func (h handler) processListRequest(c *gin.Context) (GetRequest, paginator.PaginatorQuery, models.Scope, error) {
	sc, ok := c.Get("scope")
	if !ok {
		return GetRequest{}, paginator.PaginatorQuery{}, models.Scope{}, errUnauthorized
	}

	var req GetRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		h.l.Warnf(c.Request.Context(), "notification.http.processListRequest.ShouldBindQuery: %v", err)
		return GetRequest{}, paginator.PaginatorQuery{}, models.Scope{}, errWrongQuery
	}

	var pagin paginator.PaginatorQuery
	if err := c.ShouldBindQuery(&pagin); err != nil {
		h.l.Warnf(c.Request.Context(), "notification.http.processListRequest.ShouldBindQuery(pagin): %v", err)
		return GetRequest{}, paginator.PaginatorQuery{}, models.Scope{}, errWrongQuery
	}
	pagin.Adjust()

	return req, pagin, sc.(models.Scope), nil
}

func (h handler) processMarkAsReadRequest(c *gin.Context) (models.Scope, string, error) {
	sc, ok := c.Get("scope")
	if !ok {
		return models.Scope{}, "", errUnauthorized
	}

	id := c.Param("id")
	if strings.TrimSpace(id) == "" {
		return models.Scope{}, "", errWrongQuery
	}

	return sc.(models.Scope), id, nil
}

func (h handler) processMarkAllAsReadRequest(c *gin.Context) (models.Scope, error) {
	sc, ok := c.Get("scope")
	if !ok {
		return models.Scope{}, errUnauthorized
	}

	return sc.(models.Scope), nil
}

func (h handler) processDeleteRequest(c *gin.Context) (models.Scope, string, error) {
	sc, ok := c.Get("scope")
	if !ok {
		return models.Scope{}, "", errUnauthorized
	}

	id := c.Param("id")
	if strings.TrimSpace(id) == "" {
		return models.Scope{}, "", errWrongQuery
	}

	return sc.(models.Scope), id, nil
}

func (h handler) processCountUnreadRequest(c *gin.Context) (models.Scope, error) {
	sc, ok := c.Get("scope")
	if !ok {
		return models.Scope{}, errUnauthorized
	}

	return sc.(models.Scope), nil
}
