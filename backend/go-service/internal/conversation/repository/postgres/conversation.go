package postgres

import (
	"context"
	"fmt"
	"time"

	"init-src/internal/conversation"
	"init-src/internal/models"
	"init-src/pkg/paginator"
	"init-src/pkg/postgres"

	"github.com/google/uuid"
)

func (repo *implRepository) Create(ctx context.Context, tx postgres.Tx, opts conversation.CreateOptions) (models.Conversation, error) {
	conv, err := repo.buildCreateConversation(opts)
	if err != nil {
		repo.l.Errorf(ctx, "conversation.postgres.Create.buildCreateConversation", err)
		return models.Conversation{}, err
	}

	query := `
		INSERT INTO conversations (id, type, name, class_id, created_by, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id, type, name, class_id, created_by, created_at, updated_at, deleted_at
	`

	now := time.Now()
	err = tx.QueryRow(ctx, query,
		conv.ID,
		conv.Type,
		conv.Name,
		conv.ClassID,
		conv.CreatedBy,
		now,
		now,
	).Scan(
		&conv.ID,
		&conv.Type,
		&conv.Name,
		&conv.ClassID,
		&conv.CreatedBy,
		&conv.CreatedAt,
		&conv.UpdatedAt,
		&conv.DeletedAt,
	)

	if err != nil {
		repo.l.Errorf(ctx, "conversation.postgres.Create.QueryRow", err)
		return models.Conversation{}, err
	}

	return conv, nil
}

func (repo *implRepository) List(ctx context.Context, sc models.Scope, input conversation.ListInput) ([]models.Conversation, error) {
	whereClause, args, err := repo.buildGetFilter(input.Filter)
	if err != nil {
		repo.l.Errorf(ctx, "conversation.postgres.List.buildGetFilter", err)
		return nil, err
	}

	query := fmt.Sprintf(`
		SELECT c.id, c.type, c.name, c.class_id, c.created_by, c.created_at, c.updated_at, c.deleted_at
		FROM conversations c
		%s
		ORDER BY c.updated_at DESC
	`, whereClause)

	rows, err := repo.db.Query(ctx, query, args...)
	if err != nil {
		repo.l.Errorf(ctx, "conversation.postgres.List.Query", err)
		return nil, err
	}
	defer rows.Close()

	var conversations []models.Conversation
	for rows.Next() {
		var conv models.Conversation
		err := rows.Scan(
			&conv.ID,
			&conv.Type,
			&conv.Name,
			&conv.ClassID,
			&conv.CreatedBy,
			&conv.CreatedAt,
			&conv.UpdatedAt,
			&conv.DeletedAt,
		)
		if err != nil {
			repo.l.Errorf(ctx, "conversation.postgres.List.Scan", err)
			return nil, err
		}
		conversations = append(conversations, conv)
	}

	if err := rows.Err(); err != nil {
		repo.l.Errorf(ctx, "conversation.postgres.List.Err", err)
		return nil, err
	}

	return conversations, nil
}

func (repo *implRepository) Get(ctx context.Context, sc models.Scope, input conversation.GetInput) ([]models.Conversation, paginator.Paginator, error) {
	whereClause, args, err := repo.buildGetFilter(input.Filter)
	if err != nil {
		repo.l.Errorf(ctx, "conversation.postgres.Get.buildGetFilter", err)
		return nil, paginator.Paginator{}, err
	}

	// Count total
	countQuery := fmt.Sprintf("SELECT COUNT(*) FROM conversations c %s", whereClause)
	var total int64
	err = repo.db.QueryRow(ctx, countQuery, args...).Scan(&total)
	if err != nil {
		repo.l.Errorf(ctx, "conversation.postgres.Get.CountQuery", err)
		return nil, paginator.Paginator{}, err
	}

	// Get paginated results
	query := fmt.Sprintf(`
		SELECT c.id, c.type, c.name, c.class_id, c.created_by, c.created_at, c.updated_at, c.deleted_at
		FROM conversations c
		%s
		ORDER BY c.updated_at DESC
		LIMIT $%d OFFSET $%d
	`, whereClause, len(args)+1, len(args)+2)

	args = append(args, input.Pagin.Limit, input.Pagin.Offset())

	rows, err := repo.db.Query(ctx, query, args...)
	if err != nil {
		repo.l.Errorf(ctx, "conversation.postgres.Get.Query", err)
		return nil, paginator.Paginator{}, err
	}
	defer rows.Close()

	var conversations []models.Conversation
	for rows.Next() {
		var conv models.Conversation
		err := rows.Scan(
			&conv.ID,
			&conv.Type,
			&conv.Name,
			&conv.ClassID,
			&conv.CreatedBy,
			&conv.CreatedAt,
			&conv.UpdatedAt,
			&conv.DeletedAt,
		)
		if err != nil {
			repo.l.Errorf(ctx, "conversation.postgres.Get.Scan", err)
			return nil, paginator.Paginator{}, err
		}
		conversations = append(conversations, conv)
	}

	if err := rows.Err(); err != nil {
		repo.l.Errorf(ctx, "conversation.postgres.Get.Err", err)
		return nil, paginator.Paginator{}, err
	}

	pag := paginator.Paginator{
		Total:       total,
		Count:       int64(len(conversations)),
		PerPage:     input.Pagin.Limit,
		CurrentPage: input.Pagin.Page,
	}

	return conversations, pag, nil
}

