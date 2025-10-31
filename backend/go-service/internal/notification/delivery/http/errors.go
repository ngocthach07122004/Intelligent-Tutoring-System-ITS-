package http

import (
	"init-src/internal/notification/usecase"
	pkgErrors "init-src/pkg/errors"
)

var (
	errWrongBody    = pkgErrors.NewHTTPError(10000, "Wrong body")
	errNotFound     = pkgErrors.NewNotFoundHTTPError("Notification not found")
	errForbidden    = pkgErrors.NewForbiddenHTTPError()
	errUnauthorized = pkgErrors.NewUnauthorizedHTTPError()
	errWrongQuery   = pkgErrors.NewHTTPError(400, "Wrong query")
)

func (h handler) mapError(err error) error {
	switch err {
	case usecase.ErrNotFound:
		return errNotFound
	case usecase.ErrForbidden:
		return errForbidden
	case usecase.ErrUnauthorized:
		return errUnauthorized
	}

	return err
}
