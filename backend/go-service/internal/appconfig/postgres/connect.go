package postgres

import (
	"context"
	"fmt"
	"log"
	"time"

	"init-src/config"
	"init-src/pkg/postgres"
)

// Connect establishes a connection to PostgreSQL database.
func Connect(ctx context.Context, pgConfig config.PostgresConfig) (postgres.Database, error) {
	opts := postgres.NewConnectionOptions().
		SetDSN(pgConfig.DSN).
		SetMaxConns(pgConfig.MaxConns).
		SetMinConns(pgConfig.MinConns).
		SetMaxConnLifetime(time.Duration(pgConfig.MaxConnLifetime) * time.Second).
		SetMaxConnIdleTime(time.Duration(pgConfig.MaxConnIdleTime) * time.Second)

	db, err := postgres.Connect(ctx, opts)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to PostgreSQL: %w", err)
	}

	// Test the connection
	if err := db.Ping(ctx); err != nil {
		return nil, fmt.Errorf("failed to ping PostgreSQL: %w", err)
	}

	log.Println("Connected to PostgreSQL!")

	return db, nil
}

// Disconnect closes the PostgreSQL connection.
func Disconnect(db postgres.Database) {
	if db == nil {
		return
	}

	db.Close()
	log.Println("Connection to PostgreSQL closed.")
}
