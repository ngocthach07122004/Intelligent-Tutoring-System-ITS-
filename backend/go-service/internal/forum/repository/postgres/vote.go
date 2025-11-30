package postgres

import (
	"context"
	"time"

	"init-src/internal/models"
	"init-src/pkg/postgres"

	"github.com/google/uuid"
)

func (repo *implRepository) UpsertVote(ctx context.Context, tx postgres.Tx, vote models.Vote) error {
	query := `
		INSERT INTO votes (user_id, target_id, type, value, created_at)
		VALUES ($1, $2, $3, $4, $5)
		ON CONFLICT (user_id, target_id, type) 
		DO UPDATE SET value = EXCLUDED.value, created_at = EXCLUDED.created_at
	`

	now := time.Now()
	_, err := tx.Exec(ctx, query,
		vote.UserID,
		vote.TargetID,
		vote.Type,
		vote.Value,
		now,
	)

	return err
}

func (repo *implRepository) DeleteVote(ctx context.Context, tx postgres.Tx, userID string, targetID string, targetType string) error {
	tID, err := uuid.Parse(targetID)
	if err != nil {
		return err
	}

	query := `DELETE FROM votes WHERE user_id = $1 AND target_id = $2 AND type = $3`
	_, err = tx.Exec(ctx, query, userID, tID, targetType)
	return err
}

func (repo *implRepository) GetVote(ctx context.Context, userID string, targetID string, targetType string) (models.Vote, error) {
	tID, err := uuid.Parse(targetID)
	if err != nil {
		return models.Vote{}, err
	}

	query := `
		SELECT user_id, target_id, type, value, created_at
		FROM votes
		WHERE user_id = $1 AND target_id = $2 AND type = $3
	`

	var vote models.Vote
	err = repo.db.QueryRow(ctx, query, userID, tID, targetType).Scan(
		&vote.UserID,
		&vote.TargetID,
		&vote.Type,
		&vote.Value,
		&vote.CreatedAt,
	)

	if err != nil {
		repo.l.Errorf(ctx, "forum.postgres.GetVote.QueryRow", err)
		return models.Vote{}, err
	}

	return vote, nil
}
