package asynq

import (
	"init-src/pkg/asynq"
)

// RegisterNotificationHandlers registers notification task handlers with Asynq server
func RegisterNotificationHandlers(s *asynq.Server, h Handler) {
	s.HandleFunc(asynq.TaskNotifyNewMessage, h.HandleNewMessage)
	s.HandleFunc(asynq.TaskNotifyClassInvite, h.HandleClassInvite)
}