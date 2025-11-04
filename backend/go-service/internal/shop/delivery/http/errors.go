package http

import (
	"init-src/internal/shop/usecase"
	pkgErrors "init-src/pkg/errors"
)

var (
	errWrongBody       = pkgErrors.NewHTTPError(10000, "Wrong body")
	errWrongQuery      = pkgErrors.NewHTTPError(400, "Wrong query")
	errShopNotFound    = pkgErrors.NewNotFoundHTTPError("Shop not found")
	errForbidden       = pkgErrors.NewForbiddenHTTPError()
	errUnauthorized    = pkgErrors.NewUnauthorizedHTTPError()
	errShopHasRegion   = pkgErrors.NewHTTPError(400, "Shop has region")
	errInvalidObjectID = pkgErrors.NewHTTPError(400, "Invalid object ID")
)

func (h handler) mapError(err error) error {
	switch err {
	case usecase.ErrNotFound:
		return errShopNotFound
	case usecase.ErrForbidden:
		return errForbidden
	case usecase.ErrShopHasRegion:
		return errShopHasRegion
	case usecase.ErrInvalidObjectID:
		return errInvalidObjectID
	case usecase.ErrUnauthorized:
		return errUnauthorized
	default:
		return err
	}
}
