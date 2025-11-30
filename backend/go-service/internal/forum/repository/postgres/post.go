package postgres

import (
	"context"
	"fmt"
	"time"

	"init-src/internal/forum"
	"init-src/internal/models"
	"init-src/pkg/paginator"
	"init-src/pkg/postgres"

	"github.com/google/uuid"
)

func (repo *implRepository) CreatePost(ctx context.Context, tx postgres.Tx, post models.Post) (models.Post, error) {
	query := `
		INSERT INTO posts (title, content, author_id, tags, views, upvotes, downvotes, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		RETURNING id, title, content, author_id, tags, views, upvotes, downvotes, created_at, updated_at, deleted_at
	`

	now := time.Now()
	err := tx.QueryRow(ctx, query,
		post.Title,
		post.Content,
		post.AuthorID,
		post.Tags,
		0, 0, 0,
		now, now,
	).Scan(
		&post.ID,
		&post.Title,
		&post.Content,
		&post.AuthorID,
		&post.Tags,
		&post.Views,
		&post.Upvotes,
		&post.Downvotes,
		&post.CreatedAt,
		&post.UpdatedAt,
		&post.DeletedAt,
	)

	if err != nil {
		repo.l.Errorf(ctx, "forum.postgres.CreatePost.QueryRow", err)
		return models.Post{}, err
	}

	return post, nil
}

func (repo *implRepository) GetPost(ctx context.Context, id string) (models.Post, error) {
	postID, err := uuid.Parse(id)
	if err != nil {
		return models.Post{}, fmt.Errorf("invalid post ID: %w", err)
	}

	query := `
		SELECT id, title, content, author_id, tags, views, upvotes, downvotes, created_at, updated_at, deleted_at,
			EXISTS (SELECT 1 FROM comments c WHERE c.post_id = posts.id AND c.is_accepted = true) as is_answered
		FROM posts
		WHERE id = $1 AND deleted_at IS NULL
	`

	var post models.Post
	err = repo.db.QueryRow(ctx, query, postID).Scan(
		&post.ID,
		&post.Title,
		&post.Content,
		&post.AuthorID,
		&post.Tags,
		&post.Views,
		&post.Upvotes,
		&post.Downvotes,
		&post.CreatedAt,
		&post.UpdatedAt,
		&post.DeletedAt,
		&post.IsAnswered,
	)

	if err != nil {
		repo.l.Errorf(ctx, "forum.postgres.GetPost.QueryRow", err)
		return models.Post{}, err
	}

	return post, nil
}

func (repo *implRepository) ListPosts(ctx context.Context, input forum.ListPostsInput) ([]models.Post, paginator.Paginator, error) {
	args := []interface{}{}
	whereQuery := "WHERE deleted_at IS NULL"
	argIdx := 1

	if input.Tag != "" {
		whereQuery += fmt.Sprintf(" AND $%d = ANY(tags)", argIdx)
		args = append(args, input.Tag)
		argIdx++
	}

	if input.Filter == "unanswered" {
		whereQuery += " AND NOT EXISTS (SELECT 1 FROM comments c WHERE c.post_id = posts.id AND c.is_accepted = true)"
	} else if input.Filter == "hot" {
		whereQuery += " AND (upvotes - downvotes) >= 10"
	}

	orderBy := "created_at DESC"
	if input.SortBy == "oldest" {
		orderBy = "created_at ASC"
	} else if input.SortBy == "active" {
		orderBy = "updated_at DESC"
	} else if input.SortBy == "votes" {
		orderBy = "(upvotes - downvotes) DESC"
	} else if input.SortBy == "views" {
		orderBy = "views DESC"
	}

	countQuery := fmt.Sprintf("SELECT COUNT(*) FROM posts %s", whereQuery)
	var total int64
	err := repo.db.QueryRow(ctx, countQuery, args...).Scan(&total)
	if err != nil {
		repo.l.Errorf(ctx, "forum.postgres.ListPosts.CountQuery", err)
		return nil, paginator.Paginator{}, err
	}

	limit := input.Paginator.Limit
	offset := input.Paginator.Offset()

	query := fmt.Sprintf(`
		SELECT id, title, content, author_id, tags, views, upvotes, downvotes, created_at, updated_at, deleted_at,
			EXISTS (SELECT 1 FROM comments c WHERE c.post_id = posts.id AND c.is_accepted = true) as is_answered
		FROM posts
		%s
		ORDER BY %s
		LIMIT $%d OFFSET $%d
	`, whereQuery, orderBy, argIdx, argIdx+1)

	args = append(args, limit, offset)

	rows, err := repo.db.Query(ctx, query, args...)
	if err != nil {
		repo.l.Errorf(ctx, "forum.postgres.ListPosts.Query", err)
		return nil, paginator.Paginator{}, err
	}
	defer rows.Close()

	var posts []models.Post
	for rows.Next() {
		var post models.Post
		err := rows.Scan(
			&post.ID,
			&post.Title,
			&post.Content,
			&post.AuthorID,
			&post.Tags,
			&post.Views,
			&post.Upvotes,
			&post.Downvotes,
			&post.CreatedAt,
			&post.UpdatedAt,
			&post.DeletedAt,
			&post.IsAnswered,
		)
		if err != nil {
			repo.l.Errorf(ctx, "forum.postgres.ListPosts.Scan", err)
			return nil, paginator.Paginator{}, err
		}
		posts = append(posts, post)
	}

	pag := paginator.Paginator{
		Total:       total,
		Count:       int64(len(posts)),
		PerPage:     limit,
		CurrentPage: input.Paginator.Page,
	}

	return posts, pag, nil
}

func (repo *implRepository) UpdatePost(ctx context.Context, tx postgres.Tx, post models.Post) (models.Post, error) {
	query := `
		UPDATE posts
		SET title = $1, content = $2, tags = $3, views = $4, upvotes = $5, downvotes = $6, updated_at = $7
		WHERE id = $8 AND deleted_at IS NULL
		RETURNING id, title, content, author_id, tags, views, upvotes, downvotes, created_at, updated_at, deleted_at
	`

	post.UpdatedAt = time.Now()
	err := tx.QueryRow(ctx, query,
		post.Title, post.Content, post.Tags, post.Views, post.Upvotes, post.Downvotes, post.UpdatedAt, post.ID,
	).Scan(
		&post.ID, &post.Title, &post.Content, &post.AuthorID, &post.Tags, &post.Views, &post.Upvotes, &post.Downvotes, &post.CreatedAt, &post.UpdatedAt, &post.DeletedAt,
	)

	if err != nil {
		repo.l.Errorf(ctx, "forum.postgres.UpdatePost.QueryRow", err)
		return models.Post{}, err
	}

	return post, nil
}

func (repo *implRepository) DeletePost(ctx context.Context, tx postgres.Tx, id string) error {
	postID, err := uuid.Parse(id)
	if err != nil {
		return err
	}

	query := `UPDATE posts SET deleted_at = NOW() WHERE id = $1`
	_, err = tx.Exec(ctx, query, postID)
	return err
}

func (repo *implRepository) IncrementPostViews(ctx context.Context, id string) error {
	postID, err := uuid.Parse(id)
	if err != nil {
		return err
	}
	query := `UPDATE posts SET views = views + 1 WHERE id = $1`
	_, err = repo.db.Exec(ctx, query, postID)
	return err
}