func (repo *implRepository) GetOne(ctx context.Context, sc models.Scope, input conversation.GetOneInput) (models.Conversation, error) {
	whereClause, args, err := repo.buildGetFilter(input.Filter)
	if err != nil {
		repo.l.Errorf(ctx, "conversation.postgres.GetOne.buildGetFilter", err)
		return models.Conversation{}, err
	}

	query := fmt.Sprintf(`
		SELECT c.id, c.type, c.name, c.class_id, c.created_by, c.created_at, c.updated_at, c.deleted_at
		FROM conversations c
		%s
		LIMIT 1
	`, whereClause)

	var conv models.Conversation
	err = repo.db.QueryRow(ctx, query, args...).Scan(
		&conv.ID,
		&conv.Type,
		&conv.Name,
		&conv.ClassID,
		&conv.CreatedBy,
		&conv.CreatedAt,
		&conv.UpdatedAt,
		&conv.DeletedAt,
	)

	if err != nil {
		repo.l.Errorf(ctx, "conversation.postgres.GetOne.QueryRow", err)
		return models.Conversation{}, err
	}

	return conv, nil
}

func (repo *implRepository) GetByID(ctx context.Context, id string) (models.Conversation, error) {
	convID, err := uuid.Parse(id)
	if err != nil {
		repo.l.Errorf(ctx, "conversation.postgres.GetByID.ParseID", err)
		return models.Conversation{}, fmt.Errorf("invalid conversation ID: %w", err)
	}

	query := `
		SELECT id, type, name, class_id, created_by, created_at, updated_at, deleted_at
		FROM conversations
		WHERE id = $1 AND deleted_at IS NULL
		LIMIT 1
	`

	var conv models.Conversation
	err = repo.db.QueryRow(ctx, query, convID).Scan(
		&conv.ID,
		&conv.Type,
		&conv.Name,
		&conv.ClassID,
		&conv.CreatedBy,
		&conv.CreatedAt,
		&conv.UpdatedAt,
		&conv.DeletedAt,
	)

	if err != nil {
		repo.l.Errorf(ctx, "conversation.postgres.GetByID.QueryRow", err)
		return models.Conversation{}, err
	}

	return conv, nil
}

func (repo *implRepository) Delete(ctx context.Context, tx postgres.Tx, id string) (string, error) {
	convID, err := uuid.Parse(id)
	if err != nil {
		repo.l.Errorf(ctx, "conversation.postgres.Delete.ParseID", err)
		return "", fmt.Errorf("invalid conversation ID: %w", err)
	}

	query := `
		UPDATE conversations
		SET deleted_at = $1
		WHERE id = $2 AND deleted_at IS NULL
	`

	now := time.Now()
	tag, err := tx.Exec(ctx, query, now, convID)
	if err != nil {
		repo.l.Errorf(ctx, "conversation.postgres.Delete.Exec", err)
		return "", err
	}

	if tag.RowsAffected() == 0 {
		return "", fmt.Errorf("conversation not found or already deleted")
	}

	return "Deleted", nil
}

// Participant operations

