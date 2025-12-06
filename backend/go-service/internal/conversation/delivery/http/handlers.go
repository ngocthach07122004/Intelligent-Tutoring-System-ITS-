package http

import (
	"init-src/pkg/response"

	"github.com/gin-gonic/gin"
)

// @Summary Create conversation
// @Description Create a new conversation (direct, group, or class)
// @Tags Conversations
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer JWT token"
// @Param body body createReq true "Conversation info"
// @Success 200 {object} detailResp
// @Failure 400 {object} response.Resp "Bad Request"
// @Failure 401 {object} response.Resp "Unauthorized"
// @Failure 403 {object} response.Resp "Forbidden"
// @Failure 500 {object} response.Resp "Internal Server Error"
// @Router /api/v1/conversations [POST]
func (h handler) create(c *gin.Context) {
	ctx := c.Request.Context()

	req, sc, err := h.processCreateRequest(c)
	if err != nil {
		h.l.Warnf(ctx, "conversation.handler.create.processCreateRequest: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	conv, err := h.uc.Create(ctx, sc, req.toInput())
	if err != nil {
		h.l.Warnf(ctx, "conversation.handler.create.uc.Create: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	response.OK(c, h.newDetailResp(conv))
}

// @Summary List conversations
// @Description Get list of conversations with pagination
// @Tags Conversations
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer JWT token"
// @Param page query int false "Page number" default(1)
// @Param limit query int false "Items per page" default(10)
// @Param type query string false "Filter by type (direct, group, class)"
// @Param class_id query string false "Filter by class ID"
// @Success 200 {object} GetResponse
// @Failure 400 {object} response.Resp "Bad Request"
// @Failure 401 {object} response.Resp "Unauthorized"
// @Failure 403 {object} response.Resp "Forbidden"
// @Failure 500 {object} response.Resp "Internal Server Error"
// @Router /api/v1/conversations [GET]
func (h handler) list(c *gin.Context) {
	ctx := c.Request.Context()

	req, pagin, sc, err := h.processListRequest(c)
	if err != nil {
		h.l.Warnf(ctx, "conversation.handler.list.processListRequest: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	result, err := h.uc.Get(ctx, sc, req.toInput(pagin))
	if err != nil {
		h.l.Warnf(ctx, "conversation.handler.list.uc.Get: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	response.OK(c, h.newGetResponse(result.Conversations, result.Pagin))
}

// @Summary Get conversation by ID
// @Description Get conversation details by ID
// @Tags Conversations
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer JWT token"
// @Param id path string true "Conversation ID (UUID)"
// @Success 200 {object} GetByIDResponse
// @Failure 400 {object} response.Resp "Bad Request"
// @Failure 401 {object} response.Resp "Unauthorized"
// @Failure 403 {object} response.Resp "Forbidden"
// @Failure 404 {object} response.Resp "Not Found"
// @Failure 500 {object} response.Resp "Internal Server Error"
// @Router /api/v1/conversations/{id} [GET]
func (h handler) findByID(c *gin.Context) {
	ctx := c.Request.Context()

	sc, req, err := h.processGetByIDRequest(c)
	if err != nil {
		h.l.Warnf(ctx, "conversation.handler.findByID.processGetByIDRequest: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	result, err := h.uc.GetOne(ctx, sc, req.toInput())
	if err != nil {
		h.l.Warnf(ctx, "conversation.handler.findByID.uc.GetOne: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	response.OK(c, h.newGetByIDResponse(result.Conversation))
}

// @Summary Leave conversation
// @Description Leave a conversation (set left_at timestamp)
// @Tags Conversations
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer JWT token"
// @Param id path string true "Conversation ID (UUID)"
// @Success 200 {object} deleteResp
// @Failure 400 {object} response.Resp "Bad Request"
// @Failure 401 {object} response.Resp "Unauthorized"
// @Failure 403 {object} response.Resp "Forbidden"
// @Failure 404 {object} response.Resp "Not Found"
// @Failure 500 {object} response.Resp "Internal Server Error"
// @Router /api/v1/conversations/{id} [DELETE]
func (h handler) leave(c *gin.Context) {
	ctx := c.Request.Context()

	sc, id, err := h.processLeaveRequest(c)
	if err != nil {
		h.l.Warnf(ctx, "conversation.handler.leave.processLeaveRequest: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	res, err := h.uc.Leave(ctx, sc, id)
	if err != nil {
		h.l.Warnf(ctx, "conversation.handler.leave.uc.Leave: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	response.OK(c, h.newDeleteResp(res))
}

// @Summary Add participants to conversation
// @Description Add new participants to a group conversation
// @Tags Conversations
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer JWT token"
// @Param id path string true "Conversation ID (UUID)"
// @Param body body addParticipantsReq true "Participant User IDs"
// @Success 200 {object} response.Resp
// @Failure 400 {object} response.Resp "Bad Request"
// @Failure 401 {object} response.Resp "Unauthorized"
// @Failure 403 {object} response.Resp "Forbidden"
// @Failure 404 {object} response.Resp "Not Found"
// @Failure 500 {object} response.Resp "Internal Server Error"
// @Router /api/v1/conversations/{id}/participants [POST]
func (h handler) addParticipants(c *gin.Context) {
	ctx := c.Request.Context()

	req, sc, conversationID, err := h.processAddParticipantsRequest(c)
	if err != nil {
		h.l.Warnf(ctx, "conversation.handler.addParticipants.processAddParticipantsRequest: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	err = h.uc.AddParticipants(ctx, sc, conversationID, req.toInput())
	if err != nil {
		h.l.Warnf(ctx, "conversation.handler.addParticipants.uc.AddParticipants: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	response.OK(c, gin.H{"message": "Participants added"})
}

// @Summary Get conversation participants
// @Description Get list of all participants in the conversation
// @Tags Conversations
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer JWT token"
// @Param id path string true "Conversation ID (UUID)"
// @Success 200 {object} GetParticipantsResponse
// @Failure 400 {object} response.Resp "Bad Request"
// @Failure 401 {object} response.Resp "Unauthorized"
// @Failure 403 {object} response.Resp "Forbidden"
// @Failure 404 {object} response.Resp "Not Found"
// @Failure 500 {object} response.Resp "Internal Server Error"
// @Router /api/v1/conversations/{id}/participants [GET]
func (h handler) getParticipants(c *gin.Context) {
	ctx := c.Request.Context()

	sc, conversationID, err := h.processGetParticipantsRequest(c)
	if err != nil {
		h.l.Warnf(ctx, "conversation.handler.getParticipants.processGetParticipantsRequest: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	participants, err := h.uc.GetParticipants(ctx, sc, conversationID)
	if err != nil {
		h.l.Warnf(ctx, "conversation.handler.getParticipants.uc.GetParticipants: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	response.OK(c, h.newGetParticipantsResponse(participants))
}

// @Summary Mark conversation as read
// @Description Update last read sequence number for current user
// @Tags Conversations
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer JWT token"
// @Param id path string true "Conversation ID (UUID)"
// @Param body body markAsReadReq true "Last read sequence number"
// @Success 200 {object} MarkAsReadResponse
// @Failure 400 {object} response.Resp "Bad Request"
// @Failure 401 {object} response.Resp "Unauthorized"
// @Failure 403 {object} response.Resp "Forbidden"
// @Failure 404 {object} response.Resp "Not Found"
// @Failure 500 {object} response.Resp "Internal Server Error"
// @Router /api/v1/conversations/{id}/read [POST]
func (h handler) markAsRead(c *gin.Context) {
	ctx := c.Request.Context()

	req, sc, conversationID, err := h.processMarkAsReadRequest(c)
	if err != nil {
		h.l.Warnf(ctx, "conversation.handler.markAsRead.processMarkAsReadRequest: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	err = h.uc.MarkAsRead(ctx, sc, conversationID, req.Seq)
	if err != nil {
		h.l.Warnf(ctx, "conversation.handler.markAsRead.uc.MarkAsRead: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	response.OK(c, h.newMarkAsReadResponse())
}
