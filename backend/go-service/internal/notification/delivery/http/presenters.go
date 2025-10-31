package http

import (
	"init-src/internal/models"
	"init-src/internal/notification"
	"init-src/pkg/paginator"
	"init-src/pkg/response"
)

// Request types
type GetRequest struct {
	Unread     bool   `form:"unread"`
	Type       string `form:"type"`
	EntityType string `form:"entity_type"`
	EntityID   string `form:"entity_id"`
}

func (r GetRequest) toInput(pagin paginator.PaginatorQuery) notification.GetInput {
	pagin.Adjust()

	input := notification.GetInput{
		Filter: notification.Filter{
			Unread: r.Unread,
		},
		Pagin: pagin,
	}

	if r.Type != "" {
		input.Filter.Type = models.NotificationType(r.Type)
	}

	if r.EntityType != "" {
		input.Filter.EntityType = &r.EntityType
	}

	if r.EntityID != "" {
		input.Filter.EntityID = &r.EntityID
	}

	return input
}

// Response types
type detailResp struct {
	ID         string                      `json:"id"`
	UserID     string                      `json:"user_id"`
	Type       string                      `json:"type"`
	Title      string                      `json:"title"`
	Body       string                      `json:"body"`
	EntityType *string                     `json:"entity_type,omitempty"`
	EntityID   *string                     `json:"entity_id,omitempty"`
	Data       *string                     `json:"data,omitempty"`
	ReadAt     *response.DateTime          `json:"read_at,omitempty"`
	CreatedAt  response.DateTime           `json:"created_at"`
}

type deleteResp struct {
	Message string `json:"message"`
}

type countUnreadResp struct {
	Count int64 `json:"count"`
}

type GetResponse struct {
	Notifications []detailResp                `json:"notifications"`
	Pagin         paginator.PaginatorResponse `json:"pagin"`
}

// Response constructors
func (h handler) newDetailResp(d models.Notification) detailResp {
	resp := detailResp{
		ID:         d.ID.String(),
		UserID:     d.UserID,
		Type:       string(d.Type),
		Title:      d.Title,
		Body:       d.Body,
		EntityType: d.EntityType,
		EntityID:   nil,
		Data:       d.Data,
		CreatedAt:  response.DateTime(d.CreatedAt),
	}

	if d.EntityID != nil {
		entityIDStr := d.EntityID.String()
		resp.EntityID = &entityIDStr
	}

	if d.ReadAt != nil {
		readAt := response.DateTime(*d.ReadAt)
		resp.ReadAt = &readAt
	}

	return resp
}

func (h handler) newGetResponse(notifications []models.Notification, pagin paginator.Paginator) GetResponse {
	var resp GetResponse
	for _, notif := range notifications {
		resp.Notifications = append(resp.Notifications, h.newDetailResp(notif))
	}

	return GetResponse{
		Notifications: resp.Notifications,
		Pagin:         pagin.ToResponse(),
	}
}

func (h handler) newDeleteResp(id string) deleteResp {
	return deleteResp{
		Message: "Notification deleted successfully",
	}
}

func (h handler) newCountUnreadResp(count int64) countUnreadResp {
	return countUnreadResp{
		Count: count,
	}
}
