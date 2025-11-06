package postgres

import (
	"fmt"
	"strings"

	"init-src/internal/conversation"

	"github.com/google/uuid"
)

func (repo *implRepository) buildGetFilter(filter conversation.Filter) (string, []interface{}, error) {
	var conditions []string
	var args []interface{}
	argIdx := 1

	// Base condition: not deleted
	conditions = append(conditions, "c.deleted_at IS NULL")

	// Filter by ID
	if filter.ID != "" {
		convID, err := uuid.Parse(filter.ID)
		if err != nil {
			return "", nil, fmt.Errorf("invalid conversation ID: %w", err)
		}
		conditions = append(conditions, fmt.Sprintf("c.id = $%d", argIdx))
		args = append(args, convID)
		argIdx++
	}

	// Filter by Type
	if filter.Type != "" {
		conditions = append(conditions, fmt.Sprintf("c.type = $%d", argIdx))
		args = append(args, filter.Type)
		argIdx++
	}

	// Filter by ClassID
	if filter.ClassID != nil && *filter.ClassID != "" {
		classID, err := uuid.Parse(*filter.ClassID)
		if err != nil {
			return "", nil, fmt.Errorf("invalid class ID: %w", err)
		}
		conditions = append(conditions, fmt.Sprintf("c.class_id = $%d", argIdx))
		args = append(args, classID)
		argIdx++
	}

	// Filter by participant UserID
	if filter.UserID != "" {
		// Join with conversation_participants
		conditions = append(conditions, fmt.Sprintf(`
			EXISTS (
				SELECT 1 FROM conversation_participants cp
				WHERE cp.conversation_id = c.id
				AND cp.user_id = $%d
				%s
			)
		`, argIdx, func() string {
			if filter.NotLeftAt {
				return "AND cp.left_at IS NULL"
			}
			return ""
		}()))
		args = append(args, filter.UserID)
		argIdx++
	}

	whereClause := "WHERE " + strings.Join(conditions, " AND ")
	return whereClause, args, nil
}
