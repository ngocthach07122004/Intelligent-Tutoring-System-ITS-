package postgres

import (
	"fmt"
	"strings"

	"init-src/internal/message"

	"github.com/google/uuid"
)

func (repo *implRepository) buildGetFilter(filter message.Filter) (string, []interface{}, error) {
	var conditions []string
	var args []interface{}
	argIdx := 1

	// Base condition: not deleted
	conditions = append(conditions, "deleted_at IS NULL")

	// Filter by ID
	if filter.ID != "" {
		msgID, err := uuid.Parse(filter.ID)
		if err != nil {
			return "", nil, fmt.Errorf("invalid message ID: %w", err)
		}
		conditions = append(conditions, fmt.Sprintf("id = $%d", argIdx))
		args = append(args, msgID)
		argIdx++
	}

	// Filter by ConversationID
	if filter.ConversationID != "" {
		convID, err := uuid.Parse(filter.ConversationID)
		if err != nil {
			return "", nil, fmt.Errorf("invalid conversation ID: %w", err)
		}
		conditions = append(conditions, fmt.Sprintf("conversation_id = $%d", argIdx))
		args = append(args, convID)
		argIdx++
	}

	// Filter by SenderID
	if filter.SenderID != "" {
		conditions = append(conditions, fmt.Sprintf("sender_id = $%d", argIdx))
		args = append(args, filter.SenderID)
		argIdx++
	}

	// Filter by Type
	if filter.Type != "" {
		conditions = append(conditions, fmt.Sprintf("type = $%d", argIdx))
		args = append(args, filter.Type)
		argIdx++
	}

	// Filter by MinSeq (for pagination/sync)
	if filter.MinSeq != nil {
		conditions = append(conditions, fmt.Sprintf("seq > $%d", argIdx))
		args = append(args, *filter.MinSeq)
		argIdx++
	}

	// Filter by MaxSeq
	if filter.MaxSeq != nil {
		conditions = append(conditions, fmt.Sprintf("seq <= $%d", argIdx))
		args = append(args, *filter.MaxSeq)
		argIdx++
	}

	whereClause := "WHERE " + strings.Join(conditions, " AND ")
	return whereClause, args, nil
}
