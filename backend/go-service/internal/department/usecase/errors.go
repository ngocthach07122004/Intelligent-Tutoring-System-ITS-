package usecase

import "errors"

var (
	ErrNotFound        = errors.New("department not found")
	ErrUnauthorized    = errors.New("unauthorized")
	ErrForbidden       = errors.New("forbidden")
	ErrInvalidObjectID = errors.New("invalid object ID")
)
