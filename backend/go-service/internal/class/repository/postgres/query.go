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

	// Always filter out soft-deleted records
	conditions = append(conditions, "deleted_at IS NULL")

	if input.ID != "" {
		id, err := uuid.Parse(input.ID)
		if err != nil {
			return "", nil, fmt.Errorf("invalid class ID: %w", err)
		}
		conditions = append(conditions, fmt.Sprintf("id = $%d", argCount))
		args = append(args, id)
		argCount++
	}

	if input.Name != "" {
		conditions = append(conditions, fmt.Sprintf("name ILIKE $%d", argCount))
		args = append(args, "%"+input.Name+"%")
		argCount++
	}

	if input.Code != "" {
		conditions = append(conditions, fmt.Sprintf("code = $%d", argCount))
		args = append(args, input.Code)
		argCount++
	}

	if input.CreatedBy != "" {
		conditions = append(conditions, fmt.Sprintf("created_by = $%d", argCount))
		args = append(args, input.CreatedBy)
		argCount++
	}

	if input.Archived != nil {
		conditions = append(conditions, fmt.Sprintf("archived = $%d", argCount))
		args = append(args, *input.Archived)
		argCount++
	}

	whereClause := "WHERE " + strings.Join(conditions, " AND ")
	return whereClause, args, nil
}
