package postgres

import (
	"context"
	"fmt"
	"time"

	"init-src/internal/models"
	"init-src/internal/notification"
	"init-src/pkg/paginator"
	"init-src/pkg/postgres"

	"github.com/google/uuid"
	"golang.org/x/sync/errgroup"
)

// Create creates a new notification
func (repo *implRepository) Create(ctx context.Context, tx postgres.Tx, opts notification.CreateOptions) (models.Notification, error) {
	query := `
		INSERT INTO notifications (
			id, user_id, type, title, body, entity_type, entity_id, data, created_at
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		RETURNING id, user_id, type, title, body, entity_type, entity_id, data, read_at, created_at, deleted_at
	`

	notif := models.Notification{
		ID:        uuid.New(),
		UserID:    opts.UserID,
		Type:      opts.Type,
		Title:     opts.Title,
		Body:      opts.Body,
		CreatedAt: time.Now(),
	}

	err := tx.QueryRow(ctx, query,
		notif.ID,
		notif.UserID,
		notif.Type,
		notif.Title,
		notif.Body,
		opts.EntityType,
		opts.EntityID,
		opts.Data,
		notif.CreatedAt,
	).Scan(
		&notif.ID,
		&notif.UserID,
		&notif.Type,
		&notif.Title,
		&notif.Body,
		&notif.EntityType,
		&notif.EntityID,
		&notif.Data,
		&notif.ReadAt,
		&notif.CreatedAt,
		&notif.DeletedAt,
	)

	if err != nil {
		repo.l.Errorf(ctx, "notification.postgres.Create.QueryRow", err)
		return models.Notification{}, err
	}

	return notif, nil
}

// List lists notifications without pagination
func (repo *implRepository) List(ctx context.Context, sc models.Scope, input notification.ListInput) ([]models.Notification, error) {
	whereClause, args, err := repo.buildGetFilter(input.Filter)
	if err != nil {
		repo.l.Errorf(ctx, "notification.postgres.List.buildGetFilter", err)
		return nil, err
	}

	query := fmt.Sprintf(`
		SELECT id, user_id, type, title, body, entity_type, entity_id, data, read_at, created_at, deleted_at
		FROM notifications
		WHERE %s
		ORDER BY created_at DESC
		LIMIT 100
	`, whereClause)

	rows, err := repo.db.Query(ctx, query, args...)
	if err != nil {
		repo.l.Errorf(ctx, "notification.postgres.List.Query", err)
		return nil, err
	}
	defer rows.Close()

	var notifications []models.Notification
	for rows.Next() {
		var notif models.Notification
		if err := rows.Scan(
			&notif.ID,
			&notif.UserID,
			&notif.Type,
			&notif.Title,
			&notif.Body,
			&notif.EntityType,
			&notif.EntityID,
			&notif.Data,
			&notif.ReadAt,
			&notif.CreatedAt,
			&notif.DeletedAt,
		); err != nil {
			repo.l.Errorf(ctx, "notification.postgres.List.Scan", err)
			return nil, err
		}
		notifications = append(notifications, notif)
	}

	if err := rows.Err(); err != nil {
		repo.l.Errorf(ctx, "notification.postgres.List.Rows", err)
		return nil, err
	}

	return notifications, nil
}

// Get gets notifications with pagination
func (repo *implRepository) Get(ctx context.Context, sc models.Scope, input notification.GetInput) ([]models.Notification, paginator.Paginator, error) {
	whereClause, args, err := repo.buildGetFilter(input.Filter)
	if err != nil {
		repo.l.Errorf(ctx, "notification.postgres.Get.buildGetFilter", err)
		return nil, paginator.Paginator{}, err
	}

	var (
		notifications []models.Notification
		total         int64
	)

	g, gctx := errgroup.WithContext(ctx)

	// Count total
	g.Go(func() error {
		countQuery := fmt.Sprintf("SELECT COUNT(*) FROM notifications WHERE %s", whereClause)
		if err := repo.db.QueryRow(gctx, countQuery, args...).Scan(&total); err != nil {
			repo.l.Warnf(ctx, "notification.postgres.Get.Count: %v", err)
			return err
		}
		return nil
	})

	// Fetch paginated results
	g.Go(func() error {
		offset := int64((input.Pagin.Page - 1)) * input.Pagin.Limit
		query := fmt.Sprintf(`
			SELECT id, user_id, type, title, body, entity_type, entity_id, data, read_at, created_at, deleted_at
			FROM notifications
			WHERE %s
			ORDER BY created_at DESC
			LIMIT $%d OFFSET $%d
		`, whereClause, len(args)+1, len(args)+2)

		args = append(args, input.Pagin.Limit, offset)

		rows, err := repo.db.Query(gctx, query, args...)
		if err != nil {
			repo.l.Errorf(ctx, "notification.postgres.Get.Query", err)
			return err
		}
		defer rows.Close()

		for rows.Next() {
			var notif models.Notification
			if err := rows.Scan(
				&notif.ID,
				&notif.UserID,
				&notif.Type,
				&notif.Title,
				&notif.Body,
				&notif.EntityType,
				&notif.EntityID,
				&notif.Data,
				&notif.ReadAt,
				&notif.CreatedAt,
				&notif.DeletedAt,
			); err != nil {
				repo.l.Errorf(ctx, "notification.postgres.Get.Scan", err)
				return err
			}
			notifications = append(notifications, notif)
		}

		return rows.Err()
	})

	if err := g.Wait(); err != nil {
		return nil, paginator.Paginator{}, err
	}

	pag := paginator.Paginator{
		Total:       total,
		Count:       int64(len(notifications)),
		PerPage:     input.Pagin.Limit,
		CurrentPage: input.Pagin.Page,
	}

	return notifications, pag, nil
}

