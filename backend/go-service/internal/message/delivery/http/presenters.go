package http

import (
	"strings"

	"init-src/internal/message"
	"init-src/internal/models"
	"init-src/pkg/paginator"
	"init-src/pkg/response"
)

// sendReq represents the request body for sending a message
type sendReq struct {
	// Content of the message
	Content string `json:"content" binding:"required"`
	// Attachments (JSON array)
	Attachments *string `json:"attachments"`
	// Reply to message ID
	ReplyToID *string `json:"reply_to_id"`
}

// editReq represents the request body for editing a message
type editReq struct {
	// New content of the message
	Content string `json:"content" binding:"required"`
}

func (r sendReq) validate() error {
	if strings.TrimSpace(r.Content) == "" {
		return errWrongBody
	}
	return nil
}

func (r editReq) validate() error {
	if strings.TrimSpace(r.Content) == "" {
		return errWrongBody
	}
	return nil
}

func (r sendReq) toInput(conversationID string) message.SendInput {
	return message.SendInput{
		ConversationID: conversationID,
		Content:        r.Content,
		Attachments:    r.Attachments,
		ReplyToID:      r.ReplyToID,
	}
}

func (r editReq) toInput(conversationID, messageID string) message.EditMessageInput {
	return message.EditMessageInput{
		Filter: message.Filter{
			ID:             messageID,
			ConversationID: conversationID,
		},
		Content: r.Content,
	}
}

// detailResp represents a single message in responses
type detailResp struct {
	// ID Unique identifier of the message
	ID string `json:"id"`
	// ConversationID Conversation ID
	ConversationID string `json:"conversation_id"`
	// SenderID Sender User ID
	SenderID   string `json:"sender_id"`
	// SenderName Name of the message sender
	SenderName string `json:"sender_name"`
	// SenderAvatar Avatar URL of the message sender
	SenderAvatar string `json:"sender_avatar"`
	// SenderRole Role of the message sender (e.g., "Teacher", "Student")
	SenderRole string `json:"sender_role"`
	// Seq Sequence number in conversation
	Seq int64 `json:"seq"`
	// Type Type of message (text, system)
	Type models.MessageType `json:"type"`
	// Content Content of the message
	Content string `json:"content"`
	// Attachments Attachments (JSON array)
	Attachments *string `json:"attachments,omitempty"`
	// ReplyToID Reply to message ID
	ReplyToID *string `json:"reply_to_id,omitempty"`
	// EditedAt When the message was edited (null if not edited)
	EditedAt *response.DateTime `json:"edited_at,omitempty"`
	// CreatedAt Creation timestamp
	CreatedAt response.DateTime `json:"created_at"`
}

// deleteResp represents the response for deleting a message
type deleteResp struct {
	// Success/failure message
	Message string `json:"message"`
}

func (h handler) newDeleteResp(d string) deleteResp {
	return deleteResp{
		Message: d,
	}
}

func (h handler) newDetailResp(d message.MessageWithSender) detailResp {
	resp := detailResp{
		ID:             d.ID.String(),
		ConversationID: d.ConversationID.String(),
		SenderID:       d.Sender.ID,
		SenderName:     d.Sender.Name,
		SenderAvatar:   d.Sender.Avatar,
		SenderRole:     d.Sender.Role,
		Seq:            d.Seq,
		Type:           d.Type,
		Content:        d.Content,
		Attachments:    d.Attachments,
		CreatedAt:      response.DateTime(d.CreatedAt),
	}

	if d.ReplyToID != nil {
		replyToIDStr := d.ReplyToID.String()
		resp.ReplyToID = &replyToIDStr
	}

	if d.EditedAt != nil {
		editedAt := response.DateTime(*d.EditedAt)
		resp.EditedAt = &editedAt
	}

	return resp
}

type GetRequest struct {
	MinSeq *int64
	MaxSeq *int64
}

type GetByIDRequest struct {
	ID string
}

func (r GetByIDRequest) toInput(conversationID string) message.GetOneInput {
	return message.GetOneInput{
		Filter: message.Filter{
			ID:             r.ID,
			ConversationID: conversationID,
		},
	}
}

type DeleteRequest struct {
	ID string
}

func (r DeleteRequest) toInput(conversationID string) message.DeleteInput {
	return message.DeleteInput{
		Filter: message.Filter{
			ID:             r.ID,
			ConversationID: conversationID,
		},
	}
}

type SearchRequest struct {
	Query string
}

func (r SearchRequest) toInput(conversationID string) message.SearchInput {
	return message.SearchInput{
		ConversationID: conversationID,
		Query:          r.Query,
	}
}

type SearchGlobalRequest struct {
	Query string
}

func (r SearchGlobalRequest) toInput() message.SearchGlobalInput {
	return message.SearchGlobalInput{
		Query: r.Query,
	}
}

func (r GetRequest) toInput(conversationID string, pagin paginator.PaginatorQuery) message.GetInput {
	pagin.Adjust()
	return message.GetInput{
		Filter: message.Filter{
			ConversationID: conversationID,
			MinSeq:         r.MinSeq,
			MaxSeq:         r.MaxSeq,
		},
		Pagin: pagin,
	}
}

type GetResponse struct {
	Messages []detailResp                `json:"messages"`
	Pagin    paginator.PaginatorResponse `json:"pagin"`
}

func (h handler) newGetResponse(d []message.MessageWithSender, pagin paginator.Paginator) GetResponse {
	var resp GetResponse
	for _, v := range d {
		resp.Messages = append(resp.Messages, h.newDetailResp(v))
	}
	return GetResponse{
		Pagin:    pagin.ToResponse(),
		Messages: resp.Messages,
	}
}

type GetByIDResponse struct {
	Message detailResp `json:"message"`
}

func (h handler) newGetByIDResponse(d message.MessageWithSender) GetByIDResponse {
	return GetByIDResponse{
		Message: h.newDetailResp(d),
	}
}

type SearchResponse struct {
	Messages []detailResp `json:"messages"`
	Total    int          `json:"total"`
}

func (h handler) newSearchResponse(messages []message.MessageWithSender) SearchResponse {
	var resp SearchResponse
	for _, m := range messages {
		resp.Messages = append(resp.Messages, h.newDetailResp(m))
	}
	resp.Total = len(messages)
	return resp
}
