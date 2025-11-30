package usecase

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"init-src/internal/class"
	"init-src/internal/models"
	"init-src/internal/outbox"
	"init-src/pkg/util"
)

func (uc *implUsecase) Create(ctx context.Context, sc models.Scope, input class.CreateInput) (models.Class, error) {
	// Validate input
	if strings.TrimSpace(input.Name) == "" {
		return models.Class{}, fmt.Errorf("class name cannot be empty")
	}

	// Generate unique code
	code := uc.generateClassCode(input.Name)

	// Begin transaction
	tx, err := uc.db.BeginTx(ctx)
	if err != nil {
		uc.l.Warnf(ctx, "class.Usecase.Create.BeginTx error: %v", err)
		return models.Class{}, err
	}
	defer tx.Rollback(ctx)

	// Create class
	cls, err := uc.repo.Create(ctx, tx, class.CreateOptions{
		Name:        input.Name,
		Description: input.Description,
		Code:        code,
		CreatedBy:   sc.UserID,
	})
	if err != nil {
		uc.l.Warnf(ctx, "class.Usecase.Create error: %v", err)
		return models.Class{}, err
	}

	// Add creator as teacher
	_, err = uc.repo.AddMember(ctx, tx, class.AddMemberOptions{
		ClassID: cls.ID.String(),
		UserID:  sc.UserID,
		Role:    models.RoleTeacher,
	})
	if err != nil {
		uc.l.Warnf(ctx, "class.Usecase.Create.AddMember error: %v", err)
		return models.Class{}, err
	}

	// Create outbox event
	eventPayload := map[string]interface{}{
		"class": cls,
		"timestamp": time.Now().Format(time.RFC3339),
	}
	payloadJSON, _ := json.Marshal(eventPayload)

	_, err = uc.outboxRepo.Create(ctx, tx, outbox.CreateOptions{
		AggregateType: "class",
		AggregateID:   cls.ID,
		EventType:     models.EventClassCreated,
		Payload:       string(payloadJSON),
	})
	if err != nil {
		uc.l.Warnf(ctx, "class.Usecase.Create.CreateOutbox error: %v", err)
		return models.Class{}, err
	}

	// Commit transaction
	if err := tx.Commit(ctx); err != nil {
		uc.l.Warnf(ctx, "class.Usecase.Create.Commit error: %v", err)
		return models.Class{}, err
	}

	return cls, nil
}

func (uc *implUsecase) List(ctx context.Context, sc models.Scope, input class.ListInput) ([]models.Class, error) {
	// Automatically filter by user's classes (as member)
	input.Filter.MemberID = sc.UserID

	classes, err := uc.repo.List(ctx, sc, input)
	if err != nil {
		uc.l.Warnf(ctx, "class.Usecase.List error: %v", err)
		return nil, err
	}

	return classes, nil
}

func (uc *implUsecase) Get(ctx context.Context, sc models.Scope, input class.GetInput) (class.GetOutput, error) {
	// Automatically filter by user's classes (as member)
	input.Filter.MemberID = sc.UserID

	classes, pag, err := uc.repo.Get(ctx, sc, input)
	if err != nil {
		uc.l.Warnf(ctx, "class.Usecase.Get error: %v", err)
		return class.GetOutput{}, err
	}

	return class.GetOutput{
		Classes: classes,
		Pagin:   pag,
	}, nil
}

func (uc *implUsecase) GetOne(ctx context.Context, sc models.Scope, input class.GetOneInput) (class.GetOneOutput, error) {
	cls, err := uc.repo.GetOne(ctx, sc, input)
	if err != nil {
		uc.l.Warnf(ctx, "class.Usecase.GetOne error: %v", err)
		if err.Error() == "sql: no rows in result set" {
			return class.GetOneOutput{}, ErrNotFound
		}
		return class.GetOneOutput{}, err
	}

	return class.GetOneOutput{
		Class: cls,
	}, nil
}

func (uc *implUsecase) Update(ctx context.Context, sc models.Scope, id string, input class.UpdateInput) (models.Class, error) {
	// Get existing class
	cls, err := uc.repo.GetOne(ctx, sc, class.GetOneInput{
		Filter: class.Filter{ID: id},
	})
	if err != nil {
		uc.l.Warnf(ctx, "class.Usecase.Update.GetOne error: %v", err)
		if err.Error() == "sql: no rows in result set" {
			return models.Class{}, ErrNotFound
		}
		return models.Class{}, err
	}

	// Check if user is teacher
	member, err := uc.repo.GetMember(ctx, id, sc.UserID)
	if err != nil || member.Role != models.RoleTeacher {
		uc.l.Warnf(ctx, "class.Usecase.Update: user not authorized")
		return models.Class{}, ErrNotTeacher
	}

	// Begin transaction
	tx, err := uc.db.BeginTx(ctx)
	if err != nil {
		uc.l.Warnf(ctx, "class.Usecase.Update.BeginTx error: %v", err)
		return models.Class{}, err
	}
	defer tx.Rollback(ctx)

	// Update class
	updated, err := uc.repo.Update(ctx, tx, id, class.UpdateOptions{
		Class:       cls,
		Name:        input.Name,
		Description: input.Description,
		Archived:    input.Archived,
	})
	if err != nil {
		uc.l.Warnf(ctx, "class.Usecase.Update error: %v", err)
		return models.Class{}, err
	}

	// Commit transaction
	if err := tx.Commit(ctx); err != nil {
		uc.l.Warnf(ctx, "class.Usecase.Update.Commit error: %v", err)
		return models.Class{}, err
	}

	return updated, nil
}

