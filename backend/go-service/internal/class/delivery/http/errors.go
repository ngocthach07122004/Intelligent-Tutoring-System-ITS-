package http

import (
	"init-src/internal/class/usecase"
	pkgErrors "init-src/pkg/errors"
)

var (
	errWrongBody       = pkgErrors.NewHTTPError(10000, "Wrong body")
	errNotFound        = pkgErrors.NewNotFoundHTTPError("Class not found")
	errForbidden       = pkgErrors.NewForbiddenHTTPError()
	errUnauthorized    = pkgErrors.NewUnauthorizedHTTPError()
	errInvalidObjectID = pkgErrors.NewHTTPError(400, "Invalid object ID")
	errWrongQuery      = pkgErrors.NewHTTPError(400, "Wrong query")
	errNotTeacher      = pkgErrors.NewHTTPError(403, "Only teachers can perform this action")
	errMemberExists    = pkgErrors.NewHTTPError(400, "User is already a member of this class")
	errMemberNotFound  = pkgErrors.NewNotFoundHTTPError("Member not found")
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
	case usecase.ErrNotTeacher:
		return errNotTeacher
	case usecase.ErrMemberExists:
		return errMemberExists
	case usecase.ErrMemberNotFound:
		return errMemberNotFound
	}

	return err
}
