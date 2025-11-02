package projection

// ConversationMetaFields represents conversation metadata fields
type ConversationMetaFields struct {
	Type          string
	Name          string
	LastMsgID     string
	LastMsgText   string
	LastMsgAt     int64
	LastMsgSender string
}

// MessageCacheFields represents message cache fields
type MessageCacheFields struct {
	ID             string
	ConversationID string
	SenderID       string
	Seq            int64
	Content        string
	CreatedAt      string
	ReplyToID      string
	EditedAt       string
}

// PresenceStatus represents user online status
type PresenceStatus string

const (
	PresenceOnline PresenceStatus = "online"
	PresenceAway   PresenceStatus = "away"
	PresenceOffline PresenceStatus = "offline"
)
