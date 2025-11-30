package models

import (
	"time"

	"github.com/google/uuid"
)

// Post represents a forum post
type Post struct {
	ID         uuid.UUID  `db:"id" json:"id"`
	Title      string     `db:"title" json:"title"`
	Content    string     `db:"content" json:"content"`
	AuthorID   string     `db:"author_id" json:"author_id"`
	Tags       []string   `db:"tags" json:"tags"`
	Views      int        `db:"views" json:"views"`
	Upvotes    int        `db:"upvotes" json:"upvotes"`
	Downvotes  int        `db:"downvotes" json:"downvotes"`
	IsAnswered bool       `json:"is_answered"` // Derived field
	CreatedAt  time.Time  `db:"created_at" json:"created_at"`
	UpdatedAt  time.Time  `db:"updated_at" json:"updated_at"`
	DeletedAt  *time.Time `db:"deleted_at" json:"deleted_at,omitempty"`
}

// Comment represents a comment on a post
type Comment struct {
	ID         uuid.UUID  `db:"id" json:"id"`
	PostID     uuid.UUID  `db:"post_id" json:"post_id"`
	Content    string     `db:"content" json:"content"`
	AuthorID   string     `db:"author_id" json:"author_id"`
	IsAccepted bool       `db:"is_accepted" json:"is_accepted"`
	Upvotes    int        `db:"upvotes" json:"upvotes"`
	Downvotes  int        `db:"downvotes" json:"downvotes"`
	CreatedAt  time.Time  `db:"created_at" json:"created_at"`
	UpdatedAt  time.Time  `db:"updated_at" json:"updated_at"`
	DeletedAt  *time.Time `db:"deleted_at" json:"deleted_at,omitempty"`
}

// Vote represents a user's vote on a post or comment
type Vote struct {
	UserID    string    `db:"user_id" json:"user_id"`
	TargetID  uuid.UUID `db:"target_id" json:"target_id"`
	Type      string    `db:"type" json:"type"`   // 'post' or 'comment'
	Value     int       `db:"value" json:"value"` // 1 or -1
	CreatedAt time.Time `db:"created_at" json:"created_at"`
}
