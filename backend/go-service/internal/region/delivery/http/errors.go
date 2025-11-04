package http

import (
	"init-src/internal/region/usecase"
	pkgErrors "init-src/pkg/errors"
)

var (
	errWrongBody       = pkgErrors.NewHTTPError(10000, "Wrong body")
	errWrongQuery      = pkgErrors.NewHTTPError(400, "Wrong query")
	errNotFound        = pkgErrors.NewNotFoundHTTPError("Region not found")
	errForbidden       = pkgErrors.NewForbiddenHTTPError()
	errUnauthorized    = pkgErrors.NewUnauthorizedHTTPError()
	errInvalidObjectID = pkgErrors.NewHTTPError(400, "Invalid object ID")
	errRegionHasBranch = pkgErrors.NewHTTPError(400, "Region has branch")
)

func (h handler) mapError(err error) error {
	switch err {
	case usecase.ErrNotFound:
		return errNotFound
	case usecase.ErrForbidden:
		return errForbidden
	case usecase.ErrUnauthorized:
		return errUnauthorized
	case usecase.ErrInvalidObjectID:
		return errInvalidObjectID
	case usecase.ErrRegionHasBranch:
		return errRegionHasBranch
	}

	return err
}
