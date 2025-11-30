package usecase

import (
	"context"
	"errors"
	"init-src/internal/forum"
	"init-src/internal/models"

	"github.com/google/uuid"
)

func (uc *implUsecase) Vote(ctx context.Context, input forum.VoteInput) error {
	tx, err := uc.db.BeginTx(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	existingVote, err := uc.repo.GetVote(ctx, input.UserID, input.TargetID, input.Type)

	var oldVal int = 0
	var newVal int = input.Value
	var isDelete bool = false

	if err == nil {
		// Vote exists
		oldVal = existingVote.Value
		if oldVal == newVal {
			// Toggle off
			isDelete = true
			newVal = 0
		}
	}

	if isDelete {
		err = uc.repo.DeleteVote(ctx, tx, input.UserID, input.TargetID, input.Type)
	} else {
		targetUUID, _ := uuid.Parse(input.TargetID)
		vote := models.Vote{
			UserID:   input.UserID,
			TargetID: targetUUID,
			Type:     input.Type,
			Value:    newVal,
		}
		err = uc.repo.UpsertVote(ctx, tx, vote)
	}

	if err != nil {
		return err
	}

	// Update target counts
	if input.Type == "post" {
		post, err := uc.repo.GetPost(ctx, input.TargetID)
		if err != nil {
			return err
		}

		if oldVal == 1 {
			post.Upvotes--
		}
		if oldVal == -1 {
			post.Downvotes--
		}

		if newVal == 1 {
			post.Upvotes++
		}
		if newVal == -1 {
			post.Downvotes++
		}

		_, err = uc.repo.UpdatePost(ctx, tx, post)
		if err != nil {
			return err
		}
	} else if input.Type == "comment" {
		comment, err := uc.repo.GetComment(ctx, input.TargetID)
		if err != nil {
			return err
		}

		if oldVal == 1 {
			comment.Upvotes--
		}
		if oldVal == -1 {
			comment.Downvotes--
		}

		if newVal == 1 {
			comment.Upvotes++
		}
		if newVal == -1 {
			comment.Downvotes++
		}

		_, err = uc.repo.UpdateComment(ctx, tx, comment)
		if err != nil {
			return err
		}
	} else {
		return errors.New("invalid vote type")
	}

	return tx.Commit(ctx)
}
