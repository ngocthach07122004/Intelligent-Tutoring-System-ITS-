package usecase

import "errors"

var (
	ErrNotFound        = errors.New("shop not found")
	ErrUnauthorized    = errors.New("unauthorized")
	ErrForbidden       = errors.New("forbidden")
	ErrShopHasRegion   = errors.New("shop has region")
	ErrInvalidObjectID = errors.New("invalid object ID")
)
