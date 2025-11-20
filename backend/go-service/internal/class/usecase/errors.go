package usecase

import "errors"

var (
	ErrNotFound        = errors.New("class not found")
	ErrUnauthorized    = errors.New("unauthorized")
	ErrForbidden       = errors.New("forbidden")
	ErrInvalidObjectID = errors.New("invalid object ID")
	ErrDuplicateCode   = errors.New("class code already exists")
	ErrMemberExists    = errors.New("user is already a member of this class")
	ErrMemberNotFound  = errors.New("member not found")
	ErrNotTeacher      = errors.New("only teachers can perform this action")
)
