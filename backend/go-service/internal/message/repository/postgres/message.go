package postgres

import (
	"context"
	"fmt"
	"time"

	"init-src/internal/message"
	"init-src/internal/models"
	"init-src/pkg/paginator"
	"init-src/pkg/postgres"

	"github.com/google/uuid"
)

func (repo *implRepository) Create(ctx context.Context, tx postgres.Tx, opts message.CreateOptions) (models.Message, error) {
	msg, err := repo.buildCreateMessage(opts)
	if err != nil {
		repo.l.Errorf(ctx, "message.postgres.Create.buildCreateMessage", err)
		return models.Message{}, err
	}

	query := `
		INSERT INTO messages (id, conversation_id, sender_id, type, content, attachments, reply_to_id, created_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id, conversation_id, sender_id, seq, type, content, attachments, reply_to_id, edited_at, created_at, deleted_at
	`

	now := time.Now()
	err = tx.QueryRow(ctx, query,
		msg.ID,
		msg.ConversationID,
		msg.SenderID,
		msg.Type,
		msg.Content,
		msg.Attachments,
		msg.ReplyToID,
		now,
	).Scan(
		&msg.ID,
		&msg.ConversationID,
		&msg.SenderID,
		&msg.Seq,
		&msg.Type,
		&msg.Content,
		&msg.Attachments,
		&msg.ReplyToID,
		&msg.EditedAt,
		&msg.CreatedAt,
		&msg.DeletedAt,
	)

	if err != nil {
		repo.l.Errorf(ctx, "message.postgres.Create.QueryRow", err)
		return models.Message{}, err
	}

	return msg, nil
}

func (repo *implRepository) List(ctx context.Context, sc models.Scope, opts message.ListOptions) ([]models.Message, error) {
	whereClause, args, err := repo.buildGetFilter(opts.Filter)
	if err != nil {
		repo.l.Errorf(ctx, "message.postgres.List.buildGetFilter", err)
		return nil, err
	}

	query := fmt.Sprintf(`
		SELECT id, conversation_id, sender_id, seq, type, content, attachments, reply_to_id, edited_at, created_at, deleted_at
		FROM messages
		%s
		ORDER BY seq DESC
	`, whereClause)

	rows, err := repo.db.Query(ctx, query, args...)
	if err != nil {
		repo.l.Errorf(ctx, "message.postgres.List.Query", err)
		return nil, err
	}
	defer rows.Close()

	var messages []models.Message
	for rows.Next() {
		var msg models.Message
		err := rows.Scan(
			&msg.ID,
			&msg.ConversationID,
			&msg.SenderID,
			&msg.Seq,
			&msg.Type,
			&msg.Content,
			&msg.Attachments,
			&msg.ReplyToID,
			&msg.EditedAt,
			&msg.CreatedAt,
			&msg.DeletedAt,
		)
		if err != nil {
			repo.l.Errorf(ctx, "message.postgres.List.Scan", err)
			return nil, err
		}
		messages = append(messages, msg)
	}

	if err := rows.Err(); err != nil {
		repo.l.Errorf(ctx, "message.postgres.List.Err", err)
		return nil, err
	}

	return messages, nil
}

func (repo *implRepository) Get(ctx context.Context, sc models.Scope, opts message.GetOptions) ([]models.Message, paginator.Paginator, error) {
	whereClause, args, err := repo.buildGetFilter(opts.Filter)
	if err != nil {
		repo.l.Errorf(ctx, "message.postgres.Get.buildGetFilter", err)
		return nil, paginator.Paginator{}, err
	}

	// Count total
	countQuery := fmt.Sprintf("SELECT COUNT(*) FROM messages %s", whereClause)
	var total int64
	err = repo.db.QueryRow(ctx, countQuery, args...).Scan(&total)
	if err != nil {
		repo.l.Errorf(ctx, "message.postgres.Get.CountQuery", err)
		return nil, paginator.Paginator{}, err
	}

	// Get paginated results (ordered by seq DESC for recent messages first)
	query := fmt.Sprintf(`
		SELECT id, conversation_id, sender_id, seq, type, content, attachments, reply_to_id, edited_at, created_at, deleted_at
		FROM messages
		%s
		ORDER BY seq DESC
		LIMIT $%d OFFSET $%d
	`, whereClause, len(args)+1, len(args)+2)

	args = append(args, opts.Pagin.Limit, opts.Pagin.Offset())

	rows, err := repo.db.Query(ctx, query, args...)
	if err != nil {
		repo.l.Errorf(ctx, "message.postgres.Get.Query", err)
		return nil, paginator.Paginator{}, err
	}
	defer rows.Close()

	var messages []models.Message
	for rows.Next() {
		var msg models.Message
		err := rows.Scan(
			&msg.ID,
			&msg.ConversationID,
			&msg.SenderID,
			&msg.Seq,
			&msg.Type,
			&msg.Content,
			&msg.Attachments,
			&msg.ReplyToID,
			&msg.EditedAt,
			&msg.CreatedAt,
			&msg.DeletedAt,
		)
		if err != nil {
			repo.l.Errorf(ctx, "message.postgres.Get.Scan", err)
			return nil, paginator.Paginator{}, err
		}
		messages = append(messages, msg)
	}

	if err := rows.Err(); err != nil {
		repo.l.Errorf(ctx, "message.postgres.Get.Err", err)
		return nil, paginator.Paginator{}, err
	}

	pag := paginator.Paginator{
		Total:       total,
		Count:       int64(len(messages)),
		PerPage:     opts.Pagin.Limit,
		CurrentPage: opts.Pagin.Page,
	}

	return messages, pag, nil
}

