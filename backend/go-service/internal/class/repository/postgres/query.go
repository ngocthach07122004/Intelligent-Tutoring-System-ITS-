package postgres

import (
	"fmt"
	"strings"

	"init-src/internal/class"

	"github.com/google/uuid"
)

func (repo *implRepository) buildGetFilter(input class.Filter) (string, []interface{}, error) {
	var conditions []string
	var args []interface{}
	argCount := 1
	var joinClause string // New variable for join clause

	// Always filter out soft-deleted records
	conditions = append(conditions, "c.deleted_at IS NULL") // Prefix with alias 'c' for clarity

	if input.MemberID != "" {
		joinClause = "JOIN class_members cm ON c.id = cm.class_id"
		conditions = append(conditions, fmt.Sprintf("cm.user_id = $%d", argCount))
		args = append(args, input.MemberID)
		argCount++
		conditions = append(conditions, "cm.deleted_at IS NULL") // Only include active members
	}

	if input.ID != "" {
		id, err := uuid.Parse(input.ID)
		if err != nil {
			return "", nil, fmt.Errorf("invalid class ID: %w", err)
		}
		conditions = append(conditions, fmt.Sprintf("c.id = $%d", argCount)) // Prefix with alias 'c'
		args = append(args, id)
		argCount++
	}

	if input.Name != "" {
		conditions = append(conditions, fmt.Sprintf("c.name ILIKE $%d", argCount)) // Prefix with alias 'c'
		args = append(args, "%"+input.Name+"%")
		argCount++
	}

	if input.Code != "" {
		conditions = append(conditions, fmt.Sprintf("c.code = $%d", argCount)) // Prefix with alias 'c'
		args = append(args, input.Code)
		argCount++
	}

	if input.CreatedBy != "" {
		conditions = append(conditions, fmt.Sprintf("c.created_by = $%d", argCount)) // Prefix with alias 'c'
		args = append(args, input.CreatedBy)
		argCount++
	}

	if input.Archived != nil {
		conditions = append(conditions, fmt.Sprintf("c.archived = $%d", argCount)) // Prefix with alias 'c'
		args = append(args, *input.Archived)
		argCount++
	}

	whereClause := ""
	if len(conditions) > 0 {
		whereClause = "WHERE " + strings.Join(conditions, " AND ")
	}

	return joinClause + " " + whereClause, args, nil
}
