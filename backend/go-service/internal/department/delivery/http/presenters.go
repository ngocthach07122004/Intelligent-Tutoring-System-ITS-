package http

import (
	"strings"

	"init-src/internal/department"
	"init-src/internal/models"
	"init-src/pkg/paginator"
	"init-src/pkg/response"
)

// createReq represents the request body for creating a department
type createReq struct {
	// Name of the department
	Name string `json:"name" binding:"required" `
	// ID of the shop this department belongs to
	ShopID string `json:"shop_id" binding:"required" `
	// ID of the region this department belongs to
	RegionID string `json:"region_id" binding:"required" `
	// ID of the branch this department belongs to
	BranchID string `json:"branch_id" binding:"required" `
}

// updateReq represents the request body for updating a department
type updateReq struct {
	// Name of the department
	Name string `json:"name" binding:"required" `
	// ID of the shop this department belongs to
	ShopID string `json:"shop_id" binding:"required" `
	// ID of the region this department belongs to
	RegionID string `json:"region_id" binding:"required" `
	// ID of the branch this department belongs to
	BranchID string `json:"branch_id" binding:"required" `
}

func (r createReq) validate() error {
	if strings.TrimSpace(r.Name) == "" {
		return errWrongBody
	}
	if r.RegionID == "" && r.ShopID == "" && r.BranchID == "" {
		return errWrongBody
	}
	return nil
}

func (r updateReq) validate() error {
	if strings.TrimSpace(r.Name) == "" {
		return errWrongBody
	}
	if r.RegionID == "" && r.ShopID == "" && r.BranchID == "" {
		return errWrongBody
	}
	return nil
}

func (r createReq) toInput() department.CreateInput {
	return department.CreateInput{
		Name:     r.Name,
		RegionID: r.RegionID,
		ShopID:   r.ShopID,
		BranchID: r.BranchID,
	}
}

func (r updateReq) toInput() department.UpdateInput {
	return department.UpdateInput{
		Name:     r.Name,
		BranchID: r.BranchID,
	}
}

// detailResp represents a single department in responses
type detailResp struct {
	// Unique identifier of the department
	ID string `json:"id" `
	// URL-friendly version of the department name
	Alias string `json:"alias" `
	// Short code for the department
	Code string `json:"code" `
	// ID of the shop this department belongs to
	ShopID string `json:"shop_id" `
	// ID of the region this department belongs to
	RegionID string `json:"region_id" `
	// ID of the branch this department belongs to
	BranchID string `json:"branch_id" `
	// Creation timestamp
	CreatedAt response.DateTime `json:"created_at" `
}

// deleteResp represents the response for deleting a department
type deleteResp struct {
	// Success/failure message
	Message string `json:"message" example:"Deleted"`
}

func (h handler) newDeleteResp(d string) deleteResp {
	return deleteResp{
		Message: d,
	}
}

func (h handler) newDetailResp(d models.Department) detailResp {
	return detailResp{
		ID:        d.ID.Hex(),
		Alias:     d.Alias,
		Code:      d.Code,
		ShopID:    d.ShopID.Hex(),
		RegionID:  d.RegionID.Hex(),
		BranchID:  d.BranchID.Hex(),
		CreatedAt: response.DateTime(d.CreatedAt),
	}
}

type GetByIDRequest struct {
	ID string
}

type GetRequest struct {
	ID       string
	Name     string
	Code     string
	Alias    string
	RegionID string
	ShopID   string
	BranchID string
}

func (r GetByIDRequest) toInput() department.GetOneInput {
	return department.GetOneInput{
		Filter: department.Filter{
			ID: r.ID,
		},
	}
}

func (r GetRequest) toInput(pagin paginator.PaginatorQuery) department.GetInput {
	pagin.Adjust()
	return department.GetInput{
		Filter: department.Filter{
			ID:       r.ID,
			Name:     r.Name,
			Code:     r.Code,
			Alias:    r.Alias,
			RegionID: r.RegionID,
			ShopID:   r.ShopID,
			BranchID: r.BranchID,
		},
		Pagin: pagin,
	}
}

type GetResponse struct {
	Departments []detailResp                `json:"departments"`
	Pagin       paginator.PaginatorResponse `json:"pagin"`
}

func (h handler) newGetResponse(d []models.Department, pagin paginator.Paginator) GetResponse {
	var resp GetResponse
	for _, v := range d {
		resp.Departments = append(resp.Departments, h.newDetailResp(v))
	}
	return GetResponse{
		Pagin:       pagin.ToResponse(),
		Departments: resp.Departments,
	}
}

type GetByIDResponse struct {
	Department detailResp `json:"department"`
}

func (h handler) newGetByIDResponse(d models.Department) GetByIDResponse {
	return GetByIDResponse{
		Department: h.newDetailResp(d),
	}
}
