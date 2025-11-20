package usecase

import (
	"context"

	"init-src/internal/models"
	"init-src/internal/user"
)

func (uc implUsecase) buildGetFilter(u models.User, input *user.Filter) {
	switch u.Role {
	case models.RoleAdmin:
		return
	case models.RoleManager:
		input.ShopID = u.ShopID.Hex()
	case models.RoleRegionManager:
		input.RegionID = u.RegionID.Hex()
	case models.RoleBranchManager, models.RoleEmployee:
		input.BranchID = u.BranchID.Hex()
	case models.RoleHeadOfDept:
		input.DepartmentID = u.DepartmentID.Hex()
	}
}

func (uc implUsecase) ComparePassword(ctx context.Context, hashedPassword string, plainPassword string) error {
	decryptedPW, err := uc.encrypter.Decrypt(hashedPassword)
	if err != nil {
		uc.l.Warnf(ctx, "user.usecase.ComparePassword.Decrypt: %v", err)
		return ErrPasswordIncorrect
	}

	if decryptedPW != plainPassword {
		return ErrPasswordIncorrect
	}

	return nil
}
