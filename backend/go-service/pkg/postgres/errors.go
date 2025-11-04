package postgres

import (
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
)

var (
	// ErrNoRows is returned when a query returns no rows
	ErrNoRows = pgx.ErrNoRows

	// ErrTxDone is returned when a transaction is already committed or rolled back
	// ErrTxDone = pgx.ErrTxDone

	// ErrTxClosed is returned when a transaction is closed
	ErrTxClosed = pgx.ErrTxClosed
)

// IsNoRows checks if the error is a "no rows" error
func IsNoRows(err error) bool {
	return errors.Is(err, pgx.ErrNoRows)
}

// IsUniqueViolation checks if the error is a unique constraint violation (23505)
func IsUniqueViolation(err error) bool {
	var pgErr *pgconn.PgError
	if errors.As(err, &pgErr) {
		return pgErr.Code == "23505"
	}
	return false
}

// IsForeignKeyViolation checks if the error is a foreign key constraint violation (23503)
func IsForeignKeyViolation(err error) bool {
	var pgErr *pgconn.PgError
	if errors.As(err, &pgErr) {
		return pgErr.Code == "23503"
	}
	return false
}

// IsCheckViolation checks if the error is a check constraint violation (23514)
func IsCheckViolation(err error) bool {
	var pgErr *pgconn.PgError
	if errors.As(err, &pgErr) {
		return pgErr.Code == "23514"
	}
	return false
}

// IsNotNullViolation checks if the error is a not null constraint violation (23502)
func IsNotNullViolation(err error) bool {
	var pgErr *pgconn.PgError
	if errors.As(err, &pgErr) {
		return pgErr.Code == "23502"
	}
	return false
}

// GetPgError extracts the PostgreSQL error from the error
func GetPgError(err error) (*pgconn.PgError, bool) {
	var pgErr *pgconn.PgError
	if errors.As(err, &pgErr) {
		return pgErr, true
	}
	return nil, false
}
