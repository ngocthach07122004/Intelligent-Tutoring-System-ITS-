package http

import (
	"init-src/internal/message/usecase"
	pkgErrors "init-src/pkg/errors"
)

var (
	errWrongBody                = pkgErrors.NewHTTPError(10000, "Wrong body")
	errNotFound                 = pkgErrors.NewNotFoundHTTPError("Message not found")
	errForbidden                = pkgErrors.NewForbiddenHTTPError()
	errUnauthorized             = pkgErrors.NewUnauthorizedHTTPError()
	errInvalidObjectID          = pkgErrors.NewHTTPError(400, "Invalid object ID")
	errWrongQuery               = pkgErrors.NewHTTPError(400, "Wrong query")
	errNotParticipant           = pkgErrors.NewHTTPError(403, "You are not a participant of this conversation")
	errNotSender                = pkgErrors.NewHTTPError(403, "You can only edit/delete your own messages")
	errConversationNotFound     = pkgErrors.NewNotFoundHTTPError("Conversation not found")
	errCannotEditSystemMessage  = pkgErrors.NewHTTPError(400, "Cannot edit system messages")
	errMessageNotInConversation = pkgErrors.NewNotFoundHTTPError("Message does not belong to this conversation")
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
	case usecase.ErrNotSender:
		return errNotSender
	case usecase.ErrConversationNotFound:
		return errConversationNotFound
	case usecase.ErrCannotEditSystemMessage:
		return errCannotEditSystemMessage
	case usecase.ErrMessageNotInConversation:
		return errMessageNotInConversation
	}

	return err
}
