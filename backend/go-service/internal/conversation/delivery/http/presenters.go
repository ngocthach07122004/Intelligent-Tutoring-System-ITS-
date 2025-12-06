package http

import (
	"strings"

	"init-src/internal/conversation"
	"init-src/internal/models"
	"init-src/pkg/paginator"
	"init-src/pkg/response"
)

// createReq represents the request body for creating a conversation
type createReq struct {
	// Type of conversation: "direct", "group", or "class"
	Type string `json:"type" binding:"required"`
	// Name of the conversation (required for group, optional for others)
	Name *string `json:"name"`
	// Class ID for class conversations
	ClassID *string `json:"class_id"`
	// Participant User IDs (MongoDB ObjectIDs)
	ParticipantIDs []string `json:"participant_ids" binding:"required"`
}

// addParticipantsReq represents the request body for adding participants
type addParticipantsReq struct {
	// User IDs to add (MongoDB ObjectIDs)
	UserIDs []string `json:"user_ids" binding:"required"`
}

// markAsReadReq represents the request body for marking as read
type markAsReadReq struct {
	// Sequence number of last read message
	Seq int64 `json:"seq" binding:"required"`
}

func (r createReq) validate() error {
	convType := models.ConversationType(r.Type)

	switch convType {
	case models.ConversationDirect:
		if len(r.ParticipantIDs) != 1 {
			return errInvalidInput
		}
	case models.ConversationGroup:
		if r.Name == nil || strings.TrimSpace(*r.Name) == "" {
			return errWrongBody
		}
		if len(r.ParticipantIDs) < 1 {
			return errInvalidInput
		}
	case models.ConversationClass:
		if r.ClassID == nil || *r.ClassID == "" {
			return errWrongBody
		}
	default:
		return errInvalidInput
	}

	return nil
}

func (r addParticipantsReq) validate() error {
	if len(r.UserIDs) == 0 {
		return errWrongBody
	}
	return nil
}

func (r markAsReadReq) validate() error {
	if r.Seq < 0 {
		return errWrongBody
	}
	return nil
}

func (r createReq) toInput() conversation.CreateInput {
	return conversation.CreateInput{
		Type:           models.ConversationType(r.Type),
		Name:           r.Name,
		ClassID:        r.ClassID,
		ParticipantIDs: r.ParticipantIDs,
	}
}

func (r addParticipantsReq) toInput() conversation.AddParticipantsInput {
	return conversation.AddParticipantsInput{
		UserIDs: r.UserIDs,
	}
}

// detailResp represents a single conversation in responses
type detailResp struct {
	// Unique identifier of the conversation
	ID string `json:"id"`
	// Type of conversation
	Type models.ConversationType `json:"type"`
	// Name of the conversation (null for direct chats)
	Name *string `json:"name,omitempty"`
	// Class ID if this is a class conversation
	ClassID *string `json:"class_id,omitempty"`
	// ID of the user who created the conversation
	CreatedBy string `json:"created_by"`
	// Creation timestamp
	CreatedAt response.DateTime `json:"created_at"`
	// Last update timestamp
	UpdatedAt response.DateTime `json:"updated_at"`
}

// participantResp represents a single participant in responses
type participantResp struct {
	// Unique identifier of the participation
	ID string `json:"id"`
	// Conversation ID
	ConversationID string `json:"conversation_id"`
	// User ID (MongoDB ObjectID)
	UserID string `json:"user_id"`
	// Sequence number of last read message
	LastReadSeq int64 `json:"last_read_seq"`
	// When the participant left (null if still active)
	LeftAt *response.DateTime `json:"left_at,omitempty"`
	// When the participant joined
	JoinedAt response.DateTime `json:"joined_at"`
}

// deleteResp represents the response for leaving a conversation
type deleteResp struct {
	// Success/failure message
	Message string `json:"message"`
}

func (h handler) newDeleteResp(d string) deleteResp {
	return deleteResp{
		Message: d,
	}
}

func (h handler) newDetailResp(d models.Conversation) detailResp {
	resp := detailResp{
		ID:        d.ID.String(),
		Type:      d.Type,
		Name:      d.Name,
		CreatedBy: d.CreatedBy,
		CreatedAt: response.DateTime(d.CreatedAt),
		UpdatedAt: response.DateTime(d.UpdatedAt),
	}

	if d.ClassID != nil {
		classIDStr := d.ClassID.String()
		resp.ClassID = &classIDStr
	}

	return resp
}

func (h handler) newParticipantResp(p models.ConversationParticipant) participantResp {
	resp := participantResp{
		ID:             p.ID.String(),
		ConversationID: p.ConversationID.String(),
		UserID:         p.UserID,
		LastReadSeq:    p.LastReadSeq,
		JoinedAt:       response.DateTime(p.JoinedAt),
	}

	if p.LeftAt != nil {
		leftAt := response.DateTime(*p.LeftAt)
		resp.LeftAt = &leftAt
	}

	return resp
}

type GetRequest struct {
	ID      string
	Type    string
	ClassID *string
}

type GetByIDRequest struct {
	ID string
}

func (r GetByIDRequest) toInput() conversation.GetOneInput {
	return conversation.GetOneInput{
		Filter: conversation.Filter{
			ID: r.ID,
		},
	}
}

func (r GetRequest) toInput(pagin paginator.PaginatorQuery) conversation.GetInput {
	pagin.Adjust()

	filter := conversation.Filter{
		ID:        r.ID,
		NotLeftAt: true, // Only active conversations
	}

	if r.Type != "" {
		filter.Type = models.ConversationType(r.Type)
	}

	if r.ClassID != nil && *r.ClassID != "" {
		filter.ClassID = r.ClassID
	}

	return conversation.GetInput{
		Filter: filter,
		Pagin:  pagin,
	}
}

type GetResponse struct {
	Conversations []detailResp                `json:"conversations"`
	Pagin         paginator.PaginatorResponse `json:"pagin"`
}

func (h handler) newGetResponse(d []models.Conversation, pagin paginator.Paginator) GetResponse {
	var resp GetResponse
	for _, v := range d {
		resp.Conversations = append(resp.Conversations, h.newDetailResp(v))
	}
	return GetResponse{
		Pagin:         pagin.ToResponse(),
		Conversations: resp.Conversations,
	}
}

type GetByIDResponse struct {
	Conversation detailResp `json:"conversation"`
}

func (h handler) newGetByIDResponse(d models.Conversation) GetByIDResponse {
	return GetByIDResponse{
		Conversation: h.newDetailResp(d),
	}
}

type GetParticipantsResponse struct {
	Participants []participantResp `json:"participants"`
}

func (h handler) newGetParticipantsResponse(participants []models.ConversationParticipant) GetParticipantsResponse {
	var resp GetParticipantsResponse
	for _, p := range participants {
		resp.Participants = append(resp.Participants, h.newParticipantResp(p))
	}
	return resp
}

type MarkAsReadResponse struct {
	Message string `json:"message"`
}

func (h handler) newMarkAsReadResponse() MarkAsReadResponse {
	return MarkAsReadResponse{
		Message: "Marked as read",
	}
}