func (repo *implRepository) AddParticipant(ctx context.Context, tx postgres.Tx, opts conversation.AddParticipantOptions) (models.ConversationParticipant, error) {
	participant, err := repo.buildAddParticipant(opts)
	if err != nil {
		repo.l.Errorf(ctx, "conversation.postgres.AddParticipant.buildAddParticipant", err)
		return models.ConversationParticipant{}, err
	}

	query := `
		INSERT INTO conversation_participants (id, conversation_id, user_id, last_read_seq, joined_at, created_at)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, conversation_id, user_id, last_read_seq, left_at, joined_at, created_at
	`

	now := time.Now()
	err = tx.QueryRow(ctx, query,
		participant.ID,
		participant.ConversationID,
		participant.UserID,
		participant.LastReadSeq,
		now,
		now,
	).Scan(
		&participant.ID,
		&participant.ConversationID,
		&participant.UserID,
		&participant.LastReadSeq,
		&participant.LeftAt,
		&participant.JoinedAt,
		&participant.CreatedAt,
	)

	if err != nil {
		repo.l.Errorf(ctx, "conversation.postgres.AddParticipant.QueryRow", err)
		return models.ConversationParticipant{}, err
	}

	return participant, nil
}

func (repo *implRepository) AddParticipants(ctx context.Context, tx postgres.Tx, conversationID string, userIDs []string) error {
	convID, err := uuid.Parse(conversationID)
	if err != nil {
		repo.l.Errorf(ctx, "conversation.postgres.AddParticipants.ParseID", err)
		return fmt.Errorf("invalid conversation ID: %w", err)
	}

	for _, userID := range userIDs {
		_, err := repo.AddParticipant(ctx, tx, conversation.AddParticipantOptions{
			ConversationID: convID.String(),
			UserID:         userID,
		})
		if err != nil {
			repo.l.Errorf(ctx, "conversation.postgres.AddParticipants.AddParticipant", err)
			return err
		}
	}

	return nil
}

func (repo *implRepository) RemoveParticipant(ctx context.Context, tx postgres.Tx, conversationID string, userID string) error {
	convID, err := uuid.Parse(conversationID)
	if err != nil {
		repo.l.Errorf(ctx, "conversation.postgres.RemoveParticipant.ParseID", err)
		return fmt.Errorf("invalid conversation ID: %w", err)
	}

	query := `
		UPDATE conversation_participants
		SET left_at = $1
		WHERE conversation_id = $2 AND user_id = $3 AND left_at IS NULL
	`

	now := time.Now()
	tag, err := tx.Exec(ctx, query, now, convID, userID)
	if err != nil {
		repo.l.Errorf(ctx, "conversation.postgres.RemoveParticipant.Exec", err)
		return err
	}

	if tag.RowsAffected() == 0 {
		return fmt.Errorf("participant not found or already left")
	}

	return nil
}

func (repo *implRepository) GetParticipants(ctx context.Context, conversationID string) ([]models.ConversationParticipant, error) {
	convID, err := uuid.Parse(conversationID)
	if err != nil {
		repo.l.Errorf(ctx, "conversation.postgres.GetParticipants.ParseID", err)
		return nil, fmt.Errorf("invalid conversation ID: %w", err)
	}

	query := `
		SELECT id, conversation_id, user_id, last_read_seq, left_at, joined_at, created_at
		FROM conversation_participants
		WHERE conversation_id = $1
		ORDER BY joined_at ASC
	`

	rows, err := repo.db.Query(ctx, query, convID)
	if err != nil {
		repo.l.Errorf(ctx, "conversation.postgres.GetParticipants.Query", err)
		return nil, err
	}
	defer rows.Close()

	var participants []models.ConversationParticipant
	for rows.Next() {
		var participant models.ConversationParticipant
		err := rows.Scan(
			&participant.ID,
			&participant.ConversationID,
			&participant.UserID,
			&participant.LastReadSeq,
			&participant.LeftAt,
			&participant.JoinedAt,
			&participant.CreatedAt,
		)
		if err != nil {
			repo.l.Errorf(ctx, "conversation.postgres.GetParticipants.Scan", err)
			return nil, err
		}
		participants = append(participants, participant)
	}

	if err := rows.Err(); err != nil {
		repo.l.Errorf(ctx, "conversation.postgres.GetParticipants.Err", err)
		return nil, err
	}

	return participants, nil
}

