package websocket

import (
	"github.com/coder/websocket"
)

// StatusCode represents a WebSocket status code
type StatusCode int

// WebSocket status codes
const (
	StatusNormalClosure   StatusCode = 1000
	StatusGoingAway       StatusCode = 1001
	StatusProtocolError   StatusCode = 1002
	StatusUnsupportedData StatusCode = 1003
	StatusNoStatusRcvd    StatusCode = 1005
	StatusAbnormalClosure StatusCode = 1006
	StatusInvalidPayload  StatusCode = 1007
	StatusPolicyViolation StatusCode = 1008
	StatusMessageTooBig   StatusCode = 1009
	StatusMandatoryExt    StatusCode = 1010
	StatusInternalError   StatusCode = 1011
	StatusServiceRestart  StatusCode = 1012
	StatusTryAgainLater   StatusCode = 1013
	StatusBadGateway      StatusCode = 1014
	StatusTLSHandshake    StatusCode = 1015
)

// MessageType represents the type of a WebSocket message
type MessageType int

// WebSocket message types
const (
	MessageText   MessageType = 1
	MessageBinary MessageType = 2
)

// CloseStatus returns the status code of a close error
// Returns -1 if the error is not a close error
func CloseStatus(err error) StatusCode {
	code := websocket.CloseStatus(err)
	return StatusCode(code)
}
