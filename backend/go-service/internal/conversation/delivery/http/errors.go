package http

import (
	"init-src/internal/conversation/usecase"
	pkgErrors "init-src/pkg/errors"
)

var (
	errWrongBody         = pkgErrors.NewHTTPError(10000, "Wrong body")
	errNotFound          = pkgErrors.NewNotFoundHTTPError("Conversation not found")
	errForbidden         = pkgErrors.NewForbiddenHTTPError()
	errUnauthorized      = pkgErrors.NewUnauthorizedHTTPError()
	errInvalidObjectID   = pkgErrors.NewHTTPError(400, "Invalid object ID")
	errWrongQuery        = pkgErrors.NewHTTPError(400, "Wrong query")
	errNotParticipant    = pkgErrors.NewHTTPError(403, "You are not a participant of this conversation")
	errInvalidInput      = pkgErrors.NewHTTPError(400, "Invalid input")
	errDirectChatExists  = pkgErrors.NewHTTPError(400, "Direct conversation already exists with this user")
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
	case usecase.ErrNotParticipant:
		return errNotParticipant
	case usecase.ErrInvalidInput:
		return errInvalidInput
	case usecase.ErrDirectChatExists:
		return errDirectChatExists
	}

	return err
}
