package usecase

import "errors"

var (
	ErrNotFound                = errors.New("message not found")
	ErrUnauthorized            = errors.New("unauthorized")
	ErrForbidden               = errors.New("forbidden")
	ErrInvalidObjectID         = errors.New("invalid object ID")
	ErrNotParticipant          = errors.New("you are not a participant of this conversation")
	ErrNotSender               = errors.New("you can only edit/delete your own messages")
	ErrConversationNotFound    = errors.New("conversation not found")
	ErrCannotEditSystemMessage = errors.New("cannot edit system messages")
	ErrMessageNotInConversation = errors.New("message does not belong to this conversation")
)
