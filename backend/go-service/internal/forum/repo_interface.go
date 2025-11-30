package forum

import (
	"context"

	"init-src/internal/models"
	"init-src/pkg/paginator"
	"init-src/pkg/postgres"
)

// Repository is the interface for forum repository
//
//go:generate mockery --name=Repository
type Repository interface {
	// Post operations
	CreatePost(ctx context.Context, tx postgres.Tx, post models.Post) (models.Post, error)
	GetPost(ctx context.Context, id string) (models.Post, error)
	ListPosts(ctx context.Context, input ListPostsInput) ([]models.Post, paginator.Paginator, error)
	UpdatePost(ctx context.Context, tx postgres.Tx, post models.Post) (models.Post, error)
	DeletePost(ctx context.Context, tx postgres.Tx, id string) error
	IncrementPostViews(ctx context.Context, id string) error

	// Comment operations
	CreateComment(ctx context.Context, tx postgres.Tx, comment models.Comment) (models.Comment, error)
	GetComment(ctx context.Context, id string) (models.Comment, error)
	ListComments(ctx context.Context, postID string) ([]models.Comment, error)
	UpdateComment(ctx context.Context, tx postgres.Tx, comment models.Comment) (models.Comment, error)
	DeleteComment(ctx context.Context, tx postgres.Tx, id string) error
	GetCommentCount(ctx context.Context, postID string) (int, error)

	// Vote operations
	UpsertVote(ctx context.Context, tx postgres.Tx, vote models.Vote) error
	DeleteVote(ctx context.Context, tx postgres.Tx, userID string, targetID string, targetType string) error
	GetVote(ctx context.Context, userID string, targetID string, targetType string) (models.Vote, error)
}
