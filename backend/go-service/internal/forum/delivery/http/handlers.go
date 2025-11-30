package http

import (
	"net/http"
	"strconv"

	"init-src/internal/forum"
	pkgErrors "init-src/pkg/errors"
	"init-src/pkg/jwt"
	"init-src/pkg/paginator"
	"init-src/pkg/response"

	"github.com/gin-gonic/gin"
)

func (h *handlers) CreatePost(c *gin.Context) {
	var req struct {
		Title   string   `json:"title" binding:"required"`
		Content string   `json:"content" binding:"required"`
		Tags    []string `json:"tags"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, pkgErrors.NewHTTPError(http.StatusBadRequest, "Invalid input"))
		return
	}

	userID, ok := jwt.GetUserIdFromContext(c.Request.Context())
	if !ok {
		response.Error(c, pkgErrors.NewUnauthorizedHTTPError())
		return
	}

	input := forum.CreatePostInput{
		Title:   req.Title,
		Content: req.Content,
		Tags:    req.Tags,
		UserID:  userID,
	}

	post, err := h.uc.CreatePost(c.Request.Context(), input)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.OK(c, post)
}

func (h *handlers) GetPost(c *gin.Context) {
	id := c.Param("id")
	post, err := h.uc.GetPost(c.Request.Context(), id)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.OK(c, post)
}

type ListPostsResponse struct {
	Posts []forum.PostResponse        `json:"posts"`
	Pagin paginator.PaginatorResponse `json:"pagin"`
}

func (h *handlers) ListPosts(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	sortBy := c.DefaultQuery("sort_by", "newest")
	filter := c.DefaultQuery("filter", "")
	tag := c.DefaultQuery("tag", "")

	input := forum.ListPostsInput{
		Paginator: paginator.PaginatorQuery{
			Page:  page,
			Limit: int64(limit),
		},
		SortBy: sortBy,
		Filter: filter,
		Tag:    tag,
	}

	output, err := h.uc.ListPosts(c.Request.Context(), input)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.OK(c, ListPostsResponse{
		Posts: output.Posts,
		Pagin: output.Pagin.ToResponse(),
	})
}

func (h *handlers) CreateComment(c *gin.Context) {
	postID := c.Param("id")
	var req struct {
		Content string `json:"content" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, pkgErrors.NewHTTPError(http.StatusBadRequest, "Invalid input"))
		return
	}

	userID, ok := jwt.GetUserIdFromContext(c.Request.Context())
	if !ok {
		response.Error(c, pkgErrors.NewUnauthorizedHTTPError())
		return
	}

	input := forum.CreateCommentInput{
		PostID:  postID,
		Content: req.Content,
		UserID:  userID,
	}

	comment, err := h.uc.CreateComment(c.Request.Context(), input)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.OK(c, comment)
}

func (h *handlers) VotePost(c *gin.Context) {
	h.vote(c, "post")
}

func (h *handlers) VoteComment(c *gin.Context) {
	h.vote(c, "comment")
}

func (h *handlers) vote(c *gin.Context, targetType string) {
	id := c.Param("id")
	var req struct {
		Value int `json:"value" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, pkgErrors.NewHTTPError(http.StatusBadRequest, "Invalid input"))
		return
	}

	userID, ok := jwt.GetUserIdFromContext(c.Request.Context())
	if !ok {
		response.Error(c, pkgErrors.NewUnauthorizedHTTPError())
		return
	}

	input := forum.VoteInput{
		TargetID: id,
		Type:     targetType,
		Value:    req.Value,
		UserID:   userID,
	}

	err := h.uc.Vote(c.Request.Context(), input)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.OK(c, gin.H{"message": "Vote recorded"})
}