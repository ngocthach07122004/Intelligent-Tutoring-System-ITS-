package postgres

import (
	"fmt"
	"strings"

	"init-src/internal/notification"
)

// buildGetFilter builds WHERE clause for notification queries
func (repo *implRepository) buildGetFilter(filter notification.Filter) (string, []interface{}, error) {
	var conditions []string
	var args []interface{}
	argIdx := 1

	// Soft delete filter
	conditions = append(conditions, "deleted_at IS NULL")

	// Filter by ID
	if filter.ID != "" {
		conditions = append(conditions, fmt.Sprintf("id = $%d", argIdx))
		args = append(args, filter.ID)
		argIdx++
	}

	// Filter by UserID (required for user's notifications)
	if filter.UserID != "" {
		conditions = append(conditions, fmt.Sprintf("user_id = $%d", argIdx))
		args = append(args, filter.UserID)
		argIdx++
	}

	// Filter by Type
	if filter.Type != "" {
		conditions = append(conditions, fmt.Sprintf("type = $%d", argIdx))
		args = append(args, filter.Type)
		argIdx++
	}

	// Filter by Unread
	if filter.Unread {
		conditions = append(conditions, "read_at IS NULL")
	}

	// Filter by EntityType
	if filter.EntityType != nil && *filter.EntityType != "" {
		conditions = append(conditions, fmt.Sprintf("entity_type = $%d", argIdx))
		args = append(args, *filter.EntityType)
		argIdx++
	}

	// Filter by EntityID
	if filter.EntityID != nil && *filter.EntityID != "" {
		conditions = append(conditions, fmt.Sprintf("entity_id = $%d", argIdx))
		args = append(args, *filter.EntityID)
		argIdx++
	}

	whereClause := strings.Join(conditions, " AND ")
	return whereClause, args, nil
}
