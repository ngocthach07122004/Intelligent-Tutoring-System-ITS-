package usecase

import (
	"context"
	"time"
)

const (
	// PresenceTTL is the TTL for presence keys (90 seconds)
	PresenceTTL = 90 * time.Second
)

// SetUserPresence sets user presence status with TTL
func (uc *implUsecase) SetUserPresence(ctx context.Context, userID string, status string) error {
	if err := uc.repo.SetPresence(ctx, userID, status, int64(PresenceTTL.Seconds())); err != nil {
		uc.l.Errorf(ctx, "projection.usecase.SetUserPresence.SetPresence", err)
		return err
	}

	uc.l.Debugf(ctx, "projection.usecase.SetUserPresence: user=%s, status=%s", userID, status)
	return nil
}

// GetUserPresence gets user presence status
// Returns "offline" if key doesn't exist (TTL expired)
func (uc *implUsecase) GetUserPresence(ctx context.Context, userID string) (string, error) {
	status, err := uc.repo.GetPresence(ctx, userID)
	if err != nil {
		// Key doesn't exist = offline
		return "offline", nil
	}

	return status, nil
}
