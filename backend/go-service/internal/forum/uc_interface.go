package forum

import (
	"context"
)

// Usecase is the interface for forum usecase
//
//go:generate mockery --name=Usecase
type Usecase interface {
	// Post operations
	CreatePost(ctx context.Context, input CreatePostInput) (PostResponse, error)
	GetPost(ctx context.Context, id string) (PostDetailResponse, error)
	ListPosts(ctx context.Context, input ListPostsInput) (ListPostsOutput, error)

	// Comment operations
	CreateComment(ctx context.Context, input CreateCommentInput) (CommentResponse, error)

	// Vote operations
	Vote(ctx context.Context, input VoteInput) error
}