func (repo *implRepository) GetOne(ctx context.Context, sc models.Scope, opts message.GetOneOptions) (models.Message, error) {
	whereClause, args, err := repo.buildGetFilter(opts.Filter)
	if err != nil {
		repo.l.Errorf(ctx, "message.postgres.GetOne.buildGetFilter", err)
		return models.Message{}, err
	}

	query := fmt.Sprintf(`
		SELECT id, conversation_id, sender_id, seq, type, content, attachments, reply_to_id, edited_at, created_at, deleted_at
		FROM messages
		%s
		LIMIT 1
	`, whereClause)

	var msg models.Message
	err = repo.db.QueryRow(ctx, query, args...).Scan(
		&msg.ID,
		&msg.ConversationID,
		&msg.SenderID,
		&msg.Seq,
		&msg.Type,
		&msg.Content,
		&msg.Attachments,
		&msg.ReplyToID,
		&msg.EditedAt,
		&msg.CreatedAt,
		&msg.DeletedAt,
	)

	if err != nil {
		repo.l.Errorf(ctx, "message.postgres.GetOne.QueryRow", err)
		return models.Message{}, err
	}

	return msg, nil
}

func (repo *implRepository) GetByID(ctx context.Context, id string) (models.Message, error) {
	msgID, err := uuid.Parse(id)
	if err != nil {
		repo.l.Errorf(ctx, "message.postgres.GetByID.ParseID", err)
		return models.Message{}, fmt.Errorf("invalid message ID: %w", err)
	}

	query := `
		SELECT id, conversation_id, sender_id, seq, type, content, attachments, reply_to_id, edited_at, created_at, deleted_at
		FROM messages
		WHERE id = $1 AND deleted_at IS NULL
		LIMIT 1
	`

	var msg models.Message
	err = repo.db.QueryRow(ctx, query, msgID).Scan(
		&msg.ID,
		&msg.ConversationID,
		&msg.SenderID,
		&msg.Seq,
		&msg.Type,
		&msg.Content,
		&msg.Attachments,
		&msg.ReplyToID,
		&msg.EditedAt,
		&msg.CreatedAt,
		&msg.DeletedAt,
	)

	if err != nil {
		repo.l.Errorf(ctx, "message.postgres.GetByID.QueryRow", err)
		return models.Message{}, err
	}

	return msg, nil
}

func (repo *implRepository) GetBySeq(ctx context.Context, conversationID string, seq int64) (models.Message, error) {
	convID, err := uuid.Parse(conversationID)
	if err != nil {
		repo.l.Errorf(ctx, "message.postgres.GetBySeq.ParseID", err)
		return models.Message{}, fmt.Errorf("invalid conversation ID: %w", err)
	}

	query := `
		SELECT id, conversation_id, sender_id, seq, type, content, attachments, reply_to_id, edited_at, created_at, deleted_at
		FROM messages
		WHERE conversation_id = $1 AND seq = $2 AND deleted_at IS NULL
		LIMIT 1
	`

	var msg models.Message
	err = repo.db.QueryRow(ctx, query, convID, seq).Scan(
		&msg.ID,
		&msg.ConversationID,
		&msg.SenderID,
		&msg.Seq,
		&msg.Type,
		&msg.Content,
		&msg.Attachments,
		&msg.ReplyToID,
		&msg.EditedAt,
		&msg.CreatedAt,
		&msg.DeletedAt,
	)

	if err != nil {
		repo.l.Errorf(ctx, "message.postgres.GetBySeq.QueryRow", err)
		return models.Message{}, err
	}

	return msg, nil
}

func (repo *implRepository) Update(ctx context.Context, tx postgres.Tx, id string, opts message.UpdateOptions) (models.Message, error) {
	msg, err := repo.buildUpdateMessage(opts)
	if err != nil {
		repo.l.Errorf(ctx, "message.postgres.Update.buildUpdateMessage", err)
		return models.Message{}, err
	}

	msgID, err := uuid.Parse(id)
	if err != nil {
		repo.l.Errorf(ctx, "message.postgres.Update.ParseID", err)
		return models.Message{}, fmt.Errorf("invalid message ID: %w", err)
	}

	query := `
		UPDATE messages
		SET content = $1, edited_at = $2
		WHERE id = $3 AND deleted_at IS NULL
		RETURNING id, conversation_id, sender_id, seq, type, content, attachments, reply_to_id, edited_at, created_at, deleted_at
	`

	now := time.Now()
	err = tx.QueryRow(ctx, query,
		msg.Content,
		now,
		msgID,
	).Scan(
		&msg.ID,
		&msg.ConversationID,
		&msg.SenderID,
		&msg.Seq,
		&msg.Type,
		&msg.Content,
		&msg.Attachments,
		&msg.ReplyToID,
		&msg.EditedAt,
		&msg.CreatedAt,
		&msg.DeletedAt,
	)

	if err != nil {
		repo.l.Errorf(ctx, "message.postgres.Update.QueryRow", err)
		return models.Message{}, err
	}

	return msg, nil
}

