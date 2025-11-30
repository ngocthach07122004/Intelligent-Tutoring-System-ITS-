package postgres

import (
	"context"
	"fmt"
	"time"

	"init-src/internal/class"
	"init-src/internal/models"
	"init-src/pkg/paginator"
	"init-src/pkg/postgres"

	"github.com/google/uuid"
)

func (repo *implRepository) Create(ctx context.Context, tx postgres.Tx, opts class.CreateOptions) (models.Class, error) {
	cls, err := repo.buildCreateClass(opts)
	if err != nil {
		repo.l.Errorf(ctx, "class.postgres.Create.buildCreateClass", err)
		return models.Class{}, err
	}

	query := `
		INSERT INTO classes (id, name, description, code, avatar_url, created_by, archived, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		RETURNING id, name, description, code, avatar_url, created_by, archived, created_at, updated_at, deleted_at
	`

	now := time.Now()
	err = tx.QueryRow(ctx, query,
		cls.ID,
		cls.Name,
		cls.Description,
		cls.Code,
		cls.AvatarURL,
		cls.CreatedBy,
		cls.Archived,
		now,
		now,
	).Scan(
		&cls.ID,
		&cls.Name,
		&cls.Description,
		&cls.Code,
		&cls.AvatarURL,
		&cls.CreatedBy,
		&cls.Archived,
		&cls.CreatedAt,
		&cls.UpdatedAt,
		&cls.DeletedAt,
	)

	if err != nil {
		repo.l.Errorf(ctx, "class.postgres.Create.QueryRow", err)
		return models.Class{}, err
	}

	return cls, nil
}

func (repo *implRepository) List(ctx context.Context, sc models.Scope, input class.ListInput) ([]models.Class, error) {
	whereClause, args, err := repo.buildGetFilter(input.Filter)
	if err != nil {
		repo.l.Errorf(ctx, "class.postgres.List.buildGetFilter", err)
		return nil, err
	}

	query := fmt.Sprintf(`
		SELECT c.id, c.name, c.description, c.code, c.avatar_url, c.created_by, c.archived, c.created_at, c.updated_at, c.deleted_at
		FROM classes c
		%s
		ORDER BY c.created_at DESC
	`, whereClause)

	rows, err := repo.db.Query(ctx, query, args...)
	if err != nil {
		repo.l.Errorf(ctx, "class.postgres.List.Query", err)
		return nil, err
	}
	defer rows.Close()

	var classes []models.Class
	for rows.Next() {
		var cls models.Class
		err := rows.Scan(
			&cls.ID,
			&cls.Name,
			&cls.Description,
			&cls.Code,
			&cls.AvatarURL,
			&cls.CreatedBy,
			&cls.Archived,
			&cls.CreatedAt,
			&cls.UpdatedAt,
			&cls.DeletedAt,
		)
		if err != nil {
			repo.l.Errorf(ctx, "class.postgres.List.Scan", err)
			return nil, err
		}
		classes = append(classes, cls)
	}

	if err := rows.Err(); err != nil {
		repo.l.Errorf(ctx, "class.postgres.List.Err", err)
		return nil, err
	}

	return classes, nil
}

func (repo *implRepository) Get(ctx context.Context, sc models.Scope, input class.GetInput) ([]models.Class, paginator.Paginator, error) {
	whereClause, args, err := repo.buildGetFilter(input.Filter)
	if err != nil {
		repo.l.Errorf(ctx, "class.postgres.Get.buildGetFilter", err)
		return nil, paginator.Paginator{}, err
	}

	// Count total
	countQuery := fmt.Sprintf("SELECT COUNT(c.id) FROM classes c %s", whereClause)
	var total int64
	err = repo.db.QueryRow(ctx, countQuery, args...).Scan(&total)
	if err != nil {
		repo.l.Errorf(ctx, "class.postgres.Get.CountQuery", err)
		return nil, paginator.Paginator{}, err
	}

	// Get paginated results
	query := fmt.Sprintf(`
		SELECT c.id, c.name, c.description, c.code, c.avatar_url, c.created_by, c.archived, c.created_at, c.updated_at, c.deleted_at
		FROM classes c
		%s
		ORDER BY c.created_at DESC
		LIMIT $%d OFFSET $%d
	`, whereClause, len(args)+1, len(args)+2)

	args = append(args, input.Pagin.Limit, input.Pagin.Offset())

	rows, err := repo.db.Query(ctx, query, args...)
	if err != nil {
		repo.l.Errorf(ctx, "class.postgres.Get.Query", err)
		return nil, paginator.Paginator{}, err
	}
	defer rows.Close()

	var classes []models.Class
	for rows.Next() {
		var cls models.Class
		err := rows.Scan(
			&cls.ID,
			&cls.Name,
			&cls.Description,
			&cls.Code,
			&cls.AvatarURL,
			&cls.CreatedBy,
			&cls.Archived,
			&cls.CreatedAt,
			&cls.UpdatedAt,
			&cls.DeletedAt,
		)
		if err != nil {
			repo.l.Errorf(ctx, "class.postgres.Get.Scan", err)
			return nil, paginator.Paginator{}, err
		}
		classes = append(classes, cls)
	}

	if err := rows.Err(); err != nil {
		repo.l.Errorf(ctx, "class.postgres.Get.Err", err)
		return nil, paginator.Paginator{}, err
	}

	pag := paginator.Paginator{
		Total:       total,
		Count:       int64(len(classes)),
		PerPage:     input.Pagin.Limit,
		CurrentPage: input.Pagin.Page,
	}

	return classes, pag, nil
}

