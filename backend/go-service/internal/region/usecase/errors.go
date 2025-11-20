package usecase

import (
	"errors"
)

var (
	ErrNotFound        = errors.New("region not found")
	ErrUnauthorized    = errors.New("unauthorized")
	ErrForbidden       = errors.New("forbidden")
	ErrInvalidObjectID = errors.New("invalid object ID")
	ErrShopNotFound    = errors.New("shop not found")
	ErrRegionHasBranch = errors.New("region has branch")
)