func (uc *implUsecase) Delete(ctx context.Context, sc models.Scope, id string) (string, error) {
	// Check if user is teacher
	member, err := uc.repo.GetMember(ctx, id, sc.UserID)
	if err != nil || member.Role != models.RoleTeacher {
		uc.l.Warnf(ctx, "class.Usecase.Delete: user not authorized")
		return "", ErrNotTeacher
	}

	// Begin transaction
	tx, err := uc.db.BeginTx(ctx)
	if err != nil {
		uc.l.Warnf(ctx, "class.Usecase.Delete.BeginTx error: %v", err)
		return "", err
	}
	defer tx.Rollback(ctx)

	// Delete class (soft delete)
	msg, err := uc.repo.Delete(ctx, tx, id)
	if err != nil {
		uc.l.Warnf(ctx, "class.Usecase.Delete error: %v", err)
		return "", err
	}

	// Commit transaction
	if err := tx.Commit(ctx); err != nil {
		uc.l.Warnf(ctx, "class.Usecase.Delete.Commit error: %v", err)
		return "", err
	}

	return msg, nil
}

// Member operations

func (uc *implUsecase) AddMember(ctx context.Context, sc models.Scope, classID string, input class.AddMemberInput) (models.ClassMember, error) {
	// Check if user is teacher
	caller, err := uc.repo.GetMember(ctx, classID, sc.UserID)
	if err != nil || caller.Role != models.RoleTeacher {
		uc.l.Warnf(ctx, "class.Usecase.AddMember: user not authorized")
		return models.ClassMember{}, ErrNotTeacher
	}

	// Check if member already exists
	exists, err := uc.repo.IsMember(ctx, classID, input.UserID)
	if err != nil {
		uc.l.Warnf(ctx, "class.Usecase.AddMember.IsMember error: %v", err)
		return models.ClassMember{}, err
	}
	if exists {
		return models.ClassMember{}, ErrMemberExists
	}

	// Begin transaction
	tx, err := uc.db.BeginTx(ctx)
	if err != nil {
		uc.l.Warnf(ctx, "class.Usecase.AddMember.BeginTx error: %v", err)
		return models.ClassMember{}, err
	}
	defer tx.Rollback(ctx)

	// Add member
	member, err := uc.repo.AddMember(ctx, tx, class.AddMemberOptions{
		ClassID: classID,
		UserID:  input.UserID,
		Role:    input.Role,
	})
	if err != nil {
		uc.l.Warnf(ctx, "class.Usecase.AddMember error: %v", err)
		return models.ClassMember{}, err
	}

	// Create outbox event
	eventPayload := map[string]interface{}{
		"class_id": classID,
		"member":   member,
		"timestamp": time.Now().Format(time.RFC3339),
	}
	payloadJSON, _ := json.Marshal(eventPayload)

	_, err = uc.outboxRepo.Create(ctx, tx, outbox.CreateOptions{
		AggregateType: "class",
		AggregateID:   member.ClassID,
		EventType:     models.EventClassMemberAdded,
		Payload:       string(payloadJSON),
	})
	if err != nil {
		uc.l.Warnf(ctx, "class.Usecase.AddMember.CreateOutbox error: %v", err)
		return models.ClassMember{}, err
	}

	// Commit transaction
	if err := tx.Commit(ctx); err != nil {
		uc.l.Warnf(ctx, "class.Usecase.AddMember.Commit error: %v", err)
		return models.ClassMember{}, err
	}

	return member, nil
}

