package forum

import (
	"init-src/pkg/paginator"
	"time"

	"github.com/google/uuid"
)

type CreatePostInput struct {
	Title   string
	Content string
	Tags    []string
	UserID  string
}

type ListPostsOutput struct {
	Posts []PostResponse
	Pagin paginator.Paginator
}

type CreateCommentInput struct {
	PostID  string
	Content string
	UserID  string
}

type VoteInput struct {
	TargetID string
	Type     string
	Value    int
	UserID   string
}

// PostResponse (List View)
type PostResponse struct {
	ID           uuid.UUID `json:"id"`
	Title        string    `json:"title"`
	Content      string    `json:"content"`
	AuthorID     string    `json:"author_id"`
	AuthorName   string    `json:"author_name"`
	AuthorAvatar string    `json:"author_avatar"`
	Tags         []string  `json:"tags"`
	Views        int       `json:"views"`
	Upvotes      int       `json:"upvotes"`
	Downvotes    int       `json:"downvotes"`
	CommentCount int       `json:"comment_count"`
	IsAnswered   bool      `json:"is_answered"`
	VoteScore    int       `json:"vote_score"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type CommentResponse struct {
	ID           uuid.UUID `json:"id"`
	PostID       uuid.UUID `json:"post_id"`
	Content      string    `json:"content"`
	AuthorID     string    `json:"author_id"`
	AuthorName   string    `json:"author_name"`
	AuthorAvatar string    `json:"author_avatar"`
	IsAccepted   bool      `json:"is_accepted"`
	VoteScore    int       `json:"vote_score"`
	CreatedAt    time.Time `json:"created_at"`
}

type PostDetailResponse struct {
	Post     PostResponse      `json:"post"`
	Comments []CommentResponse `json:"comments"`
}