func (repo *implRepository) Delete(ctx context.Context, tx postgres.Tx, id string) (string, error) {
	msgID, err := uuid.Parse(id)
	if err != nil {
		repo.l.Errorf(ctx, "message.postgres.Delete.ParseID", err)
		return "", fmt.Errorf("invalid message ID: %w", err)
	}

	query := `
		UPDATE messages
		SET deleted_at = $1
		WHERE id = $2 AND deleted_at IS NULL
	`

	now := time.Now()
	tag, err := tx.Exec(ctx, query, now, msgID)
	if err != nil {
		repo.l.Errorf(ctx, "message.postgres.Delete.Exec", err)
		return "", err
	}

	if tag.RowsAffected() == 0 {
		return "", fmt.Errorf("message not found or already deleted")
	}

	return "Deleted", nil
}

// Search operations

func (repo *implRepository) Search(ctx context.Context, conversationID string, query string, limit int) ([]models.Message, error) {
	convID, err := uuid.Parse(conversationID)
	if err != nil {
		repo.l.Errorf(ctx, "message.postgres.Search.ParseID", err)
		return nil, fmt.Errorf("invalid conversation ID: %w", err)
	}

	// Full-text search using tsvector
	sqlQuery := `
		SELECT id, conversation_id, sender_id, seq, type, content, attachments, reply_to_id, edited_at, created_at, deleted_at
		FROM messages
		WHERE conversation_id = $1
		AND deleted_at IS NULL
		AND search_vector @@ plainto_tsquery('english', $2)
		ORDER BY seq DESC
		LIMIT $3
	`

	rows, err := repo.db.Query(ctx, sqlQuery, convID, query, limit)
	if err != nil {
		repo.l.Errorf(ctx, "message.postgres.Search.Query", err)
		return nil, err
	}
	defer rows.Close()

	var messages []models.Message
	for rows.Next() {
		var msg models.Message
		err := rows.Scan(
			&msg.ID,
			&msg.ConversationID,
			&msg.SenderID,
			&msg.Seq,
			&msg.Type,
			&msg.Content,
			&msg.Attachments,
			&msg.ReplyToID,
			&msg.EditedAt,
			&msg.CreatedAt,
			&msg.DeletedAt,
		)
		if err != nil {
			repo.l.Errorf(ctx, "message.postgres.Search.Scan", err)
			return nil, err
		}
		messages = append(messages, msg)
	}

	if err := rows.Err(); err != nil {
		repo.l.Errorf(ctx, "message.postgres.Search.Err", err)
		return nil, err
	}

	return messages, nil
}

func (repo *implRepository) SearchGlobal(ctx context.Context, userID string, query string, limit int) ([]models.Message, error) {
	// Search across all conversations where user is a participant
	sqlQuery := `
		SELECT m.id, m.conversation_id, m.sender_id, m.seq, m.type, m.content, m.attachments, m.reply_to_id, m.edited_at, m.created_at, m.deleted_at
		FROM messages m
		INNER JOIN conversation_participants cp ON m.conversation_id = cp.conversation_id
		WHERE cp.user_id = $1
		AND cp.left_at IS NULL
		AND m.deleted_at IS NULL
		AND m.search_vector @@ plainto_tsquery('english', $2)
		ORDER BY m.created_at DESC
		LIMIT $3
	`

	rows, err := repo.db.Query(ctx, sqlQuery, userID, query, limit)
	if err != nil {
		repo.l.Errorf(ctx, "message.postgres.SearchGlobal.Query", err)
		return nil, err
	}
	defer rows.Close()

	var messages []models.Message
	for rows.Next() {
		var msg models.Message
		err := rows.Scan(
			&msg.ID,
			&msg.ConversationID,
			&msg.SenderID,
			&msg.Seq,
			&msg.Type,
			&msg.Content,
			&msg.Attachments,
			&msg.ReplyToID,
			&msg.EditedAt,
			&msg.CreatedAt,
			&msg.DeletedAt,
		)
		if err != nil {
			repo.l.Errorf(ctx, "message.postgres.SearchGlobal.Scan", err)
			return nil, err
		}
		messages = append(messages, msg)
	}

	if err := rows.Err(); err != nil {
		repo.l.Errorf(ctx, "message.postgres.SearchGlobal.Err", err)
		return nil, err
	}

	return messages, nil
}
