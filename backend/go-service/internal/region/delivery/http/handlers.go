package http

import (
	"init-src/pkg/response"

	"github.com/gin-gonic/gin"
)

// @Summary Create region
// @Description Create a new region
// @Tags Regions
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer JWT token"
// @Param body body createReq true "Region info"
// @Success 200 {object} detailResp
// @Failure 400 {object} response.Resp "Bad Request"
// @Failure 401 {object} response.Resp "Unauthorized"
// @Failure 403 {object} response.Resp "Forbidden"
// @Failure 500 {object} response.Resp "Internal Server Error"
// @Router /api/v1/regions [POST]
func (h handler) create(c *gin.Context) {
	ctx := c.Request.Context()

	req, sc, err := h.processCreateRequest(c)
	if err != nil {
		h.l.Warnf(ctx, "region.handler.create.processCreateRequest: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	b, err := h.uc.Create(ctx, sc, req.toInput())
	if err != nil {
		h.l.Warnf(ctx, "region.handler.create.uc.Create: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	response.OK(c, h.newDetailResp(b))
}

// @Summary List regions
// @Description Get list of regions with pagination
// @Tags Regions
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer JWT token"
// @Param page query string false "Page number" default(1)
// @Param limit query string false "Items per page" default(10)
// @Success 200 {object} GetRegionsResponse
// @Failure 400 {object} response.Resp "Bad Request"
// @Failure 401 {object} response.Resp "Unauthorized"
// @Failure 403 {object} response.Resp "Forbidden"
// @Failure 500 {object} response.Resp "Internal Server Error"
// @Router /api/v1/regions [GET]
func (h handler) list(c *gin.Context) {
	ctx := c.Request.Context()

	req, pagin, sc, err := h.processGetRequest(c)
	if err != nil {
		h.l.Warnf(ctx, "region.handler.list.processListRequest: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	b, err := h.uc.Get(ctx, sc, req.toInput(pagin))
	if err != nil {
		h.l.Warnf(ctx, "region.handler.list.uc.List: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	response.OK(c, h.newGetRegionsResponse(b.Regions, b.Pagin))
}

// @Summary Get region by ID
// @Description Get region details by ID
// @Tags Regions
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer JWT token"
// @Param id path string true "Region ID"
// @Success 200 {object} detailResp
// @Failure 400 {object} response.Resp "Bad Request"
// @Failure 401 {object} response.Resp "Unauthorized"
// @Failure 403 {object} response.Resp "Forbidden"
// @Failure 404 {object} response.Resp "Not Found"
// @Failure 500 {object} response.Resp "Internal Server Error"
// @Router /api/v1/regions/{id} [GET]
func (h handler) findByID(c *gin.Context) {
	ctx := c.Request.Context()

	req, sc, err := h.processGetByIDRequest(c)
	if err != nil {
		h.l.Warnf(ctx, "region.handler.get.processGetByIDRequest: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	b, err := h.uc.GetOne(ctx, sc, req.toInput())
	if err != nil {
		h.l.Warnf(ctx, "region.handler.get.uc.GetByID: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	response.OK(c, h.newGetRegionResponse(b.Region))
}

// @Summary Update region
// @Description Update region details
// @Tags Regions
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer JWT token"
// @Param id path string true "Region ID"
// @Param body body updateReq true "Region info"
// @Success 200 {object} detailResp
// @Failure 400 {object} response.Resp "Bad Request"
// @Failure 401 {object} response.Resp "Unauthorized"
// @Failure 403 {object} response.Resp "Forbidden"
// @Failure 404 {object} response.Resp "Not Found"
// @Failure 500 {object} response.Resp "Internal Server Error"
// @Router /api/v1/regions/{id} [PUT]
func (h handler) update(c *gin.Context) {
	ctx := c.Request.Context()

	req, sc, id, err := h.processUpdateRequest(c)
	if err != nil {
		h.l.Warnf(ctx, "region.handler.update.processUpdateRequest: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	b, err := h.uc.Update(ctx, sc, id, req.toInput())
	if err != nil {
		h.l.Warnf(ctx, "region.handler.update.uc.Update: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	response.OK(c, h.newDetailResp(b))
}

// @Summary Delete region
// @Description Delete a region
// @Tags Regions
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer JWT token"
// @Param id path string true "Region ID"
// @Success 200 {object} deleteResp
// @Failure 400 {object} response.Resp "Bad Request"
// @Failure 401 {object} response.Resp "Unauthorized"
// @Failure 403 {object} response.Resp "Forbidden"
// @Failure 404 {object} response.Resp "Not Found"
// @Failure 500 {object} response.Resp "Internal Server Error"
// @Router /api/v1/regions/{id} [DELETE]
func (h handler) delete(c *gin.Context) {
	ctx := c.Request.Context()

	sc, id, err := h.processDeleteRequest(c)
	if err != nil {
		h.l.Warnf(ctx, "region.handler.delete.processDeleteRequest: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	res, err := h.uc.Delete(ctx, sc, id)
	if err != nil {
		h.l.Warnf(ctx, "region.handler.delete.uc.Delete: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	response.OK(c, h.newDeleteResp(res))
}
