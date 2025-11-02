package http

import (
	"strings"

	"init-src/internal/models"
	"init-src/internal/shop"
	"init-src/pkg/paginator"
	"init-src/pkg/response"
)

// createReq represents the request body for creating a shop
type createReq struct {
	// Name of the shop
	Name string `json:"name" binding:"required" `
}

// updateReq represents the request body for updating a shop
type updateReq struct {
	// Name of the shop
	Name string `json:"name" binding:"required" `
}

type GetRequest struct {
	ID    string
	Alias string
	Code  string
}

type GetOneRequest struct {
	ID string
}

func (r GetRequest) toInput(pagin paginator.PaginatorQuery) shop.GetInput {
	pagin.Adjust()

	return shop.GetInput{
		Filter: shop.Filter{
			ID:    r.ID,
			Alias: r.Alias,
			Code:  r.Code,
		},
		Pagin: pagin,
	}
}

func (r GetOneRequest) toInput() shop.GetOneInput {
	return shop.GetOneInput{
		Filter: shop.Filter{
			ID: r.ID,
		},
	}
}

func (r updateReq) validate() error {
	if strings.TrimSpace(r.Name) == "" {
		return errWrongBody
	}
	return nil
}

func (r createReq) validate() error {
	if strings.TrimSpace(r.Name) == "" {
		return errWrongBody
	}
	return nil
}

func (r createReq) toInput() shop.CreateInput {
	return shop.CreateInput{
		Name: r.Name,
	}
}

func (r updateReq) toInput() shop.UpdateInput {
	return shop.UpdateInput{
		Name: r.Name,
	}
}

// detailResp represents a single shop in responses
type detailResp struct {
	// Unique identifier of the shop
	ID string `json:"id"`
	// Name of the shop
	Name string `json:"name"`
	// URL-friendly version of the shop name
	Alias string `json:"alias"`
	// Short code for the shop
	Code string `json:"code"`
	// Creation timestamp
	CreatedAt response.DateTime `json:"created_at"`
	// Last updated timestamp
	UpdatedAt response.DateTime `json:"updated_at"`
}

// deleteResp represents the response for deleting a shop
type deleteResp struct {
	// Success/failure message
	Message string `json:"message"`
}

func (h handler) newDetailResp(d models.Shop) detailResp {
	return detailResp{
		ID:        d.ID.Hex(),
		Name:      d.Name,
		Alias:     d.Alias,
		Code:      d.Code,
		CreatedAt: response.DateTime(d.CreatedAt),
		UpdatedAt: response.DateTime(d.UpdatedAt),
	}
}

func (h handler) newDeleteResp(res string) deleteResp {
	return deleteResp{
		Message: res,
	}
}

type GetShopsResponse struct {
	Shops []detailResp                `json:"shops"`
	Pagin paginator.PaginatorResponse `json:"pagin"`
}

func (h handler) newGetShopsResponse(d []models.Shop, pagin paginator.Paginator) GetShopsResponse {
	var resp GetShopsResponse
	for _, v := range d {
		resp.Shops = append(resp.Shops, h.newDetailResp(v))
	}
	return GetShopsResponse{
		Shops: resp.Shops,
		Pagin: pagin.ToResponse(),
	}
}

type GetShopResponse struct {
	Shop detailResp `json:"shop"`
}

func (h handler) newGetShopResponse(d models.Shop) GetShopResponse {
	return GetShopResponse{
		Shop: h.newDetailResp(d),
	}
}
