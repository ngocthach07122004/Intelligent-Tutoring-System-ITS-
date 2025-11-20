package models

import (
	"time"

	"github.com/google/uuid"
)

// ClassMemberRole represents the role of a member in a class
type ClassMemberRole string

const (
	RoleTeacher  ClassMemberRole = "teacher"
	RoleStudent  ClassMemberRole = "student"
	RoleTA       ClassMemberRole = "ta"
	RoleObserver ClassMemberRole = "observer"
)

// Class represents a learning class/course
type Class struct {
	ID          uuid.UUID  `db:"id" json:"id"`
	Name        string     `db:"name" json:"name"`
	Description string     `db:"description" json:"description"`
	Code        string     `db:"code" json:"code"` // Invite code (e.g., "CS101-2025")
	CreatedBy   string     `db:"created_by" json:"created_by"` // MongoDB User ID
	Archived    bool       `db:"archived" json:"archived"`
	CreatedAt   time.Time  `db:"created_at" json:"created_at"`
	UpdatedAt   time.Time  `db:"updated_at" json:"updated_at"`
	DeletedAt   *time.Time `db:"deleted_at" json:"deleted_at,omitempty"`
}

// ClassMember represents a member of a class
type ClassMember struct {
	ID        uuid.UUID       `db:"id" json:"id"`
	ClassID   uuid.UUID       `db:"class_id" json:"class_id"`
	UserID    string          `db:"user_id" json:"user_id"` // MongoDB User ID
	Role      ClassMemberRole `db:"role" json:"role"`
	JoinedAt  time.Time       `db:"joined_at" json:"joined_at"`
	CreatedAt time.Time       `db:"created_at" json:"created_at"`
	DeletedAt *time.Time      `db:"deleted_at" json:"deleted_at,omitempty"`
}
