package postgres

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
)

// Connect connects to PostgreSQL using pgx pool.
func Connect(ctx context.Context, opts ConnectionOptions) (Database, error) {
	config, err := pgxpool.ParseConfig(opts.DSN)
	if err != nil {
		return nil, err
	}

	// Apply connection pool settings
	if opts.MaxConns > 0 {
		config.MaxConns = opts.MaxConns
	}
	if opts.MinConns > 0 {
		config.MinConns = opts.MinConns
	}
	if opts.MaxConnLifetime > 0 {
		config.MaxConnLifetime = opts.MaxConnLifetime
	}
	if opts.MaxConnIdleTime > 0 {
		config.MaxConnIdleTime = opts.MaxConnIdleTime
	}

	pool, err := pgxpool.NewWithConfig(ctx, config)
	if err != nil {
		return nil, err
	}

	return &postgresDatabase{pool: pool}, nil
}

//go:generate mockery --name=Database --output=mocks --case=underscore
type Database interface {
	QueryRow(ctx context.Context, query string, args ...interface{}) Row
	Query(ctx context.Context, query string, args ...interface{}) (Rows, error)
	Exec(ctx context.Context, query string, args ...interface{}) (CommandTag, error)
	BeginTx(ctx context.Context) (Tx, error)
	Close()
	Ping(ctx context.Context) error
	Pool() *pgxpool.Pool
}

//go:generate mockery --name=Tx --output=mocks --case=underscore
type Tx interface {
	QueryRow(ctx context.Context, query string, args ...interface{}) Row
	Query(ctx context.Context, query string, args ...interface{}) (Rows, error)
	Exec(ctx context.Context, query string, args ...interface{}) (CommandTag, error)
	Commit(ctx context.Context) error
	Rollback(ctx context.Context) error
}

//go:generate mockery --name=Row --output=mocks --case=underscore
type Row interface {
	Scan(dest ...interface{}) error
}

//go:generate mockery --name=Rows --output=mocks --case=underscore
type Rows interface {
	Close()
	Err() error
	Next() bool
	Scan(dest ...interface{}) error
}

//go:generate mockery --name=CommandTag --output=mocks --case=underscore
type CommandTag interface {
	RowsAffected() int64
}

// Implementation structs
type postgresDatabase struct {
	pool *pgxpool.Pool
}

type postgresTx struct {
	tx pgx.Tx
}

type postgresRow struct {
	row pgx.Row
}

type postgresRows struct {
	rows pgx.Rows
}

type postgresCommandTag struct {
	tag pgconn.CommandTag
}

// Database implementation
func (db *postgresDatabase) QueryRow(ctx context.Context, query string, args ...interface{}) Row {
	return &postgresRow{row: db.pool.QueryRow(ctx, query, args...)}
}

func (db *postgresDatabase) Query(ctx context.Context, query string, args ...interface{}) (Rows, error) {
	rows, err := db.pool.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	return &postgresRows{rows: rows}, nil
}

func (db *postgresDatabase) Exec(ctx context.Context, query string, args ...interface{}) (CommandTag, error) {
	tag, err := db.pool.Exec(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	return &postgresCommandTag{tag: tag}, nil
}

func (db *postgresDatabase) BeginTx(ctx context.Context) (Tx, error) {
	tx, err := db.pool.Begin(ctx)
	if err != nil {
		return nil, err
	}
	return &postgresTx{tx: tx}, nil
}

func (db *postgresDatabase) Close() {
	db.pool.Close()
}

func (db *postgresDatabase) Ping(ctx context.Context) error {
	return db.pool.Ping(ctx)
}

func (db *postgresDatabase) Pool() *pgxpool.Pool {
	return db.pool
}

// Tx implementation
func (tx *postgresTx) QueryRow(ctx context.Context, query string, args ...interface{}) Row {
	return &postgresRow{row: tx.tx.QueryRow(ctx, query, args...)}
}

func (tx *postgresTx) Query(ctx context.Context, query string, args ...interface{}) (Rows, error) {
	rows, err := tx.tx.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	return &postgresRows{rows: rows}, nil
}

func (tx *postgresTx) Exec(ctx context.Context, query string, args ...interface{}) (CommandTag, error) {
	tag, err := tx.tx.Exec(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	return &postgresCommandTag{tag: tag}, nil
}

func (tx *postgresTx) Commit(ctx context.Context) error {
	return tx.tx.Commit(ctx)
}

func (tx *postgresTx) Rollback(ctx context.Context) error {
	return tx.tx.Rollback(ctx)
}

// Row implementation
func (r *postgresRow) Scan(dest ...interface{}) error {
	return r.row.Scan(dest...)
}

// Rows implementation
func (r *postgresRows) Close() {
	r.rows.Close()
}

func (r *postgresRows) Err() error {
	return r.rows.Err()
}

func (r *postgresRows) Next() bool {
	return r.rows.Next()
}

func (r *postgresRows) Scan(dest ...interface{}) error {
	return r.rows.Scan(dest...)
}

// CommandTag implementation
func (ct *postgresCommandTag) RowsAffected() int64 {
	return ct.tag.RowsAffected()
}

// Helper function to create context with timeout
func WithTimeout(ctx context.Context, timeout time.Duration) (context.Context, context.CancelFunc) {
	return context.WithTimeout(ctx, timeout)
}
