package http

import (
	"strings"

	"init-src/internal/models"
	"init-src/internal/region"
	"init-src/pkg/paginator"
	"init-src/pkg/response"
)

// createReq represents the request body for creating a region
type createReq struct {
	// Name of the region
	Name string `json:"name" binding:"required" `
	// ID of the shop this region belongs to
	ShopID string `json:"shop_id" binding:"required" `
}

// updateReq represents the request body for updating a region
type updateReq struct {
	// Name of the region
	Name string `json:"name" binding:"required"`
}

func (r createReq) validate() error {
	if strings.TrimSpace(r.Name) == "" {
		return errWrongBody
	}
	if strings.TrimSpace(r.ShopID) == "" {
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

func (r createReq) toInput() region.CreateInput {
	return region.CreateInput{
		Name:   r.Name,
		ShopID: r.ShopID,
	}
}

func (r updateReq) toInput() region.UpdateInput {
	return region.UpdateInput{
		Name: r.Name,
	}
}

// detailResp represents a single region in responses
type detailResp struct {
	// Unique identifier of the region
	ID string `json:"id"`
	// Name of the region
	Name string `json:"name"`
	// URL-friendly version of the region name
	Alias string `json:"alias" `
	// Short code for the region
	Code string `json:"code" `
	// ID of the shop this region belongs to
	ShopID string `json:"shop_id" `
	// Creation timestamp
	CreatedAt response.DateTime `json:"created_at"`
}

// deleteResp represents the response for deleting a region
type deleteResp struct {
	// Success/failure message
	Message string `json:"message"`
}

func (h handler) newDetailResp(d models.Region) detailResp {
	return detailResp{
		ID:        d.ID.Hex(),
		Name:      d.Name,
		Alias:     d.Alias,
		Code:      d.Code,
		ShopID:    d.ShopID.Hex(),
		CreatedAt: response.DateTime(d.CreatedAt),
	}
}

func (h handler) newDeleteResp(d string) deleteResp {
	return deleteResp{
		Message: d,
	}
}

type GetRequest struct {
	ID     string
	Name   string
	Code   string
	Alias  string
	ShopID string
}

type GetOneRequest struct {
	ID string
}

func (r GetRequest) toInput(pagin paginator.PaginatorQuery) region.GetInput {
	pagin.Adjust()

	return region.GetInput{
		Filter: region.Filter{
			ID:     r.ID,
			Name:   r.Name,
			Code:   r.Code,
			Alias:  r.Alias,
			ShopID: r.ShopID,
		},
		Pagin: pagin,
	}
}

func (r GetOneRequest) toInput() region.GetOneInput {
	return region.GetOneInput{
		Filter: region.Filter{
			ID: r.ID,
		},
	}
}

type GetRegionsResponse struct {
	Regions []detailResp                `json:"regions"`
	Pagin   paginator.PaginatorResponse `json:"pagin"`
}

func (h handler) newGetRegionsResponse(d []models.Region, pagin paginator.Paginator) GetRegionsResponse {
	var resp GetRegionsResponse
	for _, v := range d {
		resp.Regions = append(resp.Regions, h.newDetailResp(v))
	}
	return GetRegionsResponse{
		Pagin:   pagin.ToResponse(),
		Regions: resp.Regions,
	}
}

type GetRegionResponse struct {
	Region detailResp `json:"region"`
}

func (h handler) newGetRegionResponse(d models.Region) GetRegionResponse {
	return GetRegionResponse{
		Region: h.newDetailResp(d),
	}
}
