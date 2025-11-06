package postgres

import "time"

// ConnectionOptions holds the configuration for PostgreSQL connection.
type ConnectionOptions struct {
	DSN             string
	MaxConns        int32
	MinConns        int32
	MaxConnLifetime time.Duration
	MaxConnIdleTime time.Duration
}

// NewConnectionOptions creates a new ConnectionOptions instance.
func NewConnectionOptions() ConnectionOptions {
	return ConnectionOptions{
		MaxConns:        10,
		MinConns:        2,
		MaxConnLifetime: time.Hour,
		MaxConnIdleTime: 30 * time.Minute,
	}
}

// SetDSN sets the Data Source Name for the PostgreSQL connection.
// Example: "postgres://username:password@localhost:5432/database_name?sslmode=disable"
func (co ConnectionOptions) SetDSN(dsn string) ConnectionOptions {
	co.DSN = dsn
	return co
}

// SetMaxConns sets the maximum number of connections in the pool.
// Default is 10.
func (co ConnectionOptions) SetMaxConns(maxConns int32) ConnectionOptions {
	co.MaxConns = maxConns
	return co
}

// SetMinConns sets the minimum number of connections in the pool.
// Default is 2.
func (co ConnectionOptions) SetMinConns(minConns int32) ConnectionOptions {
	co.MinConns = minConns
	return co
}

// SetMaxConnLifetime sets the maximum amount of time a connection may be reused.
// Default is 1 hour.
func (co ConnectionOptions) SetMaxConnLifetime(d time.Duration) ConnectionOptions {
	co.MaxConnLifetime = d
	return co
}

// SetMaxConnIdleTime sets the maximum amount of time a connection may be idle.
// Default is 30 minutes.
func (co ConnectionOptions) SetMaxConnIdleTime(d time.Duration) ConnectionOptions {
	co.MaxConnIdleTime = d
	return co
}
