package projection

import "time"

// ConversationMeta represents conversation metadata stored in Redis
type ConversationMeta struct {
	Type           string
	Name           string
	LastMsgID      string
	LastMsgText    string
	LastMsgAt      int64 // Unix milliseconds
	LastMsgSender  string
}

// MessageCache represents a message stored in Redis cache
type MessageCache struct {
	ID             string
	ConversationID string
	SenderID       string
	Seq            int64
	Content        string
	CreatedAt      string
	ReplyToID      string
	EditedAt       string
}

const (
	// TTLs
	MessageCacheTTL = 30 * 24 * time.Hour // 30 days

	// Limits
	ConversationListLimit = 500 // Max conversations per user in sorted set
	MessageTextPreview    = 100 // Max chars for last_msg_text
)
