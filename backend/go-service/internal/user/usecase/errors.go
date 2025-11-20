package usecase

import (
	"errors"

	"init-src/pkg/mongo"
)

var (
	// Authentication errors
	ErrEmailTaken        = errors.New("email already taken")
	ErrPasswordIncorrect = errors.New("password is incorrect")
	ErrEmailNotFound     = errors.New("email not found")

	// Authorization errors
	ErrUnauthorized = errors.New("unauthorized")
	ErrForbidden    = errors.New("forbidden")

	ErrMissingData     = errors.New("missing required data")
	ErrDataFetch       = errors.New("failed to fetch data")
	ErrEncryptPassword = errors.New("failed to generate password")
	ErrDecryptPassword = errors.New("failed to decrypt password")
	ErrJWT             = errors.New("failed to generate JWT")

	// Reuse repository errors
	ErrUserNotFound = mongo.ErrNoDocuments
)
