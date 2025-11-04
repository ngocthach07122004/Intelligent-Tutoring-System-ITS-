package asynq

// Task type constants
const (
	// Projection tasks
	TaskProjectMessage      = "projection:message"
	TaskProjectConversation = "projection:conversation"

	// Notification tasks
	TaskNotifyNewMessage  = "notify:new_message"
	TaskNotifyClassInvite = "notify:class_invite"
)

// Queue names
const (
	QueueCritical = "critical"
	QueueDefault  = "default"
	QueueLow      = "low"
)
