package usecase

import "errors"

var (
	ErrNotFound        = errors.New("branch not found")
	ErrUnauthorized    = errors.New("unauthorized")
	ErrForbidden       = errors.New("forbidden")
	ErrInvalidObjectID = errors.New("invalid object ID")
	ErrBranchHasDept   = errors.New("branch has department")
)
