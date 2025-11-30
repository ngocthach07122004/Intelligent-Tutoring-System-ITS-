package postgres

import (
	"context"
	"fmt"
	"time"

	"init-src/internal/models"
	"init-src/pkg/postgres"

	"github.com/google/uuid"
)

func (repo *implRepository) CreateComment(ctx context.Context, tx postgres.Tx, comment models.Comment) (models.Comment, error) {
	query := `
		INSERT INTO comments (post_id, content, author_id, is_accepted, upvotes, downvotes, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id, post_id, content, author_id, is_accepted, upvotes, downvotes, created_at, updated_at, deleted_at
	`

	now := time.Now()
	err := tx.QueryRow(ctx, query,
		comment.PostID,
		comment.Content,
		comment.AuthorID,
		comment.IsAccepted,
		0, 0,
		now, now,
	).Scan(
		&comment.ID,
		&comment.PostID,
		&comment.Content,
		&comment.AuthorID,
		&comment.IsAccepted,
		&comment.Upvotes,
		&comment.Downvotes,
		&comment.CreatedAt,
		&comment.UpdatedAt,
		&comment.DeletedAt,
	)

	if err != nil {
		repo.l.Errorf(ctx, "forum.postgres.CreateComment.QueryRow", err)
		return models.Comment{}, err
	}

	return comment, nil
}

func (repo *implRepository) GetComment(ctx context.Context, id string) (models.Comment, error) {
	commentID, err := uuid.Parse(id)
	if err != nil {
		return models.Comment{}, fmt.Errorf("invalid comment ID: %w", err)
	}

	query := `
		SELECT id, post_id, content, author_id, is_accepted, upvotes, downvotes, created_at, updated_at, deleted_at
		FROM comments
		WHERE id = $1 AND deleted_at IS NULL
	`

	var comment models.Comment
	err = repo.db.QueryRow(ctx, query, commentID).Scan(
		&comment.ID,
		&comment.PostID,
		&comment.Content,
		&comment.AuthorID,
		&comment.IsAccepted,
		&comment.Upvotes,
		&comment.Downvotes,
		&comment.CreatedAt,
		&comment.UpdatedAt,
		&comment.DeletedAt,
	)

	if err != nil {
		repo.l.Errorf(ctx, "forum.postgres.GetComment.QueryRow", err)
		return models.Comment{}, err
	}

	return comment, nil
}

func (repo *implRepository) ListComments(ctx context.Context, postID string) ([]models.Comment, error) {
	pID, err := uuid.Parse(postID)
	if err != nil {
		return nil, fmt.Errorf("invalid post ID: %w", err)
	}

	query := `
		SELECT id, post_id, content, author_id, is_accepted, upvotes, downvotes, created_at, updated_at, deleted_at
		FROM comments
		WHERE post_id = $1 AND deleted_at IS NULL
		ORDER BY is_accepted DESC, (upvotes - downvotes) DESC, created_at ASC
	`

	rows, err := repo.db.Query(ctx, query, pID)
	if err != nil {
		repo.l.Errorf(ctx, "forum.postgres.ListComments.Query", err)
		return nil, err
	}
	defer rows.Close()

	var comments []models.Comment
	for rows.Next() {
		var comment models.Comment
		err := rows.Scan(
			&comment.ID,
			&comment.PostID,
			&comment.Content,
			&comment.AuthorID,
			&comment.IsAccepted,
			&comment.Upvotes,
			&comment.Downvotes,
			&comment.CreatedAt,
			&comment.UpdatedAt,
			&comment.DeletedAt,
		)
		if err != nil {
			repo.l.Errorf(ctx, "forum.postgres.ListComments.Scan", err)
			return nil, err
		}
		comments = append(comments, comment)
	}

	return comments, nil
}

func (repo *implRepository) UpdateComment(ctx context.Context, tx postgres.Tx, comment models.Comment) (models.Comment, error) {
	query := `
		UPDATE comments
		SET content = $1, is_accepted = $2, upvotes = $3, downvotes = $4, updated_at = $5
		WHERE id = $6 AND deleted_at IS NULL
		RETURNING id, post_id, content, author_id, is_accepted, upvotes, downvotes, created_at, updated_at, deleted_at
	`

	comment.UpdatedAt = time.Now()
	err := tx.QueryRow(ctx, query,
		comment.Content, comment.IsAccepted, comment.Upvotes, comment.Downvotes, comment.UpdatedAt, comment.ID,
	).Scan(
		&comment.ID, &comment.PostID, &comment.Content, &comment.AuthorID, &comment.IsAccepted, &comment.Upvotes, &comment.Downvotes, &comment.CreatedAt, &comment.UpdatedAt, &comment.DeletedAt,
	)

	if err != nil {
		repo.l.Errorf(ctx, "forum.postgres.UpdateComment.QueryRow", err)
		return models.Comment{}, err
	}

	return comment, nil
}

func (repo *implRepository) DeleteComment(ctx context.Context, tx postgres.Tx, id string) error {
	commentID, err := uuid.Parse(id)
	if err != nil {
		return err
	}
	query := `UPDATE comments SET deleted_at = NOW() WHERE id = $1`
	_, err = tx.Exec(ctx, query, commentID)
	return err
}

func (repo *implRepository) GetCommentCount(ctx context.Context, postID string) (int, error) {
	pID, err := uuid.Parse(postID)
	if err != nil {
		return 0, err
	}

	query := `SELECT COUNT(*) FROM comments WHERE post_id = $1 AND deleted_at IS NULL`
	var count int
	err = repo.db.QueryRow(ctx, query, pID).Scan(&count)
	return count, err
}
