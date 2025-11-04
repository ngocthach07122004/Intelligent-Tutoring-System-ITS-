package postgres

import (
	"context"
	"time"

	"init-src/internal/models"
	"init-src/internal/outbox"
	"init-src/pkg/postgres"
)

func (repo *implRepository) Create(ctx context.Context, tx postgres.Tx, opts outbox.CreateOptions) (models.OutboxEvent, error) {
	query := `
		INSERT INTO outbox (aggregate_type, aggregate_id, event_type, payload, status, created_at)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, aggregate_type, aggregate_id, event_type, payload, status, attempts, last_error, created_at, processed_at
	`

	now := time.Now()
	var event models.OutboxEvent

	err := tx.QueryRow(ctx, query,
		opts.AggregateType,
		opts.AggregateID,
		opts.EventType,
		opts.Payload,
		models.EventStatusPending,
		now,
	).Scan(
		&event.ID,
		&event.AggregateType,
		&event.AggregateID,
		&event.EventType,
		&event.Payload,
		&event.Status,
		&event.Attempts,
		&event.LastError,
		&event.CreatedAt,
		&event.ProcessedAt,
	)

	if err != nil {
		repo.l.Errorf(ctx, "outbox.postgres.Create", err)
		return models.OutboxEvent{}, err
	}

	return event, nil
}

func (repo *implRepository) FetchPending(ctx context.Context, limit int) ([]models.OutboxEvent, error) {
	query := `
		SELECT id, aggregate_type, aggregate_id, event_type, payload, status, attempts, last_error, created_at, processed_at
		FROM outbox
		WHERE status = $1
		ORDER BY created_at ASC
		LIMIT $2
	`

	rows, err := repo.db.Query(ctx, query, models.EventStatusPending, limit)
	if err != nil {
		repo.l.Errorf(ctx, "outbox.postgres.FetchPending", err)
		return nil, err
	}
	defer rows.Close()

	var events []models.OutboxEvent
	for rows.Next() {
		var event models.OutboxEvent
		err := rows.Scan(
			&event.ID,
			&event.AggregateType,
			&event.AggregateID,
			&event.EventType,
			&event.Payload,
			&event.Status,
			&event.Attempts,
			&event.LastError,
			&event.CreatedAt,
			&event.ProcessedAt,
		)
		if err != nil {
			repo.l.Errorf(ctx, "outbox.postgres.FetchPending.Scan", err)
			return nil, err
		}
		events = append(events, event)
	}

	if err := rows.Err(); err != nil {
		repo.l.Errorf(ctx, "outbox.postgres.FetchPending.Err", err)
		return nil, err
	}

	return events, nil
}

func (repo *implRepository) MarkProcessing(ctx context.Context, id int64) error {
	query := `
		UPDATE outbox
		SET status = $1, attempts = attempts + 1
		WHERE id = $2
	`

	_, err := repo.db.Exec(ctx, query, models.EventStatusProcessing, id)
	if err != nil {
		repo.l.Errorf(ctx, "outbox.postgres.MarkProcessing", err)
		return err
	}

	return nil
}

func (repo *implRepository) MarkProcessed(ctx context.Context, id int64) error {
	query := `
		UPDATE outbox
		SET status = $1, processed_at = $2
		WHERE id = $3
	`

	now := time.Now()
	_, err := repo.db.Exec(ctx, query, models.EventStatusProcessed, now, id)
	if err != nil {
		repo.l.Errorf(ctx, "outbox.postgres.MarkProcessed", err)
		return err
	}

	return nil
}

func (repo *implRepository) MarkFailed(ctx context.Context, id int64, errorMsg string) error {
	query := `
		UPDATE outbox
		SET status = $1, last_error = $2
		WHERE id = $3
	`

	_, err := repo.db.Exec(ctx, query, models.EventStatusFailed, errorMsg, id)
	if err != nil {
		repo.l.Errorf(ctx, "outbox.postgres.MarkFailed", err)
		return err
	}

	return nil
}
