package usecase

import "errors"

var (
	ErrNotFound          = errors.New("conversation not found")
	ErrUnauthorized      = errors.New("unauthorized")
	ErrForbidden         = errors.New("forbidden")
	ErrInvalidObjectID   = errors.New("invalid object ID")
	ErrNotParticipant    = errors.New("you are not a participant of this conversation")
	ErrInvalidInput      = errors.New("invalid input")
	ErrDirectChatExists  = errors.New("direct conversation already exists with this user")
	ErrCannotLeave       = errors.New("cannot leave conversation")
)
