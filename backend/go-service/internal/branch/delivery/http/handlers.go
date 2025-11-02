package http

import (
	"init-src/pkg/response"

	"github.com/gin-gonic/gin"
)

// @Summary Create branch
// @Description Create a new branch
// @Tags Branches
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer JWT token"
// @Param body body createReq true "Branch info"
// @Success 200 {object} detailResp
// @Failure 400 {object} response.Resp "Bad Request"
// @Failure 401 {object} response.Resp "Unauthorized"
// @Failure 403 {object} response.Resp "Forbidden"
// @Failure 500 {object} response.Resp "Internal Server Error"
// @Router /api/v1/branches [POST]
func (h handler) create(c *gin.Context) {
	ctx := c.Request.Context()

	req, sc, err := h.processCreateRequest(c)
	if err != nil {
		h.l.Warnf(ctx, "branch.handler.create.processCreateRequest: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	b, err := h.uc.Create(ctx, sc, req.toInput())
	if err != nil {
		h.l.Warnf(ctx, "branch.handler.create.uc.Create: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	response.OK(c, h.newDetailResp(b))
}

// @Summary List branches
// @Description Get list of branches with pagination
// @Tags Branches
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer JWT token"
// @Param page query string false "Page number" default(1)
// @Param limit query string false "Items per page" default(10)
// @Success 200 {object} GetResponse
// @Failure 400 {object} response.Resp "Bad Request"
// @Failure 401 {object} response.Resp "Unauthorized"
// @Failure 403 {object} response.Resp "Forbidden"
// @Failure 500 {object} response.Resp "Internal Server Error"
// @Router /api/v1/branches [GET]
func (h handler) list(c *gin.Context) {
	ctx := c.Request.Context()

	req, pagin, sc, err := h.processListRequest(c)
	if err != nil {
		h.l.Warnf(ctx, "branch.handler.list.processListRequest: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	b, err := h.uc.Get(ctx, sc, req.toInput(pagin))
	if err != nil {
		h.l.Warnf(ctx, "branch.handler.list.uc.List: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	response.OK(c, h.newGetResponse(b.Branches, b.Pagin))
}

// @Summary Get branch by ID
// @Description Get branch details by ID
// @Tags Branches
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer JWT token"
// @Param id path string true "Branch ID"
// @Success 200 {object} detailResp
// @Failure 400 {object} response.Resp "Bad Request"
// @Failure 401 {object} response.Resp "Unauthorized"
// @Failure 403 {object} response.Resp "Forbidden"
// @Failure 404 {object} response.Resp "Not Found"
// @Failure 500 {object} response.Resp "Internal Server Error"
// @Router /api/v1/branches/{id} [GET]
func (h handler) findByID(c *gin.Context) {
	ctx := c.Request.Context()

	sc, req, err := h.processGetByIDRequest(c)
	if err != nil {
		h.l.Warnf(ctx, "branch.handler.get.processGetByIDRequest: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	b, err := h.uc.GetOne(ctx, sc, req.toInput())
	if err != nil {
		h.l.Warnf(ctx, "branch.handler.get.uc.GetByID: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	response.OK(c, h.newGetByIDResponse(b.Branch))
}

// @Summary Update branch
// @Description Update branch details
// @Tags Branches
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer JWT token"
// @Param id path string true "Branch ID"
// @Param body body updateReq true "Branch info"
// @Success 200 {object} detailResp
// @Failure 400 {object} response.Resp "Bad Request"
// @Failure 401 {object} response.Resp "Unauthorized"
// @Failure 403 {object} response.Resp "Forbidden"
// @Failure 404 {object} response.Resp "Not Found"
// @Failure 500 {object} response.Resp "Internal Server Error"
// @Router /api/v1/branches/{id} [PUT]
func (h handler) update(c *gin.Context) {
	ctx := c.Request.Context()

	req, sc, id, err := h.processUpdateRequest(c)
	if err != nil {
		h.l.Warnf(ctx, "branch.handler.update.processUpdateRequest: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	b, err := h.uc.Update(ctx, sc, id, req.toInput())
	if err != nil {
		h.l.Warnf(ctx, "branch.handler.update.uc.Update: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	response.OK(c, h.newDetailResp(b))
}

// @Summary Delete branch
// @Description Delete a branch
// @Tags Branches
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer JWT token"
// @Param id path string true "Branch ID"
// @Success 200 {object} deleteResp
// @Failure 400 {object} response.Resp "Bad Request"
// @Failure 401 {object} response.Resp "Unauthorized"
// @Failure 403 {object} response.Resp "Forbidden"
// @Failure 404 {object} response.Resp "Not Found"
// @Failure 500 {object} response.Resp "Internal Server Error"
// @Router /api/v1/branches/{id} [DELETE]
func (h handler) delete(c *gin.Context) {
	ctx := c.Request.Context()

	sc, id, err := h.processDeleteRequest(c)
	if err != nil {
		h.l.Warnf(ctx, "branch.handler.delete.processDeleteRequest: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	res, err := h.uc.Delete(ctx, sc, id)
	if err != nil {
		h.l.Warnf(ctx, "branch.handler.delete.uc.Delete: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	response.OK(c, h.newDeleteResp(res))
}
