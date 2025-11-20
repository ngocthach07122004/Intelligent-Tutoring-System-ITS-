package http

import (
	"init-src/pkg/response"

	"github.com/gin-gonic/gin"
)

// list godoc
// @Summary      List notifications
// @Description  Get list of notifications for current user with pagination
// @Tags         notifications
// @Accept       json
// @Produce      json
// @Param        unread      query     bool    false  "Filter unread notifications"
// @Param        type        query     string  false  "Filter by notification type"
// @Param        entity_type query     string  false  "Filter by entity type"
// @Param        entity_id   query     string  false  "Filter by entity ID"
// @Param        page        query     int     false  "Page number" default(1)
// @Param        limit       query     int     false  "Items per page" default(20)
// @Success      200         {object}  response.Response{data=GetResponse}
// @Failure      400         {object}  response.Response
// @Failure      401         {object}  response.Response
// @Router       /notifications [get]
func (h handler) list(c *gin.Context) {
	ctx := c.Request.Context()

	req, pagin, sc, err := h.processListRequest(c)
	if err != nil {
		h.l.Warnf(ctx, "notification.handler.list.processListRequest: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	out, err := h.uc.Get(ctx, sc, req.toInput(pagin))
	if err != nil {
		h.l.Warnf(ctx, "notification.handler.list.uc.Get: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	response.OK(c, h.newGetResponse(out.Notifications, out.Pagin))
}

// markAsRead godoc
// @Summary      Mark notification as read
// @Description  Mark a specific notification as read
// @Tags         notifications
// @Accept       json
// @Produce      json
// @Param        id  path      string  true  "Notification ID"
// @Success      200 {object}  response.Response{data=object}
// @Failure      400 {object}  response.Response
// @Failure      401 {object}  response.Response
// @Failure      404 {object}  response.Response
// @Router       /notifications/{id}/read [put]
func (h handler) markAsRead(c *gin.Context) {
	ctx := c.Request.Context()

	sc, id, err := h.processMarkAsReadRequest(c)
	if err != nil {
		h.l.Warnf(ctx, "notification.handler.markAsRead.processMarkAsReadRequest: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	if err := h.uc.MarkAsRead(ctx, sc, id); err != nil {
		h.l.Warnf(ctx, "notification.handler.markAsRead.uc.MarkAsRead: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	response.OK(c, gin.H{"message": "Notification marked as read"})
}

// markAllAsRead godoc
// @Summary      Mark all notifications as read
// @Description  Mark all unread notifications as read for current user
// @Tags         notifications
// @Accept       json
// @Produce      json
// @Success      200 {object}  response.Response{data=object}
// @Failure      401 {object}  response.Response
// @Router       /notifications/read-all [put]
func (h handler) markAllAsRead(c *gin.Context) {
	ctx := c.Request.Context()

	sc, err := h.processMarkAllAsReadRequest(c)
	if err != nil {
		h.l.Warnf(ctx, "notification.handler.markAllAsRead.processMarkAllAsReadRequest: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	if err := h.uc.MarkAllAsRead(ctx, sc); err != nil {
		h.l.Warnf(ctx, "notification.handler.markAllAsRead.uc.MarkAllAsRead: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	response.OK(c, gin.H{"message": "All notifications marked as read"})
}

// delete godoc
// @Summary      Delete notification
// @Description  Delete a notification (soft delete)
// @Tags         notifications
// @Accept       json
// @Produce      json
// @Param        id  path      string  true  "Notification ID"
// @Success      200 {object}  response.Response{data=deleteResp}
// @Failure      400 {object}  response.Response
// @Failure      401 {object}  response.Response
// @Failure      404 {object}  response.Response
// @Router       /notifications/{id} [delete]
func (h handler) delete(c *gin.Context) {
	ctx := c.Request.Context()

	sc, id, err := h.processDeleteRequest(c)
	if err != nil {
		h.l.Warnf(ctx, "notification.handler.delete.processDeleteRequest: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	deletedID, err := h.uc.Delete(ctx, sc, id)
	if err != nil {
		h.l.Warnf(ctx, "notification.handler.delete.uc.Delete: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	response.OK(c, h.newDeleteResp(deletedID))
}

// countUnread godoc
// @Summary      Count unread notifications
// @Description  Get count of unread notifications for current user
// @Tags         notifications
// @Accept       json
// @Produce      json
// @Success      200 {object}  response.Response{data=countUnreadResp}
// @Failure      401 {object}  response.Response
// @Router       /notifications/unread/count [get]
func (h handler) countUnread(c *gin.Context) {
	ctx := c.Request.Context()

	sc, err := h.processCountUnreadRequest(c)
	if err != nil {
		h.l.Warnf(ctx, "notification.handler.countUnread.processCountUnreadRequest: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	count, err := h.uc.CountUnread(ctx, sc)
	if err != nil {
		h.l.Warnf(ctx, "notification.handler.countUnread.uc.CountUnread: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	response.OK(c, h.newCountUnreadResp(count))
}