func (repo *implRepository) GetParticipant(ctx context.Context, conversationID string, userID string) (models.ConversationParticipant, error) {
	convID, err := uuid.Parse(conversationID)
	if err != nil {
		repo.l.Errorf(ctx, "conversation.postgres.GetParticipant.ParseID", err)
		return models.ConversationParticipant{}, fmt.Errorf("invalid conversation ID: %w", err)
	}

	query := `
		SELECT id, conversation_id, user_id, last_read_seq, left_at, joined_at, created_at
		FROM conversation_participants
		WHERE conversation_id = $1 AND user_id = $2
		LIMIT 1
	`

	var participant models.ConversationParticipant
	err = repo.db.QueryRow(ctx, query, convID, userID).Scan(
		&participant.ID,
		&participant.ConversationID,
		&participant.UserID,
		&participant.LastReadSeq,
		&participant.LeftAt,
		&participant.JoinedAt,
		&participant.CreatedAt,
	)

	if err != nil {
		repo.l.Errorf(ctx, "conversation.postgres.GetParticipant.QueryRow", err)
		return models.ConversationParticipant{}, err
	}

	return participant, nil
}

func (repo *implRepository) IsParticipant(ctx context.Context, conversationID string, userID string) (bool, error) {
	convID, err := uuid.Parse(conversationID)
	if err != nil {
		repo.l.Errorf(ctx, "conversation.postgres.IsParticipant.ParseID", err)
		return false, fmt.Errorf("invalid conversation ID: %w", err)
	}

	query := `
		SELECT EXISTS(
			SELECT 1 FROM conversation_participants
			WHERE conversation_id = $1 AND user_id = $2 AND left_at IS NULL
		)
	`

	var exists bool
	err = repo.db.QueryRow(ctx, query, convID, userID).Scan(&exists)
	if err != nil {
		repo.l.Errorf(ctx, "conversation.postgres.IsParticipant.QueryRow", err)
		return false, err
	}

	return exists, nil
}

func (repo *implRepository) UpdateLastReadSeq(ctx context.Context, tx postgres.Tx, conversationID string, userID string, seq int64) error {
	convID, err := uuid.Parse(conversationID)
	if err != nil {
		repo.l.Errorf(ctx, "conversation.postgres.UpdateLastReadSeq.ParseID", err)
		return fmt.Errorf("invalid conversation ID: %w", err)
	}

	query := `
		UPDATE conversation_participants
		SET last_read_seq = $1
		WHERE conversation_id = $2 AND user_id = $3 AND left_at IS NULL
	`

	tag, err := tx.Exec(ctx, query, seq, convID, userID)
	if err != nil {
		repo.l.Errorf(ctx, "conversation.postgres.UpdateLastReadSeq.Exec", err)
		return err
	}

	if tag.RowsAffected() == 0 {
		return fmt.Errorf("participant not found or has left")
	}

	return nil
}

func (repo *implRepository) GetDirectConversation(ctx context.Context, user1ID string, user2ID string) (models.Conversation, error) {
	query := `
		SELECT c.id, c.type, c.name, c.class_id, c.created_by, c.created_at, c.updated_at, c.deleted_at
		FROM conversations c
		WHERE c.type = 'direct' AND c.deleted_at IS NULL
		AND EXISTS (
			SELECT 1 FROM conversation_participants cp1
			WHERE cp1.conversation_id = c.id AND cp1.user_id = $1 AND cp1.left_at IS NULL
		)
		AND EXISTS (
			SELECT 1 FROM conversation_participants cp2
			WHERE cp2.conversation_id = c.id AND cp2.user_id = $2 AND cp2.left_at IS NULL
		)
		LIMIT 1
	`

	var conv models.Conversation
	err := repo.db.QueryRow(ctx, query, user1ID, user2ID).Scan(
		&conv.ID,
		&conv.Type,
		&conv.Name,
		&conv.ClassID,
		&conv.CreatedBy,
		&conv.CreatedAt,
		&conv.UpdatedAt,
		&conv.DeletedAt,
	)

	if err != nil {
		repo.l.Errorf(ctx, "conversation.postgres.GetDirectConversation.QueryRow", err)
		return models.Conversation{}, err
	}

	return conv, nil
}
