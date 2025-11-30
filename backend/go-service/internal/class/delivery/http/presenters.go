package http

import (
	"strings"

	"init-src/internal/class"
	"init-src/internal/models"
	"init-src/pkg/paginator"
	"init-src/pkg/response"
)

// createReq represents the request body for creating a class
type createReq struct {
	// Name of the class
	Name string `json:"name" binding:"required"`
	// Description of the class
	Description string `json:"description"`
}

// updateReq represents the request body for updating a class
type updateReq struct {
	// Name of the class
	Name string `json:"name" binding:"required"`
	// Description of the class
	Description string `json:"description"`
	// Archived status
	Archived bool `json:"archived"`
}

// addMemberReq represents the request body for adding a member to a class
type addMemberReq struct {
	// User ID to add (MongoDB ObjectID)
	UserID string `json:"user_id" binding:"required"`
	// Role of the member
	Role models.ClassMemberRole `json:"role" binding:"required"`
}

// joinByCodeReq represents the request body for joining a class by code
type joinByCodeReq struct {
	// Class code
	Code string `json:"code" binding:"required"`
}

func (r createReq) validate() error {
	if strings.TrimSpace(r.Name) == "" {
		return errWrongBody
	}
	return nil
}

func (r updateReq) validate() error {
	if strings.TrimSpace(r.Name) == "" {
		return errWrongBody
	}
	return nil
}

func (r addMemberReq) validate() error {
	if strings.TrimSpace(r.UserID) == "" {
		return errWrongBody
	}
	// Validate role
	validRoles := map[models.ClassMemberRole]bool{
		models.RoleTeacher:  true,
		models.RoleStudent:  true,
		models.RoleTA:       true,
		models.RoleObserver: true,
	}
	if !validRoles[r.Role] {
		return errWrongBody
	}
	return nil
}

func (r joinByCodeReq) validate() error {
	if strings.TrimSpace(r.Code) == "" {
		return errWrongBody
	}
	return nil
}

func (r createReq) toInput() class.CreateInput {
	return class.CreateInput{
		Name:        r.Name,
		Description: r.Description,
	}
}

func (r updateReq) toInput() class.UpdateInput {
	return class.UpdateInput{
		Name:        r.Name,
		Description: r.Description,
		Archived:    r.Archived,
	}
}

func (r addMemberReq) toInput() class.AddMemberInput {
	return class.AddMemberInput{
		UserID: r.UserID,
		Role:   r.Role,
	}
}

// detailResp represents a single class in responses
type detailResp struct {
	// Unique identifier of the class
	ID string `json:"id"`
	// Name of the class
	Name string `json:"name"`
	// Description of the class
	Description string `json:"description"`
	// Unique code for joining the class
	Code string `json:"code"`
	// Avatar URL
	AvatarURL string `json:"avatar_url"`
	// ID of the user who created the class
	CreatedBy string `json:"created_by"`
	// Whether the class is archived
	Archived bool `json:"archived"`
	// Creation timestamp
	CreatedAt response.DateTime `json:"created_at"`
	// Last update timestamp
	UpdatedAt response.DateTime `json:"updated_at"`
}

// memberResp represents a single class member in responses
type memberResp struct {
	// Unique identifier of the membership
	ID string `json:"id"`
	// Class ID
	ClassID string `json:"class_id"`
	// User ID (MongoDB ObjectID)
	UserID string `json:"user_id"`
	// Role of the member
	Role models.ClassMemberRole `json:"role"`
	// When the member joined
	JoinedAt response.DateTime `json:"joined_at"`
}

// deleteResp represents the response for deleting a class
type deleteResp struct {
	// Success/failure message
	Message string `json:"message"`
}

func (h handler) newDeleteResp(d string) deleteResp {
	return deleteResp{
		Message: d,
	}
}

func (h handler) newDetailResp(d models.Class) detailResp {
	return detailResp{
		ID:          d.ID.String(),
		Name:        d.Name,
		Description: d.Description,
		Code:        d.Code,
		AvatarURL:   d.AvatarURL,
		CreatedBy:   d.CreatedBy,
		Archived:    d.Archived,
		CreatedAt:   response.DateTime(d.CreatedAt),
		UpdatedAt:   response.DateTime(d.UpdatedAt),
	}
}

func (h handler) newMemberResp(m models.ClassMember) memberResp {
	return memberResp{
		ID:       m.ID.String(),
		ClassID:  m.ClassID.String(),
		UserID:   m.UserID,
		Role:     m.Role,
		JoinedAt: response.DateTime(m.JoinedAt),
	}
}

type GetRequest struct {
	ID       string
	Name     string
	Code     string
	Archived *bool
}

type GetByIDRequest struct {
	ID string
}

func (r GetByIDRequest) toInput() class.GetOneInput {
	return class.GetOneInput{
		Filter: class.Filter{
			ID: r.ID,
		},
	}
}

func (r GetRequest) toInput(pagin paginator.PaginatorQuery) class.GetInput {
	pagin.Adjust()
	return class.GetInput{
		Filter: class.Filter{
			ID:       r.ID,
			Name:     r.Name,
			Code:     r.Code,
			Archived: r.Archived,
		},
		Pagin: pagin,
	}
}

type GetResponse struct {
	Classes []detailResp                `json:"classes"`
	Pagin   paginator.PaginatorResponse `json:"pagin"`
}

func (h handler) newGetResponse(d []models.Class, pagin paginator.Paginator) GetResponse {
	var resp GetResponse
	for _, v := range d {
		resp.Classes = append(resp.Classes, h.newDetailResp(v))
	}
	return GetResponse{
		Pagin:   pagin.ToResponse(),
		Classes: resp.Classes,
	}
}

type GetByIDResponse struct {
	Class detailResp `json:"class"`
}

func (h handler) newGetByIDResponse(d models.Class) GetByIDResponse {
	return GetByIDResponse{
		Class: h.newDetailResp(d),
	}
}

type ListMembersResponse struct {
	Members []memberResp `json:"members"`
}

func (h handler) newListMembersResponse(members []models.ClassMember) ListMembersResponse {
	var resp ListMembersResponse
	for _, m := range members {
		resp.Members = append(resp.Members, h.newMemberResp(m))
	}
	return resp
}
