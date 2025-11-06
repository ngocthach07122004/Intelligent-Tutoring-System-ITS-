package usecase

import (
	"context"
	"time"
)

const (
	// TypingTTL is the TTL for typing indicator keys (10 seconds)
	TypingTTL = 10 * time.Second
)

// SetTyping sets typing indicator for a user in a conversation
func (uc *implUsecase) SetTyping(ctx context.Context, conversationID string, userID string) error {
	if err := uc.repo.SetTyping(ctx, conversationID, userID, int64(TypingTTL.Seconds())); err != nil {
		uc.l.Errorf(ctx, "projection.usecase.SetTyping.SetTyping", err)
		return err
	}

	uc.l.Debugf(ctx, "projection.usecase.SetTyping: conv=%s, user=%s", conversationID, userID)
	return nil
}

// GetTypingUsers gets all users currently typing in a conversation
func (uc *implUsecase) GetTypingUsers(ctx context.Context, conversationID string) ([]string, error) {
	userIDs, err := uc.repo.GetTypingUsers(ctx, conversationID)
	if err != nil {
		uc.l.Errorf(ctx, "projection.usecase.GetTypingUsers.GetTypingUsers", err)
		return nil, err
	}

	uc.l.Debugf(ctx, "projection.usecase.GetTypingUsers: conv=%s, count=%d", conversationID, len(userIDs))
	return userIDs, nil
}
