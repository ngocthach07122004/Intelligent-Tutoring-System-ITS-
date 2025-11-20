package http

import (
	"init-src/internal/user/usecase"
	pkgErrors "init-src/pkg/errors"
)

var (
	// Authentication errors - 401
	errUnauthorized  = pkgErrors.NewUnauthorizedHTTPError()
	errWrongPassword = pkgErrors.NewHTTPError(401, "Invalid credentials")

	// Authorization errors - 403
	errForbidden = pkgErrors.NewForbiddenHTTPError()

	// Not found errors - 404
	errUserNotFound  = pkgErrors.NewNotFoundHTTPError("User not found")
	errEmailNotFound = pkgErrors.NewNotFoundHTTPError("Email not found")

	// Validation errors - 400
	errMissingData = pkgErrors.NewHTTPError(400, "Missing required data")
	errDataFetch   = pkgErrors.NewHTTPError(400, "Failed to fetch data")
	errWrongBody   = pkgErrors.NewHTTPError(400, "Invalid request body")
	errWrongQuery  = pkgErrors.NewHTTPError(400, "Invalid request query")

	// Conflict errors - 409
	errEmailTaken = pkgErrors.NewHTTPError(409, "Email already taken")

	// Internal errors - 500
	// errInternal = pkgErrors.NewHTTPError(500, "Internal server error")
	errEncrypt = pkgErrors.NewHTTPError(500, "Encrypt error")
	errDecrypt = pkgErrors.NewHTTPError(500, "Decrypt error")
)

func (h handler) mapError(err error) error {
	switch err {
	// Authentication errors
	case usecase.ErrUnauthorized:
		return errUnauthorized
	case usecase.ErrPasswordIncorrect:
		return errWrongPassword

	// Authorization errors
	case usecase.ErrForbidden:
		return errForbidden

	// Not found errors
	case usecase.ErrUserNotFound:
		return errUserNotFound
	case usecase.ErrEmailNotFound:
		return errEmailNotFound

	case usecase.ErrMissingData:
		return errMissingData
	case usecase.ErrDataFetch:
		return errDataFetch

	// Conflict errors
	case usecase.ErrEmailTaken:
		return errEmailTaken

	// Internal errors
	case usecase.ErrEncryptPassword:
		return errEncrypt
	case usecase.ErrDecryptPassword:
		return errDecrypt
	default:
		return err
	}
}
