package http

import (
	"init-src/pkg/response"

	"github.com/gin-gonic/gin"
)

// @Summary Create shop
// @Description Create a new shop
// @Tags Shops
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer JWT token"
// @Param body body createReq true "Shop info"
// @Success 200 {object} detailResp
// @Failure 400 {object} response.Resp "Bad Request"
// @Failure 401 {object} response.Resp "Unauthorized"
// @Failure 403 {object} response.Resp "Forbidden"
// @Failure 500 {object} response.Resp "Internal Server Error"
// @Router /api/v1/shops [POST]
func (h handler) Create(c *gin.Context) {
	ctx := c.Request.Context()

	req, sc, err := h.processCreateRequest(c)
	if err != nil {
		h.l.Warnf(ctx, "shop.handler.create.processCreateRequest: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	b, err := h.uc.Create(ctx, sc, req.toInput())
	if err != nil {
		h.l.Warnf(ctx, "shop.handler.create.uc.Create: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	response.OK(c, h.newDetailResp(b))
}

// @Summary List shops
// @Description Get list of shops with pagination
// @Tags Shops
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer JWT token"
// @Param page query int false "Page number" default(1)
// @Param limit query int false "Items per page" default(10)
// @Success 200 {object} GetShopsResponse
// @Failure 400 {object} response.Resp "Bad Request"
// @Failure 401 {object} response.Resp "Unauthorized"
// @Failure 403 {object} response.Resp "Forbidden"
// @Failure 500 {object} response.Resp "Internal Server Error"
// @Router /api/v1/shops [GET]
func (h handler) List(c *gin.Context) {
	ctx := c.Request.Context()

	req, pagin, sc, err := h.processGetRequest(c)
	if err != nil {
		h.l.Warnf(ctx, "shop.handler.list.processListRequest: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	b, err := h.uc.Get(ctx, sc, req.toInput(pagin))
	if err != nil {
		h.l.Warnf(ctx, "shop.handler.list.uc.List: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	response.OK(c, h.newGetShopsResponse(b.Shops, b.Pagin))
}

// @Summary Get shop by ID
// @Description Get shop details by ID
// @Tags Shops
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer JWT token"
// @Param id path string true "Shop ID"
// @Success 200 {object} detailResp
// @Failure 400 {object} response.Resp "Bad Request"
// @Failure 401 {object} response.Resp "Unauthorized"
// @Failure 403 {object} response.Resp "Forbidden"
// @Failure 404 {object} response.Resp "Not Found"
// @Failure 500 {object} response.Resp "Internal Server Error"
// @Router /api/v1/shops/{id} [GET]
func (h handler) FindByID(c *gin.Context) {
	ctx := c.Request.Context()

	req, sc, err := h.processGetOneRequest(c)
	if err != nil {
		h.l.Warnf(ctx, "shop.handler.getByID.processGetByID: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	b, err := h.uc.GetOne(ctx, sc, req.toInput())
	if err != nil {
		h.l.Warnf(ctx, "shop.handler.getByID.uc.GetByID: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	response.OK(c, h.newGetShopResponse(b.Shop))
}

// @Summary Update shop
// @Description Update shop details
// @Tags Shops
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer JWT token"
// @Param id path string true "Shop ID"
// @Param body body updateReq true "Shop info"
// @Success 200 {object} detailResp
// @Failure 400 {object} response.Resp "Bad Request"
// @Failure 401 {object} response.Resp "Unauthorized"
// @Failure 403 {object} response.Resp "Forbidden"
// @Failure 404 {object} response.Resp "Not Found"
// @Failure 500 {object} response.Resp "Internal Server Error"
// @Router /api/v1/shops/{id} [PUT]
func (h handler) Update(c *gin.Context) {
	ctx := c.Request.Context()

	req, sc, id, err := h.processUpdateRequest(c)
	if err != nil {
		h.l.Warnf(ctx, "shop.handler.update.processUpdateRequest: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	b, err := h.uc.Update(ctx, sc, id, req.toInput())
	if err != nil {
		h.l.Warnf(ctx, "shop.handler.update.uc.Update: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	response.OK(c, h.newDetailResp(b))
}

// @Summary Delete shop
// @Description Delete a shop
// @Tags Shops
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer JWT token"
// @Param id path string true "Shop ID"
// @Success 200 {object} deleteResp
// @Failure 400 {object} response.Resp "Bad Request"
// @Failure 401 {object} response.Resp "Unauthorized"
// @Failure 403 {object} response.Resp "Forbidden"
// @Failure 404 {object} response.Resp "Not Found"
// @Failure 500 {object} response.Resp "Internal Server Error"
// @Router /api/v1/shops/{id} [DELETE]
func (h handler) Delete(c *gin.Context) {
	ctx := c.Request.Context()

	sc, id, err := h.processDeleteRequest(c)
	if err != nil {
		h.l.Warnf(ctx, "shop.handler.delete.processDeleteRequest: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	res, err := h.uc.Delete(ctx, sc, id)
	if err != nil {
		h.l.Warnf(ctx, "shop.handler.delete.uc.Delete: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	response.OK(c, h.newDeleteResp(res))
}