func (repo *implRepository) GetOne(ctx context.Context, sc models.Scope, input class.GetOneInput) (models.Class, error) {
	whereClause, args, err := repo.buildGetFilter(input.Filter)
	if err != nil {
		repo.l.Errorf(ctx, "class.postgres.GetOne.buildGetFilter", err)
		return models.Class{}, err
	}

	query := fmt.Sprintf(`
		SELECT id, name, description, code, avatar_url, created_by, archived, created_at, updated_at, deleted_at
		FROM classes
		%s
		LIMIT 1
	`, whereClause)

	var cls models.Class
	err = repo.db.QueryRow(ctx, query, args...).Scan(
		&cls.ID,
		&cls.Name,
		&cls.Description,
		&cls.Code,
		&cls.AvatarURL,
		&cls.CreatedBy,
		&cls.Archived,
		&cls.CreatedAt,
		&cls.UpdatedAt,
		&cls.DeletedAt,
	)

	if err != nil {
		repo.l.Errorf(ctx, "class.postgres.GetOne.QueryRow", err)
		return models.Class{}, err
	}

	return cls, nil
}

func (repo *implRepository) GetByCode(ctx context.Context, code string) (models.Class, error) {
	query := `
		SELECT id, name, description, code, avatar_url, created_by, archived, created_at, updated_at, deleted_at
		FROM classes
		WHERE code = $1 AND deleted_at IS NULL
		LIMIT 1
	`

	var cls models.Class
	err := repo.db.QueryRow(ctx, query, code).Scan(
		&cls.ID,
		&cls.Name,
		&cls.Description,
		&cls.Code,
		&cls.AvatarURL,
		&cls.CreatedBy,
		&cls.Archived,
		&cls.CreatedAt,
		&cls.UpdatedAt,
		&cls.DeletedAt,
	)

	if err != nil {
		repo.l.Errorf(ctx, "class.postgres.GetByCode.QueryRow", err)
		return models.Class{}, err
	}

	return cls, nil
}

func (repo *implRepository) Update(ctx context.Context, tx postgres.Tx, id string, opts class.UpdateOptions) (models.Class, error) {
	cls, err := repo.buildUpdateClass(opts)
	if err != nil {
		repo.l.Errorf(ctx, "class.postgres.Update.buildUpdateClass", err)
		return models.Class{}, err
	}

	classID, err := uuid.Parse(id)
	if err != nil {
		repo.l.Errorf(ctx, "class.postgres.Update.ParseID", err)
		return models.Class{}, fmt.Errorf("invalid class ID: %w", err)
	}

	query := `
		UPDATE classes
		SET name = $1, description = $2, archived = $3, updated_at = $4
		WHERE id = $5 AND deleted_at IS NULL
		RETURNING id, name, description, code, avatar_url, created_by, archived, created_at, updated_at, deleted_at
	`

	now := time.Now()
	err = tx.QueryRow(ctx, query,
		cls.Name,
		cls.Description,
		cls.Archived,
		now,
		classID,
	).Scan(
		&cls.ID,
		&cls.Name,
		&cls.Description,
		&cls.Code,
		&cls.AvatarURL,
		&cls.CreatedBy,
		&cls.Archived,
		&cls.CreatedAt,
		&cls.UpdatedAt,
		&cls.DeletedAt,
	)

	if err != nil {
		repo.l.Errorf(ctx, "class.postgres.Update.QueryRow", err)
		return models.Class{}, err
	}

	return cls, nil
}

func (repo *implRepository) Delete(ctx context.Context, tx postgres.Tx, id string) (string, error) {
	classID, err := uuid.Parse(id)
	if err != nil {
		repo.l.Errorf(ctx, "class.postgres.Delete.ParseID", err)
		return "", fmt.Errorf("invalid class ID: %w", err)
	}

	query := `
		UPDATE classes
		SET deleted_at = $1
		WHERE id = $2 AND deleted_at IS NULL
	`

	now := time.Now()
	tag, err := tx.Exec(ctx, query, now, classID)
	if err != nil {
		repo.l.Errorf(ctx, "class.postgres.Delete.Exec", err)
		return "", err
	}

	if tag.RowsAffected() == 0 {
		return "", fmt.Errorf("class not found or already deleted")
	}

	return "Deleted", nil
}

// Member operations

