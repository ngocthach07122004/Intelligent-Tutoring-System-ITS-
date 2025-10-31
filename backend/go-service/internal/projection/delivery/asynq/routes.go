package asynq

import (
	"init-src/pkg/asynq"
)

func RegisterProjectionHandlers(s *asynq.Server, h Handler) {
	s.HandleFunc(asynq.TaskProjectMessage,      h.HandleMessage)
	s.HandleFunc(asynq.TaskProjectConversation, h.HandleConversation)
}