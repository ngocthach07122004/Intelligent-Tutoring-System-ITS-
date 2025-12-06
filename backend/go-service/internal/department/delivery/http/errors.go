package http

import (
	"init-src/internal/department/usecase"
	pkgErrors "init-src/pkg/errors"
)

var (
	errWrongBody       = pkgErrors.NewHTTPError(10000, "Wrong body")
	errNotFound        = pkgErrors.NewNotFoundHTTPError("Department not found")
	errForbidden       = pkgErrors.NewForbiddenHTTPError()
	errUnauthorized    = pkgErrors.NewUnauthorizedHTTPError()
	errInvalidObjectID = pkgErrors.NewHTTPError(400, "Invalid object ID")
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
	}

	return err
}