func (repo *implRepository) AddMember(ctx context.Context, tx postgres.Tx, opts class.AddMemberOptions) (models.ClassMember, error) {
	member, err := repo.buildAddMember(opts)
	if err != nil {
		repo.l.Errorf(ctx, "class.postgres.AddMember.buildAddMember", err)
		return models.ClassMember{}, err
	}

	query := `
		INSERT INTO class_members (id, class_id, user_id, role, joined_at, created_at)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, class_id, user_id, role, joined_at, created_at, deleted_at
	`

	now := time.Now()
	err = tx.QueryRow(ctx, query,
		member.ID,
		member.ClassID,
		member.UserID,
		member.Role,
		now,
		now,
	).Scan(
		&member.ID,
		&member.ClassID,
		&member.UserID,
		&member.Role,
		&member.JoinedAt,
		&member.CreatedAt,
		&member.DeletedAt,
	)

	if err != nil {
		repo.l.Errorf(ctx, "class.postgres.AddMember.QueryRow", err)
		return models.ClassMember{}, err
	}

	return member, nil
}

func (repo *implRepository) RemoveMember(ctx context.Context, tx postgres.Tx, classID string, userID string) error {
	cid, err := uuid.Parse(classID)
	if err != nil {
		repo.l.Errorf(ctx, "class.postgres.RemoveMember.ParseClassID", err)
		return fmt.Errorf("invalid class ID: %w", err)
	}

	query := `
		UPDATE class_members
		SET deleted_at = $1
		WHERE class_id = $2 AND user_id = $3 AND deleted_at IS NULL
	`

	now := time.Now()
	tag, err := tx.Exec(ctx, query, now, cid, userID)
	if err != nil {
		repo.l.Errorf(ctx, "class.postgres.RemoveMember.Exec", err)
		return err
	}

	if tag.RowsAffected() == 0 {
		return fmt.Errorf("member not found or already removed")
	}

	return nil
}

func (repo *implRepository) ListMembers(ctx context.Context, classID string) ([]models.ClassMember, error) {
	cid, err := uuid.Parse(classID)
	if err != nil {
		repo.l.Errorf(ctx, "class.postgres.ListMembers.ParseClassID", err)
		return nil, fmt.Errorf("invalid class ID: %w", err)
	}

	query := `
		SELECT id, class_id, user_id, role, joined_at, created_at, deleted_at
		FROM class_members
		WHERE class_id = $1 AND deleted_at IS NULL
		ORDER BY joined_at ASC
	`

	rows, err := repo.db.Query(ctx, query, cid)
	if err != nil {
		repo.l.Errorf(ctx, "class.postgres.ListMembers.Query", err)
		return nil, err
	}
	defer rows.Close()

	var members []models.ClassMember
	for rows.Next() {
		var member models.ClassMember
		err := rows.Scan(
			&member.ID,
			&member.ClassID,
			&member.UserID,
			&member.Role,
			&member.JoinedAt,
			&member.CreatedAt,
			&member.DeletedAt,
		)
		if err != nil {
			repo.l.Errorf(ctx, "class.postgres.ListMembers.Scan", err)
			return nil, err
		}
		members = append(members, member)
	}

	if err := rows.Err(); err != nil {
		repo.l.Errorf(ctx, "class.postgres.ListMembers.Err", err)
		return nil, err
	}

	return members, nil
}

func (repo *implRepository) GetMember(ctx context.Context, classID string, userID string) (models.ClassMember, error) {
	cid, err := uuid.Parse(classID)
	if err != nil {
		repo.l.Errorf(ctx, "class.postgres.GetMember.ParseClassID", err)
		return models.ClassMember{}, fmt.Errorf("invalid class ID: %w", err)
	}

	query := `
		SELECT id, class_id, user_id, role, joined_at, created_at, deleted_at
		FROM class_members
		WHERE class_id = $1 AND user_id = $2 AND deleted_at IS NULL
		LIMIT 1
	`

	var member models.ClassMember
	err = repo.db.QueryRow(ctx, query, cid, userID).Scan(
		&member.ID,
		&member.ClassID,
		&member.UserID,
		&member.Role,
		&member.JoinedAt,
		&member.CreatedAt,
		&member.DeletedAt,
	)

	if err != nil {
		repo.l.Errorf(ctx, "class.postgres.GetMember.QueryRow", err)
		return models.ClassMember{}, err
	}

	return member, nil
}

func (repo *implRepository) IsMember(ctx context.Context, classID string, userID string) (bool, error) {
	cid, err := uuid.Parse(classID)
	if err != nil {
		repo.l.Errorf(ctx, "class.postgres.IsMember.ParseClassID", err)
		return false, fmt.Errorf("invalid class ID: %w", err)
	}

	query := `
		SELECT EXISTS(
			SELECT 1 FROM class_members
			WHERE class_id = $1 AND user_id = $2 AND deleted_at IS NULL
		)
	`

	var exists bool
	err = repo.db.QueryRow(ctx, query, cid, userID).Scan(&exists)
	if err != nil {
		repo.l.Errorf(ctx, "class.postgres.IsMember.QueryRow", err)
		return false, err
	}

	return exists, nil
}
