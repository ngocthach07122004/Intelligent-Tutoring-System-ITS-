package usecase

import (
	"context"
	"init-src/internal/forum"
	"init-src/internal/models"
)

func (uc *implUsecase) CreatePost(ctx context.Context, input forum.CreatePostInput) (forum.PostResponse, error) {
	tx, err := uc.db.BeginTx(ctx)
	if err != nil {
		return forum.PostResponse{}, err
	}
	defer tx.Rollback(ctx)

	post := models.Post{
		Title:    input.Title,
		Content:  input.Content,
		AuthorID: input.UserID,
		Tags:     input.Tags,
	}

	createdPost, err := uc.repo.CreatePost(ctx, tx, post)
	if err != nil {
		return forum.PostResponse{}, err
	}

	if err := tx.Commit(ctx); err != nil {
		return forum.PostResponse{}, err
	}

	// Fetch author details
	author, _ := uc.userRepo.GetUser(ctx, input.UserID)

	return forum.PostResponse{
		ID:           createdPost.ID,
		Title:        createdPost.Title,
		Content:      createdPost.Content,
		AuthorID:     createdPost.AuthorID,
		AuthorName:   author.Name,
		AuthorAvatar: author.Avatar,
		Tags:         createdPost.Tags,
		Views:        createdPost.Views,
		Upvotes:      createdPost.Upvotes,
		Downvotes:    createdPost.Downvotes,
		CreatedAt:    createdPost.CreatedAt,
		UpdatedAt:    createdPost.UpdatedAt,
	}, nil
}

func (uc *implUsecase) GetPost(ctx context.Context, id string) (forum.PostDetailResponse, error) {
	post, err := uc.repo.GetPost(ctx, id)
	if err != nil {
		return forum.PostDetailResponse{}, err
	}

	// Increment views asynchronously
	go func() {
		_ = uc.repo.IncrementPostViews(context.Background(), id)
	}()
	post.Views++

	comments, err := uc.repo.ListComments(ctx, id)
	if err != nil {
		return forum.PostDetailResponse{}, err
	}

	// Fetch users
	userIDs := []string{post.AuthorID}
	for _, c := range comments {
		userIDs = append(userIDs, c.AuthorID)
	}

	// De-duplicate
	uniqueIDs := make(map[string]bool)
	var distinctIDs []string
	for _, uid := range userIDs {
		if !uniqueIDs[uid] {
			uniqueIDs[uid] = true
			distinctIDs = append(distinctIDs, uid)
		}
	}

	users, _ := uc.userRepo.GetUsers(ctx, distinctIDs)
	userMap := make(map[string]models.User)
	for _, u := range users {
		userMap[u.ID.Hex()] = u
	}

	// Map Post
	author := userMap[post.AuthorID]

	// Check if answered
	isAnswered := post.IsAnswered

	postResp := forum.PostResponse{
		ID:           post.ID,
		Title:        post.Title,
		Content:      post.Content,
		AuthorID:     post.AuthorID,
		AuthorName:   author.Name,
		AuthorAvatar: author.Avatar,
		Tags:         post.Tags,
		Views:        post.Views,
		Upvotes:      post.Upvotes,
		Downvotes:    post.Downvotes,
		CommentCount: len(comments),
		IsAnswered:   isAnswered,
		VoteScore:    post.Upvotes - post.Downvotes,
		CreatedAt:    post.CreatedAt,
		UpdatedAt:    post.UpdatedAt,
	}

	commentResps := make([]forum.CommentResponse, len(comments))
	for i, c := range comments {
		cAuthor := userMap[c.AuthorID]
		commentResps[i] = forum.CommentResponse{
			ID:           c.ID,
			PostID:       c.PostID,
			Content:      c.Content,
			AuthorID:     c.AuthorID,
			AuthorName:   cAuthor.Name,
			AuthorAvatar: cAuthor.Avatar,
			IsAccepted:   c.IsAccepted,
			VoteScore:    c.Upvotes - c.Downvotes,
			CreatedAt:    c.CreatedAt,
		}
	}

	return forum.PostDetailResponse{
		Post:     postResp,
		Comments: commentResps,
	}, nil
}

func (uc *implUsecase) ListPosts(ctx context.Context, input forum.ListPostsInput) (forum.ListPostsOutput, error) {
	posts, pag, err := uc.repo.ListPosts(ctx, input)
	if err != nil {
		return forum.ListPostsOutput{}, err
	}

	userIDs := []string{}
	for _, p := range posts {
		userIDs = append(userIDs, p.AuthorID)
	}

	// De-duplicate
	uniqueIDs := make(map[string]bool)
	var distinctIDs []string
	for _, uid := range userIDs {
		if !uniqueIDs[uid] {
			uniqueIDs[uid] = true
			distinctIDs = append(distinctIDs, uid)
		}
	}

	users, _ := uc.userRepo.GetUsers(ctx, distinctIDs)
	userMap := make(map[string]models.User)
	for _, u := range users {
		userMap[u.ID.Hex()] = u
	}

	postResps := make([]forum.PostResponse, len(posts))
	for i, p := range posts {
		author := userMap[p.AuthorID]
		count, _ := uc.repo.GetCommentCount(ctx, p.ID.String())

		postResps[i] = forum.PostResponse{
			ID:           p.ID,
			Title:        p.Title,
			Content:      p.Content,
			AuthorID:     p.AuthorID,
			AuthorName:   author.Name,
			AuthorAvatar: author.Avatar,
			Tags:         p.Tags,
			Views:        p.Views,
			Upvotes:      p.Upvotes,
			Downvotes:    p.Downvotes,
			CommentCount: count,
			IsAnswered:   p.IsAnswered,
			VoteScore:    p.Upvotes - p.Downvotes,
			CreatedAt:    p.CreatedAt,
			UpdatedAt:    p.UpdatedAt,
		}
	}

	return forum.ListPostsOutput{
		Posts: postResps,
		Pagin: pag,
	}, nil
}
