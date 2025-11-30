package message

import (
	"init-src/internal/models"
)

// SenderDetails represents the details of a message sender
type SenderDetails struct {
	ID     string `json:"id"`
	Name   string `json:"name"`
	Avatar string `json:"avatar"`
	Role   string `json:"role"`
}

// MessageWithSender combines Message with SenderDetails
type MessageWithSender struct {
	models.Message
	Sender SenderDetails `json:"sender"`
}