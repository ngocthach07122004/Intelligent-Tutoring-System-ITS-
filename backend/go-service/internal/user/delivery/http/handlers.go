package http

import (
	"init-src/internal/models"
	"init-src/pkg/response"

	"github.com/gin-gonic/gin"
)

// @Summary signup
// @Description Register a new user account
// @Tags Users
// @Accept json
// @Produce json
// @Param body body SignupRequest true "User signup info"
// @Success 200 {object} SignUpResponse
// @Failure 400 {object} response.Resp "Bad Request"
// @Failure 500 {object} response.Resp "Internal Server Error"
// @Router /api/v1/signup [POST]
func (h handler) SignUp(c *gin.Context) {
	ctx := c.Request.Context()

	req, err := h.processSignupRequest(c)
	if err != nil {
		h.l.Warnf(ctx, "Failed to process signup request: %v", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	b, err := h.uc.SignUp(ctx, models.Scope{}, req.toInput())
	if err != nil {
		h.l.Warnf(ctx, "Failed to sign up user: %v", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	response.OK(c, h.newSignUpResponse(b))
}

// @Summary User login
// @Description Login with user credentials
// @Tags Users
// @Accept json
// @Produce json
// @Param body body LoginRequest true "User login info"
// @Success 200 {object} LoginResponse
// @Failure 400 {object} response.Resp "Bad Request"
// @Failure 401 {object} response.Resp "Unauthorized"
// @Failure 500 {object} response.Resp "Internal Server Error"
// @Router /api/v1/login [POST]
func (h handler) Login(c *gin.Context) {
	ctx := c.Request.Context()

	req, err := h.processLoginRequest(c)
	if err != nil {
		h.l.Warnf(ctx, "Failed to process login request: %v", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	token, err := h.uc.Login(ctx, req.toInput())
	if err != nil {
		h.l.Warnf(ctx, "Failed to login user: %v", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	response.OK(c, h.newLoginResponse(token))
}

// @Summary Get users list
// @Description Get list of users with pagination and related data
// @Tags Users
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer JWT token"
// @Param page query int false "Page number" default(1)
// @Param limit query int false "Items per page" default(15)
// @Param shop_id query string false "Filter by shop ID"
// @Param region_id query string false "Filter by region ID"
// @Param branch_id query string false "Filter by branch ID"
// @Param department_id query string false "Filter by department ID"
// @Success 200 {object} GetResponse
// @Failure 400 {object} response.Resp "Bad Request"
// @Failure 401 {object} response.Resp "Unauthorized"
// @Failure 403 {object} response.Resp "Forbidden"
// @Failure 500 {object} response.Resp "Internal Server Error"
// @Router /api/v1/users [GET]
func (h handler) Get(c *gin.Context) {
	ctx := c.Request.Context()

	req, sc, err := h.processGetRequest(c)
	if err != nil {
		h.l.Warnf(ctx, "user.handlers.Get: %v", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	output, err := h.uc.Get(ctx, sc, req)
	if err != nil {
		h.l.Warnf(ctx, "user.handlers.us.Get: %v", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	response.OK(c, h.newGetResponse(output))
}

// @Summary Get user by ID
// @Description Get user details by ID with related data
// @Tags Users
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer JWT token"
// @Param id path string true "User ID"
// @Success 200 {object} GetByIDResponse
// @Failure 400 {object} response.Resp "Bad Request"
// @Failure 401 {object} response.Resp "Unauthorized"
// @Failure 403 {object} response.Resp "Forbidden"
// @Failure 404 {object} response.Resp "Not Found"
// @Failure 500 {object} response.Resp "Internal Server Error"
// @Router /api/v1/users/{id} [GET]
func (h handler) GetByID(c *gin.Context) {
	ctx := c.Request.Context()
	sc, id, err := h.processGetByIDRequest(c)
	if err != nil {
		h.l.Warnf(ctx, "user.handlers.GetByID: %v", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	output, err := h.uc.GetByID(ctx, sc, id)
	if err != nil {
		h.l.Warnf(ctx, "user.handlers.us.GetByID: %v", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	response.OK(c, h.newGetByIDResponse(output))
}

// @Summary Update user
// @Description Update user details
// @Tags Users
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer JWT token"
// @Param id path string true "User ID"
// @Param body body UpdateRequest true "User info"
// @Success 200 {object} UpdateResponse
// @Failure 400 {object} response.Resp "Bad Request"
// @Failure 401 {object} response.Resp "Unauthorized"
// @Failure 403 {object} response.Resp "Forbidden"
// @Failure 404 {object} response.Resp "Not Found"
// @Failure 500 {object} response.Resp "Internal Server Error"
// @Router /api/v1/users/{id} [PUT]
func (h handler) Update(c *gin.Context) {
	ctx := c.Request.Context()

	req, sc, id, err := h.processUpdateRequest(c)
	if err != nil {
		h.l.Warnf(ctx, "Failed to process update request: %v", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	user, err := h.uc.Update(ctx, sc, id, req.toInput())
	if err != nil {
		h.l.Warnf(ctx, "Failed to update user: %v", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	response.OK(c, h.newUpdateResponse(user))
}

// @Summary Delete user
// @Description Delete a user
// @Tags Users
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer JWT token"
// @Param id path string true "User ID"
// @Success 200 {object} DeleteResponse
// @Failure 400 {object} response.Resp "Bad Request"
// @Failure 401 {object} response.Resp "Unauthorized"
// @Failure 403 {object} response.Resp "Forbidden"
// @Failure 404 {object} response.Resp "Not Found"
// @Failure 500 {object} response.Resp "Internal Server Error"
// @Router /api/v1/users/{id} [DELETE]
func (h handler) Delete(c *gin.Context) {
	ctx := c.Request.Context()
	id, sc, err := h.processDeleteRequest(c)
	if err != nil {
		h.l.Warnf(ctx, "Failed to process delete request: %v", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	res, err := h.uc.Delete(ctx, sc, id)
	if err != nil {
		h.l.Warnf(ctx, "Failed to delete user: %v", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	response.OK(c, h.newDeleteResponse(res))
}

// @Summary Create user
// @Description Create a new user
// @Tags Users
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer JWT token"
// @Param body body CreateRequest true "User info"
// @Success 200 {object} SignUpResponse
// @Failure 400 {object} response.Resp "Bad Request"
// @Failure 401 {object} response.Resp "Unauthorized"
// @Failure 403 {object} response.Resp "Forbidden"
// @Failure 500 {object} response.Resp "Internal Server Error"
// @Router /api/v1/users [POST]
func (h handler) Create(c *gin.Context) {
	ctx := c.Request.Context()
	req, sc, err := h.processCreateRequest(c)
	if err != nil {
		h.l.Warnf(ctx, "user.handlers.Create: %v", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	b, err := h.uc.Create(ctx, sc, req.toInput())
	if err != nil {
		h.l.Warnf(ctx, "user.handlers.Create: %v", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	response.OK(c, h.newCreateResponse(b))
}
