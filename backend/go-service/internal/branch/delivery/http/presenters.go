package http

import (
	"strings"

	"init-src/internal/branch"
	"init-src/internal/models"
	"init-src/pkg/paginator"
	"init-src/pkg/response"
)

// createReq represents the request body for creating a branch
type createReq struct {
	// Name of the branch
	Name string `json:"name" binding:"required" `
	// ID of the region this branch belongs to
	RegionID string `json:"region_id" binding:"required" `
	// ID of the shop this branch belongs to
	ShopID string `json:"shop_id" binding:"required" `
}

// updateReq represents the request body for updating a branch
type updateReq struct {
	// Name of the branch
	Name string `json:"name" binding:"required" `
	// ID of the region this branch belongs to
	RegionID string `json:"region_id" `
	// ID of the shop this branch belongs to
	ShopID string `json:"shop_id" `
}

func (r createReq) validate() error {
	if strings.TrimSpace(r.Name) == "" {
		return errWrongBody
	}
	if r.RegionID == "" {
		return errWrongBody
	}
	if r.ShopID == "" {
		return errWrongBody
	}
	return nil
}

func (r updateReq) validate() error {
	if strings.TrimSpace(r.Name) == "" {
		return errWrongBody
	}
	// if r.RegionID == "" && r.ShopID == "" {
	// 	return errWrongBody
	// }
	return nil
}

func (r createReq) toInput() branch.CreateInput {
	return branch.CreateInput{
		Name:     r.Name,
		RegionID: r.RegionID,
		ShopID:   r.ShopID,
	}
}

func (r updateReq) toInput() branch.UpdateInput {
	return branch.UpdateInput{
		Name:     r.Name,
		RegionID: r.RegionID,
	}
}

// detailResp represents a single branch in responses
type detailResp struct {
	// Unique identifier of the branch
	ID string `json:"id" `
	// URL-friendly version of the branch name
	Alias string `json:"alias" `
	// Short code for the branch
	Code string `json:"code" `
	// ID of the shop this branch belongs to
	ShopID string `json:"shop_id" `
	// ID of the region this branch belongs to
	RegionID string `json:"region_id" `
	// Creation timestamp
	CreatedAt response.DateTime `json:"created_at" `
}

// deleteResp represents the response for deleting a branch
type deleteResp struct {
	// Success/failure message
	Message string `json:"message" `
}

func (h handler) newDeleteResp(d string) deleteResp {
	return deleteResp{
		Message: d,
	}
}

func (h handler) newDetailResp(d models.Branch) detailResp {
	return detailResp{
		ID:        d.ID.Hex(),
		Alias:     d.Alias,
		Code:      d.Code,
		ShopID:    d.ShopID.Hex(),
		RegionID:  d.RegionID.Hex(),
		CreatedAt: response.DateTime(d.CreatedAt),
	}
}

type GetRequest struct {
	ID       string
	Name     string
	Code     string
	Alias    string
	ShopID   string
	RegionID string
}

type GetByIDRequest struct {
	ID string
}

func (r GetByIDRequest) toInput() branch.GetOneInput {
	return branch.GetOneInput{
		Filter: branch.Filter{
			ID: r.ID,
		},
	}
}

func (r GetRequest) toInput(pagin paginator.PaginatorQuery) branch.GetInput {
	pagin.Adjust()
	return branch.GetInput{
		Filter: branch.Filter{
			ID:       r.ID,
			Name:     r.Name,
			Code:     r.Code,
			Alias:    r.Alias,
			ShopID:   r.ShopID,
			RegionID: r.RegionID,
		},
		Pagin: pagin,
	}
}

type GetResponse struct {
	Branches []detailResp                `json:"branches"`
	Pagin    paginator.PaginatorResponse `json:"pagin"`
}

func (h handler) newGetResponse(d []models.Branch, pagin paginator.Paginator) GetResponse {
	var resp GetResponse
	for _, v := range d {
		resp.Branches = append(resp.Branches, h.newDetailResp(v))
	}
	return GetResponse{
		Pagin:    pagin.ToResponse(),
		Branches: resp.Branches,
	}
}

type newGetByIDResponse struct {
	Branch detailResp `json:"branch"`
}

func (h handler) newGetByIDResponse(d models.Branch) newGetByIDResponse {
	return newGetByIDResponse{
		Branch: h.newDetailResp(d),
	}
}
