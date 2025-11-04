package usecase

import (
	"context"
	"strings"

	"init-src/internal/models"
	"init-src/internal/notification"
)

// List lists notifications without pagination
func (uc *implUsecase) List(ctx context.Context, sc models.Scope, input notification.ListInput) ([]models.Notification, error) {
	// Ensure user can only see their own notifications
	input.Filter.UserID = sc.UserID

	notifications, err := uc.repo.List(ctx, sc, input)
	if err != nil {
		uc.l.Warnf(ctx, "notification.Usecase.List error: %v", err)
		return nil, err
	}

	return notifications, nil
}

// Get gets notifications with pagination
func (uc *implUsecase) Get(ctx context.Context, sc models.Scope, input notification.GetInput) (notification.GetOutput, error) {
	// Ensure user can only see their own notifications
	input.Filter.UserID = sc.UserID

	notifications, pag, err := uc.repo.Get(ctx, sc, input)
	if err != nil {
		uc.l.Warnf(ctx, "notification.Usecase.Get error: %v", err)
		return notification.GetOutput{}, err
	}

	return notification.GetOutput{
		Notifications: notifications,
		Pagin:         pag,
	}, nil
}

// GetOne gets a single notification
func (uc *implUsecase) GetOne(ctx context.Context, sc models.Scope, input notification.GetOneInput) (notification.GetOneOutput, error) {
	// Ensure user can only see their own notifications
	input.Filter.UserID = sc.UserID

	notif, err := uc.repo.GetOne(ctx, sc, input)
	if err != nil {
		uc.l.Warnf(ctx, "notification.Usecase.GetOne error: %v", err)
		if strings.Contains(err.Error(), "no rows") {
			return notification.GetOneOutput{}, ErrNotFound
		}
		return notification.GetOneOutput{}, err
	}

	return notification.GetOneOutput{
		Notification: notif,
	}, nil
}

// CountUnread counts unread notifications for a user
func (uc *implUsecase) CountUnread(ctx context.Context, sc models.Scope) (int64, error) {
	count, err := uc.repo.CountUnread(ctx, sc.UserID)
	if err != nil {
		uc.l.Warnf(ctx, "notification.Usecase.CountUnread error: %v", err)
		return 0, err
	}

	return count, nil
}

// MarkAsRead marks a notification as read
func (uc *implUsecase) MarkAsRead(ctx context.Context, sc models.Scope, id string) error {
	// Begin transaction
	tx, err := uc.db.BeginTx(ctx)
	if err != nil {
		uc.l.Errorf(ctx, "notification.Usecase.MarkAsRead.BeginTx", err)
		return err
	}
	defer tx.Rollback(ctx)

	// Verify notification belongs to user
	notif, err := uc.repo.GetOne(ctx, sc, notification.GetOneInput{
		Filter: notification.Filter{
			ID:     id,
			UserID: sc.UserID,
		},
	})
	if err != nil {
		uc.l.Warnf(ctx, "notification.Usecase.MarkAsRead.GetOne: %v", err)
		if strings.Contains(err.Error(), "no rows") {
			return ErrNotFound
		}
		return err
	}

	// Check if already read
	if notif.ReadAt != nil {
		// Already read, just return success
		return nil
	}

	// Mark as read
	if err := uc.repo.MarkAsRead(ctx, tx, id, sc.UserID); err != nil {
		uc.l.Warnf(ctx, "notification.Usecase.MarkAsRead.MarkAsRead: %v", err)
		return err
	}

	// Commit transaction
	if err := tx.Commit(ctx); err != nil {
		uc.l.Errorf(ctx, "notification.Usecase.MarkAsRead.Commit", err)
		return err
	}

	return nil
}

// MarkAllAsRead marks all unread notifications as read
func (uc *implUsecase) MarkAllAsRead(ctx context.Context, sc models.Scope) error {
	// Begin transaction
	tx, err := uc.db.BeginTx(ctx)
	if err != nil {
		uc.l.Errorf(ctx, "notification.Usecase.MarkAllAsRead.BeginTx", err)
		return err
	}
	defer tx.Rollback(ctx)

	// Mark all as read
	if err := uc.repo.MarkAllAsRead(ctx, tx, sc.UserID); err != nil {
		uc.l.Warnf(ctx, "notification.Usecase.MarkAllAsRead.MarkAllAsRead: %v", err)
		return err
	}

	// Commit transaction
	if err := tx.Commit(ctx); err != nil {
		uc.l.Errorf(ctx, "notification.Usecase.MarkAllAsRead.Commit", err)
		return err
	}

	return nil
}

// Delete soft deletes a notification
func (uc *implUsecase) Delete(ctx context.Context, sc models.Scope, id string) (string, error) {
	// Begin transaction
	tx, err := uc.db.BeginTx(ctx)
	if err != nil {
		uc.l.Errorf(ctx, "notification.Usecase.Delete.BeginTx", err)
		return "", err
	}
	defer tx.Rollback(ctx)

	// Verify notification belongs to user
	_, err = uc.repo.GetOne(ctx, sc, notification.GetOneInput{
		Filter: notification.Filter{
			ID:     id,
			UserID: sc.UserID,
		},
	})
	if err != nil {
		uc.l.Warnf(ctx, "notification.Usecase.Delete.GetOne: %v", err)
		if strings.Contains(err.Error(), "no rows") {
			return "", ErrNotFound
		}
		return "", err
	}

	// Delete notification
	deletedID, err := uc.repo.Delete(ctx, tx, id)
	if err != nil {
		uc.l.Warnf(ctx, "notification.Usecase.Delete.Delete: %v", err)
		return "", err
	}

	// Commit transaction
	if err := tx.Commit(ctx); err != nil {
		uc.l.Errorf(ctx, "notification.Usecase.Delete.Commit", err)
		return "", err
	}

	return deletedID, nil
}

// Create creates a notification (used by workers)
func (uc *implUsecase) Create(ctx context.Context, input notification.CreateInput) (models.Notification, error) {
	// Begin transaction
	tx, err := uc.db.BeginTx(ctx)
	if err != nil {
		uc.l.Errorf(ctx, "notification.Usecase.Create.BeginTx", err)
		return models.Notification{}, err
	}
	defer tx.Rollback(ctx)

	// Create notification
	notif, err := uc.repo.Create(ctx, tx, notification.CreateOptions{
		UserID:     input.UserID,
		Type:       input.Type,
		Title:      input.Title,
		Body:       input.Body,
		EntityType: input.EntityType,
		EntityID:   input.EntityID,
		Data:       input.Data,
	})
	if err != nil {
		uc.l.Errorf(ctx, "notification.Usecase.Create.Create", err)
		return models.Notification{}, err
	}

	// Commit transaction
	if err := tx.Commit(ctx); err != nil {
		uc.l.Errorf(ctx, "notification.Usecase.Create.Commit", err)
		return models.Notification{}, err
	}

	return notif, nil
}
