package http

import (
	"init-src/internal/branch/usecase"
	pkgErrors "init-src/pkg/errors"
)

var (
	errWrongBody       = pkgErrors.NewHTTPError(10000, "Wrong body")
	errNotFound        = pkgErrors.NewNotFoundHTTPError("Branch not found")
	errForbidden       = pkgErrors.NewForbiddenHTTPError()
	errUnauthorized    = pkgErrors.NewUnauthorizedHTTPError()
	errInvalidObjectID = pkgErrors.NewHTTPError(400, "Invalid object ID")
	errBranchHasDept   = pkgErrors.NewHTTPError(400, "Branch has department")
	errWrongQuery      = pkgErrors.NewHTTPError(400, "Wrong query")
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
	case usecase.ErrBranchHasDept:
		return errBranchHasDept
	}

	return err
}
