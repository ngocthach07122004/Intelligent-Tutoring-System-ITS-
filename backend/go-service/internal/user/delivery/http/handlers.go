package http

import (
	"net/http"

	pkgErrors "init-src/pkg/errors"
	"init-src/pkg/response"

	"github.com/gin-gonic/gin"
)

func (h *handler) List(c *gin.Context) {
	users, err := h.repo.List(c.Request.Context())
	if err != nil {
		response.Error(c, pkgErrors.NewHTTPError(http.StatusInternalServerError, "failed to list users"))
		return
	}

	response.OK(c, gin.H{"users": newUserListResponse(users)})
}

func (h *handler) Get(c *gin.Context) {
	id := c.Param("id")
	userModel, err := h.repo.GetUser(c.Request.Context(), id)
	if err != nil {
		response.Error(c, pkgErrors.NewHTTPError(http.StatusNotFound, "user not found"))
		return
	}

	response.OK(c, newUserResponse(userModel))
}

func (h *handler) Create(c *gin.Context) {
	var req userRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, pkgErrors.NewHTTPError(http.StatusBadRequest, "invalid request body"))
		return
	}

	created, err := h.repo.Create(c.Request.Context(), req.toCreateInput())
	if err != nil {
		response.Error(c, pkgErrors.NewHTTPError(http.StatusBadRequest, err.Error()))
		return
	}

	response.OK(c, newUserResponse(created))
}

func (h *handler) Update(c *gin.Context) {
	id := c.Param("id")
	var req updateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, pkgErrors.NewHTTPError(http.StatusBadRequest, "invalid request body"))
		return
	}

	updated, err := h.repo.Update(c.Request.Context(), id, req.toUpdateInput())
	if err != nil {
		response.Error(c, pkgErrors.NewHTTPError(http.StatusNotFound, err.Error()))
		return
	}

	response.OK(c, newUserResponse(updated))
}

func (h *handler) Delete(c *gin.Context) {
	id := c.Param("id")
	if err := h.repo.Delete(c.Request.Context(), id); err != nil {
		response.Error(c, pkgErrors.NewHTTPError(http.StatusNotFound, err.Error()))
		return
	}

	response.OK(c, gin.H{"deleted_id": id})
}
