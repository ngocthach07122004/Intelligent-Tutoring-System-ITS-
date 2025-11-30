package http

import (
	"init-src/pkg/response"

	"github.com/gin-gonic/gin"
)

// @Summary Create class
// @Description Create a new class
// @Tags Classes
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer JWT token"
// @Param body body createReq true "Class info"
// @Success 200 {object} detailResp
// @Failure 400 {object} response.Resp "Bad Request"
// @Failure 401 {object} response.Resp "Unauthorized"
// @Failure 403 {object} response.Resp "Forbidden"
// @Failure 500 {object} response.Resp "Internal Server Error"
// @Router /api/v1/classes [POST]
func (h handler) create(c *gin.Context) {
	ctx := c.Request.Context()

	req, sc, err := h.processCreateRequest(c)
	if err != nil {
		h.l.Warnf(ctx, "class.handler.create.processCreateRequest: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	cls, err := h.uc.Create(ctx, sc, req.toInput())
	if err != nil {
		h.l.Warnf(ctx, "class.handler.create.uc.Create: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	response.OK(c, h.newDetailResp(cls))
}

// @Summary List user's classes
// @Description Get list of classes where the authenticated user is a member, with pagination
// @Tags Classes
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer JWT token"
// @Param page query int false "Page number" default(1)
// @Param limit query int false "Items per page" default(10)
// @Param name query string false "Filter by name"
// @Param code query string false "Filter by code"
// @Param archived query bool false "Filter by archived status"
// @Success 200 {object} GetResponse
// @Failure 400 {object} response.Resp "Bad Request"
// @Failure 401 {object} response.Resp "Unauthorized"
// @Failure 403 {object} response.Resp "Forbidden"
// @Failure 500 {object} response.Resp "Internal Server Error"
// @Router /api/v1/classes [GET]
func (h handler) list(c *gin.Context) {
	ctx := c.Request.Context()

	req, pagin, sc, err := h.processListRequest(c)
	if err != nil {
		h.l.Warnf(ctx, "class.handler.list.processListRequest: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	result, err := h.uc.Get(ctx, sc, req.toInput(pagin))
	if err != nil {
		h.l.Warnf(ctx, "class.handler.list.uc.Get: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	response.OK(c, h.newGetResponse(result.Classes, result.Pagin))
}

// @Summary Get class by ID
// @Description Get class details by ID
// @Tags Classes
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer JWT token"
// @Param id path string true "Class ID (UUID)"
// @Success 200 {object} GetByIDResponse
// @Failure 400 {object} response.Resp "Bad Request"
// @Failure 401 {object} response.Resp "Unauthorized"
// @Failure 403 {object} response.Resp "Forbidden"
// @Failure 404 {object} response.Resp "Not Found"
// @Failure 500 {object} response.Resp "Internal Server Error"
// @Router /api/v1/classes/{id} [GET]
func (h handler) findByID(c *gin.Context) {
	ctx := c.Request.Context()

	sc, req, err := h.processGetByIDRequest(c)
	if err != nil {
		h.l.Warnf(ctx, "class.handler.findByID.processGetByIDRequest: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	result, err := h.uc.GetOne(ctx, sc, req.toInput())
	if err != nil {
		h.l.Warnf(ctx, "class.handler.findByID.uc.GetOne: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	response.OK(c, h.newGetByIDResponse(result.Class))
}

// @Summary Update class
// @Description Update class details (teachers only)
// @Tags Classes
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer JWT token"
// @Param id path string true "Class ID (UUID)"
// @Param body body updateReq true "Class info"
// @Success 200 {object} detailResp
// @Failure 400 {object} response.Resp "Bad Request"
// @Failure 401 {object} response.Resp "Unauthorized"
// @Failure 403 {object} response.Resp "Forbidden"
// @Failure 404 {object} response.Resp "Not Found"
// @Failure 500 {object} response.Resp "Internal Server Error"
// @Router /api/v1/classes/{id} [PUT]
func (h handler) update(c *gin.Context) {
	ctx := c.Request.Context()

	req, sc, id, err := h.processUpdateRequest(c)
	if err != nil {
		h.l.Warnf(ctx, "class.handler.update.processUpdateRequest: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	cls, err := h.uc.Update(ctx, sc, id, req.toInput())
	if err != nil {
		h.l.Warnf(ctx, "class.handler.update.uc.Update: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	response.OK(c, h.newDetailResp(cls))
}

// @Summary Delete class
// @Description Delete a class (soft delete, teachers only)
// @Tags Classes
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer JWT token"
// @Param id path string true "Class ID (UUID)"
// @Success 200 {object} deleteResp
// @Failure 400 {object} response.Resp "Bad Request"
// @Failure 401 {object} response.Resp "Unauthorized"
// @Failure 403 {object} response.Resp "Forbidden"
// @Failure 404 {object} response.Resp "Not Found"
// @Failure 500 {object} response.Resp "Internal Server Error"
// @Router /api/v1/classes/{id} [DELETE]
func (h handler) delete(c *gin.Context) {
	ctx := c.Request.Context()

	sc, id, err := h.processDeleteRequest(c)
	if err != nil {
		h.l.Warnf(ctx, "class.handler.delete.processDeleteRequest: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	res, err := h.uc.Delete(ctx, sc, id)
	if err != nil {
		h.l.Warnf(ctx, "class.handler.delete.uc.Delete: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	response.OK(c, h.newDeleteResp(res))
}

// @Summary Add member to class
// @Description Add a new member to the class (teachers only)
// @Tags Classes
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer JWT token"
// @Param id path string true "Class ID (UUID)"
// @Param body body addMemberReq true "Member info"
// @Success 200 {object} memberResp
// @Failure 400 {object} response.Resp "Bad Request"
// @Failure 401 {object} response.Resp "Unauthorized"
// @Failure 403 {object} response.Resp "Forbidden"
// @Failure 404 {object} response.Resp "Not Found"
// @Failure 500 {object} response.Resp "Internal Server Error"
// @Router /api/v1/classes/{id}/members [POST]
func (h handler) addMember(c *gin.Context) {
	ctx := c.Request.Context()

	req, sc, classID, err := h.processAddMemberRequest(c)
	if err != nil {
		h.l.Warnf(ctx, "class.handler.addMember.processAddMemberRequest: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	member, err := h.uc.AddMember(ctx, sc, classID, req.toInput())
	if err != nil {
		h.l.Warnf(ctx, "class.handler.addMember.uc.AddMember: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	response.OK(c, h.newMemberResp(member))
}

// @Summary Remove member from class
// @Description Remove a member from the class (teachers only)
// @Tags Classes
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer JWT token"
// @Param id path string true "Class ID (UUID)"
// @Param userId path string true "User ID (MongoDB ObjectID)"
// @Success 200 {object} deleteResp
// @Failure 400 {object} response.Resp "Bad Request"
// @Failure 401 {object} response.Resp "Unauthorized"
// @Failure 403 {object} response.Resp "Forbidden"
// @Failure 404 {object} response.Resp "Not Found"
// @Failure 500 {object} response.Resp "Internal Server Error"
// @Router /api/v1/classes/{id}/members/{userId} [DELETE]
func (h handler) removeMember(c *gin.Context) {
	ctx := c.Request.Context()

	sc, classID, userID, err := h.processRemoveMemberRequest(c)
	if err != nil {
		h.l.Warnf(ctx, "class.handler.removeMember.processRemoveMemberRequest: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	res, err := h.uc.RemoveMember(ctx, sc, classID, userID)
	if err != nil {
		h.l.Warnf(ctx, "class.handler.removeMember.uc.RemoveMember: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	response.OK(c, h.newDeleteResp(res))
}

// @Summary List class members
// @Description Get list of all members in the class
// @Tags Classes
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer JWT token"
// @Param id path string true "Class ID (UUID)"
// @Success 200 {object} ListMembersResponse
// @Failure 400 {object} response.Resp "Bad Request"
// @Failure 401 {object} response.Resp "Unauthorized"
// @Failure 403 {object} response.Resp "Forbidden"
// @Failure 404 {object} response.Resp "Not Found"
// @Failure 500 {object} response.Resp "Internal Server Error"
// @Router /api/v1/classes/{id}/members [GET]
func (h handler) listMembers(c *gin.Context) {
	ctx := c.Request.Context()

	sc, classID, err := h.processListMembersRequest(c)
	if err != nil {
		h.l.Warnf(ctx, "class.handler.listMembers.processListMembersRequest: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	members, err := h.uc.ListMembers(ctx, sc, classID)
	if err != nil {
		h.l.Warnf(ctx, "class.handler.listMembers.uc.ListMembers: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	response.OK(c, h.newListMembersResponse(members))
}

// @Summary Join class by code
// @Description Join a class using its unique code
// @Tags Classes
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer JWT token"
// @Param body body joinByCodeReq true "Class code"
// @Success 200 {object} detailResp
// @Failure 400 {object} response.Resp "Bad Request"
// @Failure 401 {object} response.Resp "Unauthorized"
// @Failure 404 {object} response.Resp "Not Found"
// @Failure 500 {object} response.Resp "Internal Server Error"
// @Router /api/v1/classes/join [POST]
func (h handler) joinByCode(c *gin.Context) {
	ctx := c.Request.Context()

	req, sc, err := h.processJoinByCodeRequest(c)
	if err != nil {
		h.l.Warnf(ctx, "class.handler.joinByCode.processJoinByCodeRequest: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	cls, err := h.uc.JoinByCode(ctx, sc, req.Code)
	if err != nil {
		h.l.Warnf(ctx, "class.handler.joinByCode.uc.JoinByCode: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	response.OK(c, h.newDetailResp(cls))
}

// @Summary List current user's classes
// @Description Get list of classes where the authenticated user is a member
// @Tags Classes
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer JWT token"
// @Success 200 {object} GetResponse
// @Failure 400 {object} response.Resp "Bad Request"
// @Failure 401 {object} response.Resp "Unauthorized"
// @Failure 500 {object} response.Resp "Internal Server Error"
// @Router /users/me/classes [GET]
func (h handler) listUserClasses(c *gin.Context) {
	ctx := c.Request.Context()

	// Get user ID from context (set by auth middleware)
	userID := c.GetString("userId")
	if userID == "" {
		response.Unauthorized(c)
		return
	}

	// Reuse processListRequest but override MemberID
	req, pagin, sc, err := h.processListRequest(c)
	if err != nil {
		h.l.Warnf(ctx, "class.handler.listUserClasses.processListRequest: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	input := req.toInput(pagin)
	input.Filter.MemberID = userID

	result, err := h.uc.Get(ctx, sc, input)
	if err != nil {
		h.l.Warnf(ctx, "class.handler.listUserClasses.uc.Get: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	response.OK(c, h.newGetResponse(result.Classes, result.Pagin))
}
