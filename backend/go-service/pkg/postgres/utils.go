package postgres

import (
	"context"
	"fmt"
	"strings"
)

// BuildInsertQuery builds an INSERT query with RETURNING clause
// Example: BuildInsertQuery("users", []string{"name", "email"}, "id", "created_at")
// Returns: "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, created_at"
func BuildInsertQuery(table string, columns []string, returning ...string) string {
	placeholders := make([]string, len(columns))
	for i := range columns {
		placeholders[i] = fmt.Sprintf("$%d", i+1)
	}

	query := fmt.Sprintf(
		"INSERT INTO %s (%s) VALUES (%s)",
		table,
		strings.Join(columns, ", "),
		strings.Join(placeholders, ", "),
	)

	if len(returning) > 0 {
		query += fmt.Sprintf(" RETURNING %s", strings.Join(returning, ", "))
	}

	return query
}

// BuildUpdateQuery builds an UPDATE query with WHERE clause
// Example: BuildUpdateQuery("users", []string{"name", "email"}, "id")
// Returns: "UPDATE users SET name = $1, email = $2 WHERE id = $3"
func BuildUpdateQuery(table string, columns []string, whereColumn string) string {
	setClauses := make([]string, len(columns))
	for i, col := range columns {
		setClauses[i] = fmt.Sprintf("%s = $%d", col, i+1)
	}

	query := fmt.Sprintf(
		"UPDATE %s SET %s WHERE %s = $%d",
		table,
		strings.Join(setClauses, ", "),
		whereColumn,
		len(columns)+1,
	)

	return query
}

// BuildSelectQuery builds a SELECT query with WHERE clause
// Example: BuildSelectQuery("users", []string{"id", "name", "email"}, "id")
// Returns: "SELECT id, name, email FROM users WHERE id = $1"
func BuildSelectQuery(table string, columns []string, whereColumn string) string {
	query := fmt.Sprintf(
		"SELECT %s FROM %s",
		strings.Join(columns, ", "),
		table,
	)

	if whereColumn != "" {
		query += fmt.Sprintf(" WHERE %s = $1", whereColumn)
	}

	return query
}

// BuildDeleteQuery builds a DELETE query with WHERE clause
// Example: BuildDeleteQuery("users", "id")
// Returns: "DELETE FROM users WHERE id = $1"
func BuildDeleteQuery(table string, whereColumn string) string {
	return fmt.Sprintf("DELETE FROM %s WHERE %s = $1", table, whereColumn)
}

// BuildPaginationQuery adds LIMIT and OFFSET to a query
// Example: BuildPaginationQuery("SELECT * FROM users", 10, 20)
// Returns: "SELECT * FROM users LIMIT 10 OFFSET 20"
func BuildPaginationQuery(baseQuery string, limit, offset int) string {
	return fmt.Sprintf("%s LIMIT %d OFFSET %d", baseQuery, limit, offset)
}

// WithTransaction executes a function within a database transaction
// If the function returns an error, the transaction is rolled back
// Otherwise, the transaction is committed
func WithTransaction(ctx context.Context, db Database, fn func(tx Tx) error) error {
	tx, err := db.BeginTx(ctx)
	if err != nil {
		return fmt.Errorf("begin transaction: %w", err)
	}

	defer func() {
		if p := recover(); p != nil {
			_ = tx.Rollback(ctx)
			panic(p)
		}
	}()

	if err := fn(tx); err != nil {
		if rbErr := tx.Rollback(ctx); rbErr != nil {
			return fmt.Errorf("rollback transaction: %v (original error: %w)", rbErr, err)
		}
		return err
	}

	if err := tx.Commit(ctx); err != nil {
		return fmt.Errorf("commit transaction: %w", err)
	}

	return nil
}

// BuildInClause builds an IN clause for a query
// Example: BuildInClause("id", 3, 1)
// Returns: "id IN ($1, $2, $3)" and startIndex = 1
func BuildInClause(column string, count int, startIndex int) string {
	if count == 0 {
		return ""
	}

	placeholders := make([]string, count)
	for i := 0; i < count; i++ {
		placeholders[i] = fmt.Sprintf("$%d", startIndex+i)
	}

	return fmt.Sprintf("%s IN (%s)", column, strings.Join(placeholders, ", "))
}
