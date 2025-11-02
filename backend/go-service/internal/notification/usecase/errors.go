package usecase

import "errors"

var (
	ErrNotFound     = errors.New("notification not found")
	ErrUnauthorized = errors.New("unauthorized")
	ErrForbidden    = errors.New("forbidden")
)
