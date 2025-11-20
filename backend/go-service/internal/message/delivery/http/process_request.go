package http

import (
	"strconv"
	"strings"

	"init-src/internal/models"
	"init-src/pkg/paginator"

	"github.com/gin-gonic/gin"
)

func (h handler) processSendRequest(c *gin.Context) (sendReq, models.Scope, string, error) {
	var req sendReq
	if err := c.ShouldBindJSON(&req); err != nil {
		return sendReq{}, models.Scope{}, "", errWrongBody
	}

	if err := req.validate(); err != nil {
		return sendReq{}, models.Scope{}, "", err
	}

	sc, ok := c.Get("scope")
	if !ok {
		return sendReq{}, models.Scope{}, "", errUnauthorized
	}

	conversationID := c.Param("id")
	if strings.TrimSpace(conversationID) == "" {
		return sendReq{}, models.Scope{}, "", errInvalidObjectID
	}

	return req, sc.(models.Scope), conversationID, nil
}

func (h handler) processGetRequest(c *gin.Context) (GetRequest, models.Scope, string, error) {
	var req GetRequest

	sc, ok := c.Get("scope")
	if !ok {
		return GetRequest{}, models.Scope{}, "", errUnauthorized
	}

	conversationID := c.Param("id")
	if strings.TrimSpace(conversationID) == "" {
		return GetRequest{}, models.Scope{}, "", errInvalidObjectID
	}

	// Parse optional query params
	if minSeqStr := c.Query("min_seq"); minSeqStr != "" {
		minSeq, err := strconv.ParseInt(minSeqStr, 10, 64)
		if err != nil {
			return GetRequest{}, models.Scope{}, "", errWrongQuery
		}
		req.MinSeq = &minSeq
	}

	if maxSeqStr := c.Query("max_seq"); maxSeqStr != "" {
		maxSeq, err := strconv.ParseInt(maxSeqStr, 10, 64)
		if err != nil {
			return GetRequest{}, models.Scope{}, "", errWrongQuery
		}
		req.MaxSeq = &maxSeq
	}

	return req, sc.(models.Scope), conversationID, nil
}

func (h handler) processFindByIDRequest(c *gin.Context) (GetByIDRequest, models.Scope, string, error) {
	sc, ok := c.Get("scope")
	if !ok {
		return GetByIDRequest{}, models.Scope{}, "", errUnauthorized
	}

	conversationID := c.Param("id")
	if strings.TrimSpace(conversationID) == "" {
		return GetByIDRequest{}, models.Scope{}, "", errInvalidObjectID
	}

	messageID := c.Param("message_id")
	if strings.TrimSpace(messageID) == "" {
		return GetByIDRequest{}, models.Scope{}, "", errInvalidObjectID
	}

	return GetByIDRequest{ID: messageID}, sc.(models.Scope), conversationID, nil
}

func (h handler) processEditRequest(c *gin.Context) (editReq, models.Scope, string, string, error) {
	var req editReq
	if err := c.ShouldBindJSON(&req); err != nil {
		return editReq{}, models.Scope{}, "", "", errWrongBody
	}

	if err := req.validate(); err != nil {
		return editReq{}, models.Scope{}, "", "", err
	}

	sc, ok := c.Get("scope")
	if !ok {
		return editReq{}, models.Scope{}, "", "", errUnauthorized
	}

	conversationID := c.Param("id")
	if strings.TrimSpace(conversationID) == "" {
		return editReq{}, models.Scope{}, "", "", errInvalidObjectID
	}

	messageID := c.Param("message_id")
	if strings.TrimSpace(messageID) == "" {
		return editReq{}, models.Scope{}, "", "", errInvalidObjectID
	}

	return req, sc.(models.Scope), conversationID, messageID, nil
}

func (h handler) processDeleteRequest(c *gin.Context) (DeleteRequest, models.Scope, string, error) {
	sc, ok := c.Get("scope")
	if !ok {
		return DeleteRequest{}, models.Scope{}, "", errUnauthorized
	}

	conversationID := c.Param("id")
	if strings.TrimSpace(conversationID) == "" {
		return DeleteRequest{}, models.Scope{}, "", errInvalidObjectID
	}

	messageID := c.Param("message_id")
	if strings.TrimSpace(messageID) == "" {
		return DeleteRequest{}, models.Scope{}, "", errInvalidObjectID
	}

	return DeleteRequest{ID: messageID}, sc.(models.Scope), conversationID, nil
}

func (h handler) processSearchRequest(c *gin.Context) (SearchRequest, models.Scope, string, error) {
	sc, ok := c.Get("scope")
	if !ok {
		return SearchRequest{}, models.Scope{}, "", errUnauthorized
	}

	conversationID := c.Param("id")
	if strings.TrimSpace(conversationID) == "" {
		return SearchRequest{}, models.Scope{}, "", errInvalidObjectID
	}

	query := c.Query("q")
	if strings.TrimSpace(query) == "" {
		return SearchRequest{}, models.Scope{}, "", errWrongQuery
	}

	return SearchRequest{Query: query}, sc.(models.Scope), conversationID, nil
}

func (h handler) processSearchGlobalRequest(c *gin.Context) (SearchGlobalRequest, models.Scope, error) {
	sc, ok := c.Get("scope")
	if !ok {
		return SearchGlobalRequest{}, models.Scope{}, errUnauthorized
	}

	query := c.Query("q")
	if strings.TrimSpace(query) == "" {
		return SearchGlobalRequest{}, models.Scope{}, errWrongQuery
	}

	return SearchGlobalRequest{Query: query}, sc.(models.Scope), nil
}

func extractPaginatorQuery(c *gin.Context) paginator.PaginatorQuery {
	var pq paginator.PaginatorQuery
	_ = c.ShouldBindQuery(&pq)
	return pq
}
