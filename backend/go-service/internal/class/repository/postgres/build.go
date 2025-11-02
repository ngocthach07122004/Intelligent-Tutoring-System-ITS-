package postgres

import (
	"fmt"

	"init-src/internal/class"
	"init-src/internal/models"

	"github.com/google/uuid"
)

func (repo *implRepository) buildCreateClass(opts class.CreateOptions) (models.Class, error) {
	cls := models.Class{
		ID:          uuid.New(),
		Name:        opts.Name,
		Description: opts.Description,
		Code:        opts.Code,
		CreatedBy:   opts.CreatedBy,
		Archived:    false,
	}

	return cls, nil
}

func (repo *implRepository) buildUpdateClass(opts class.UpdateOptions) (models.Class, error) {
	// Update fields
	opts.Class.Name = opts.Name
	opts.Class.Description = opts.Description
	opts.Class.Archived = opts.Archived

	return opts.Class, nil
}

func (repo *implRepository) buildAddMember(opts class.AddMemberOptions) (models.ClassMember, error) {
	classID, err := uuid.Parse(opts.ClassID)
	if err != nil {
		return models.ClassMember{}, fmt.Errorf("invalid class ID: %w", err)
	}

	member := models.ClassMember{
		ID:      uuid.New(),
		ClassID: classID,
		UserID:  opts.UserID,
		Role:    opts.Role,
	}

	return member, nil
}