func (uc *implUsecase) RemoveMember(ctx context.Context, sc models.Scope, classID string, userID string) (string, error) {
	// Check if user is teacher
	caller, err := uc.repo.GetMember(ctx, classID, sc.UserID)
	if err != nil || caller.Role != models.RoleTeacher {
		uc.l.Warnf(ctx, "class.Usecase.RemoveMember: user not authorized")
		return "", ErrNotTeacher
	}

	// Cannot remove self if you're the only teacher
	// (Add this check later if needed)

	// Begin transaction
	tx, err := uc.db.BeginTx(ctx)
	if err != nil {
		uc.l.Warnf(ctx, "class.Usecase.RemoveMember.BeginTx error: %v", err)
		return "", err
	}
	defer tx.Rollback(ctx)

	// Remove member
	err = uc.repo.RemoveMember(ctx, tx, classID, userID)
	if err != nil {
		uc.l.Warnf(ctx, "class.Usecase.RemoveMember error: %v", err)
		return "", err
	}

	// Create outbox event
	eventPayload := map[string]interface{}{
		"class_id":  classID,
		"user_id":   userID,
		"timestamp": time.Now().Format(time.RFC3339),
	}
	payloadJSON, _ := json.Marshal(eventPayload)

	_, err = uc.outboxRepo.Create(ctx, tx, outbox.CreateOptions{
		AggregateType: "class",
		AggregateID:   caller.ClassID,
		EventType:     models.EventClassMemberRemoved,
		Payload:       string(payloadJSON),
	})
	if err != nil {
		uc.l.Warnf(ctx, "class.Usecase.RemoveMember.CreateOutbox error: %v", err)
		return "", err
	}

	// Commit transaction
	if err := tx.Commit(ctx); err != nil {
		uc.l.Warnf(ctx, "class.Usecase.RemoveMember.Commit error: %v", err)
		return "", err
	}

	return "Member removed", nil
}

func (uc *implUsecase) ListMembers(ctx context.Context, sc models.Scope, classID string) ([]models.ClassMember, error) {
	// Check if user is member of this class
	isMember, err := uc.repo.IsMember(ctx, classID, sc.UserID)
	if err != nil {
		uc.l.Warnf(ctx, "class.Usecase.ListMembers.IsMember error: %v", err)
		return nil, err
	}
	if !isMember {
		return nil, ErrForbidden
	}

	members, err := uc.repo.ListMembers(ctx, classID)
	if err != nil {
		uc.l.Warnf(ctx, "class.Usecase.ListMembers error: %v", err)
		return nil, err
	}

	return members, nil
}

func (uc *implUsecase) JoinByCode(ctx context.Context, sc models.Scope, code string) (models.Class, error) {
	// Get class by code
	cls, err := uc.repo.GetByCode(ctx, code)
	if err != nil {
		uc.l.Warnf(ctx, "class.Usecase.JoinByCode.GetByCode error: %v", err)
		if err.Error() == "sql: no rows in result set" {
			return models.Class{}, ErrNotFound
		}
		return models.Class{}, err
	}

	// Check if already a member
	isMember, err := uc.repo.IsMember(ctx, cls.ID.String(), sc.UserID)
	if err != nil {
		uc.l.Warnf(ctx, "class.Usecase.JoinByCode.IsMember error: %v", err)
		return models.Class{}, err
	}
	if isMember {
		return cls, nil // Already a member, return class
	}

	// Begin transaction
	tx, err := uc.db.BeginTx(ctx)
	if err != nil {
		uc.l.Warnf(ctx, "class.Usecase.JoinByCode.BeginTx error: %v", err)
		return models.Class{}, err
	}
	defer tx.Rollback(ctx)

	// Add as student
	member, err := uc.repo.AddMember(ctx, tx, class.AddMemberOptions{
		ClassID: cls.ID.String(),
		UserID:  sc.UserID,
		Role:    models.RoleStudent,
	})
	if err != nil {
		uc.l.Warnf(ctx, "class.Usecase.JoinByCode.AddMember error: %v", err)
		return models.Class{}, err
	}

	// Create outbox event
	eventPayload := map[string]interface{}{
		"class_id": cls.ID.String(),
		"member":   member,
		"timestamp": time.Now().Format(time.RFC3339),
	}
	payloadJSON, _ := json.Marshal(eventPayload)

	_, err = uc.outboxRepo.Create(ctx, tx, outbox.CreateOptions{
		AggregateType: "class",
		AggregateID:   cls.ID,
		EventType:     models.EventClassMemberAdded,
		Payload:       string(payloadJSON),
	})
	if err != nil {
		uc.l.Warnf(ctx, "class.Usecase.JoinByCode.CreateOutbox error: %v", err)
		return models.Class{}, err
	}

	// Commit transaction
	if err := tx.Commit(ctx); err != nil {
		uc.l.Warnf(ctx, "class.Usecase.JoinByCode.Commit error: %v", err)
		return models.Class{}, err
	}

	return cls, nil
}

// Helper functions

func (uc *implUsecase) generateClassCode(name string) string {
	// Generate code like: "CS101-2025-ABC123"
	prefix := util.BuildCode(name)
	if len(prefix) > 6 {
		prefix = prefix[:6]
	}
	year := time.Now().Year()
	random := util.BuildAlias(fmt.Sprintf("%d-%d", time.Now().UnixNano(), year))
	if len(random) > 6 {
		random = random[:6]
	}

	code := fmt.Sprintf("%s-%d-%s", strings.ToUpper(prefix), year, strings.ToUpper(random))
	return code
}
