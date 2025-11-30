package usecase

import (
	"context"
	"init-src/internal/forum"
	"init-src/internal/models"
)

func (uc *implUsecase) CreateComment(ctx context.Context, input forum.CreateCommentInput) (forum.CommentResponse, error) {
	tx, err := uc.db.BeginTx(ctx)
	if err != nil {
		return forum.CommentResponse{}, err
	}
	defer tx.Rollback(ctx)

	post, err := uc.repo.GetPost(ctx, input.PostID)
	if err != nil {
		return forum.CommentResponse{}, err
	}

	comment := models.Comment{
		PostID:   post.ID,
		Content:  input.Content,
		AuthorID: input.UserID,
	}

	createdComment, err := uc.repo.CreateComment(ctx, tx, comment)
	if err != nil {
		return forum.CommentResponse{}, err
	}

	// Update post UpdatedAt
	// Re-save post to update timestamp
	_, err = uc.repo.UpdatePost(ctx, tx, post)
	if err != nil {
		return forum.CommentResponse{}, err
	}

	if err := tx.Commit(ctx); err != nil {
		return forum.CommentResponse{}, err
	}

	// Fetch author details
	author, _ := uc.userRepo.GetUser(ctx, input.UserID)

	return forum.CommentResponse{
		ID:           createdComment.ID,
		PostID:       createdComment.PostID,
		Content:      createdComment.Content,
		AuthorID:     createdComment.AuthorID,
		AuthorName:   author.Name,
		AuthorAvatar: author.Avatar,
		IsAccepted:   createdComment.IsAccepted,
		VoteScore:    createdComment.Upvotes - createdComment.Downvotes,
		CreatedAt:    createdComment.CreatedAt,
	}, nil
}