// GetOne gets a single notification
func (repo *implRepository) GetOne(ctx context.Context, sc models.Scope, input notification.GetOneInput) (models.Notification, error) {
	whereClause, args, err := repo.buildGetFilter(input.Filter)
	if err != nil {
		repo.l.Errorf(ctx, "notification.postgres.GetOne.buildGetFilter", err)
		return models.Notification{}, err
	}

	query := fmt.Sprintf(`
		SELECT id, user_id, type, title, body, entity_type, entity_id, data, read_at, created_at, deleted_at
		FROM notifications
		WHERE %s
		LIMIT 1
	`, whereClause)

	var notif models.Notification
	err = repo.db.QueryRow(ctx, query, args...).Scan(
		&notif.ID,
		&notif.UserID,
		&notif.Type,
		&notif.Title,
		&notif.Body,
		&notif.EntityType,
		&notif.EntityID,
		&notif.Data,
		&notif.ReadAt,
		&notif.CreatedAt,
		&notif.DeletedAt,
	)

	if err != nil {
		repo.l.Errorf(ctx, "notification.postgres.GetOne.QueryRow", err)
		return models.Notification{}, err
	}

	return notif, nil
}

// Delete soft deletes a notification
func (repo *implRepository) Delete(ctx context.Context, tx postgres.Tx, id string) (string, error) {
	query := `
		UPDATE notifications
		SET deleted_at = $1
		WHERE id = $2 AND deleted_at IS NULL
	`

	result, err := tx.Exec(ctx, query, time.Now(), id)
	if err != nil {
		repo.l.Errorf(ctx, "notification.postgres.Delete.Exec", err)
		return "", err
	}

	if result.RowsAffected() == 0 {
		return "", fmt.Errorf("notification not found")
	}

	return id, nil
}

// MarkAsRead marks a notification as read
func (repo *implRepository) MarkAsRead(ctx context.Context, tx postgres.Tx, id string, userID string) error {
	query := `
		UPDATE notifications
		SET read_at = $1
		WHERE id = $2 AND user_id = $3 AND read_at IS NULL AND deleted_at IS NULL
	`

	result, err := tx.Exec(ctx, query, time.Now(), id, userID)
	if err != nil {
		repo.l.Errorf(ctx, "notification.postgres.MarkAsRead.Exec", err)
		return err
	}

	if result.RowsAffected() == 0 {
		return fmt.Errorf("notification not found or already read")
	}

	return nil
}

// MarkAllAsRead marks all unread notifications as read for a user
func (repo *implRepository) MarkAllAsRead(ctx context.Context, tx postgres.Tx, userID string) error {
	query := `
		UPDATE notifications
		SET read_at = $1
		WHERE user_id = $2 AND read_at IS NULL AND deleted_at IS NULL
	`

	_, err := tx.Exec(ctx, query, time.Now(), userID)
	if err != nil {
		repo.l.Errorf(ctx, "notification.postgres.MarkAllAsRead.Exec", err)
		return err
	}

	return nil
}

// CountUnread counts unread notifications for a user
func (repo *implRepository) CountUnread(ctx context.Context, userID string) (int64, error) {
	query := `
		SELECT COUNT(*)
		FROM notifications
		WHERE user_id = $1 AND read_at IS NULL AND deleted_at IS NULL
	`

	var count int64
	err := repo.db.QueryRow(ctx, query, userID).Scan(&count)
	if err != nil {
		repo.l.Errorf(ctx, "notification.postgres.CountUnread.QueryRow", err)
		return 0, err
	}

	return count, nil
}
