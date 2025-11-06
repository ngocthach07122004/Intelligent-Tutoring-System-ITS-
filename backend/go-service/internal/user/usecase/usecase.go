package usecase

import (
	"context"
	"errors"

	"init-src/internal/branch"
	"init-src/internal/department"
	"init-src/internal/models"
	"init-src/internal/region"
	"init-src/internal/shop"
	"init-src/internal/user"

	"golang.org/x/sync/errgroup"

	customJwt "init-src/pkg/jwt"
	"init-src/pkg/mongo"
)

func (uc implUsecase) SignUp(ctx context.Context, sc models.Scope, input user.SignUpInput) (models.User, error) {
	shopOpts := shop.CreateInput{
		Name: input.ShopName,
	}

	newShop, err := uc.shopUC.Create(ctx, sc, shopOpts)
	if err != nil {
		uc.l.Warnf(ctx, "user.usecase.SignUp.CreateShop: %v", err)
		return models.User{}, err
	}

	encryptedPW, err := uc.encrypter.Encrypt(input.Password)
	if err != nil {
		uc.l.Warnf(ctx, "user.usecase.SignUp.Encrypt: %v", err)
		return models.User{}, ErrEncryptPassword
	}

	opts := user.CreateOptions{
		Username: input.Username,
		Email:    input.Email,
		Password: encryptedPW,
		Role:     models.RoleManager,
		ShopID:   newShop.ID.Hex(),
	}

	newUser, err := uc.repo.Create(ctx, sc, opts)
	if err != nil {
		uc.l.Warnf(ctx, "user.usecase.SignUp.Create: %v", err)
		return models.User{}, err
	}

	return newUser, nil
}

func (uc implUsecase) Login(ctx context.Context, input user.LoginInput) (string, error) {
	u, err := uc.repo.GetOne(ctx, models.Scope{}, user.GetOneInput{Filter: user.Filter{Email: input.Email, ShopID: input.ShopID}})
	if err != nil {
		uc.l.Warnf(ctx, "user.usecase.Login.FindByEmail: %v", err)
		if errors.Is(err, mongo.ErrNoDocuments) {
			return "", ErrEmailNotFound
		}
		return "", err
	}

	err = uc.ComparePassword(ctx, u.Password, input.Password)
	if err != nil {
		uc.l.Warnf(ctx, "Login failed - incorrect password for email: %s", input.Email)
		return "", ErrPasswordIncorrect
	}

	accessToken, err := uc.jwtManager.Sign(
		customJwt.Payload{
			UserID: u.ID.Hex(),
			ShopID: input.ShopID,
			Type:   "access",
		},
	)
	if err != nil {
		uc.l.Warnf(ctx, "user.usecase.Login.Sign: %v", err)
		return "", ErrJWT
	}

	return accessToken, nil
}

func (uc implUsecase) List(ctx context.Context, scope models.Scope, input user.ListInput) ([]models.User, error) {
	users, err := uc.repo.List(ctx, scope, input)
	if err != nil {
		uc.l.Warnf(ctx, "user.usecase.List.List: %v", err)
		return nil, err
	}

	return users, nil
}

func (uc implUsecase) GetOne(ctx context.Context, scope models.Scope, input user.GetOneInput) (models.User, error) {
	u, err := uc.repo.GetOne(ctx, scope, input)
	if err != nil {
		uc.l.Warnf(ctx, "user.usecase.GetOne.GetOne: %v", err)
		if errors.Is(err, mongo.ErrNoDocuments) || errors.Is(err, mongo.ErrInvalidObjectID) {
			return models.User{}, ErrUserNotFound
		}
		return models.User{}, err
	}

	return u, nil
}

func (uc implUsecase) Get(ctx context.Context, scope models.Scope, input user.GetInput) (user.GetOutPut, error) {
	calU := ctx.Value("user").(models.User)
	uc.buildGetFilter(calU, &input.Filter)

	users, paginRes, err := uc.repo.Get(ctx, scope, input)
	if err != nil {
		uc.l.Warnf(ctx, "user.usecase.Get.Get: %v", err)
		return user.GetOutPut{}, err
	}

	var shops []models.Shop
	var regions []models.Region
	var branches []models.Branch
	var departments []models.Department

	g, gctx := errgroup.WithContext(ctx)

	g.Go(func() error {
		shopIDs := make(map[string]struct{}, len(users))
		for _, u := range users {
			if u.ShopID == nil {
				continue
			}
			shopIDs[u.ShopID.Hex()] = struct{}{}
		}
		for shopID := range shopIDs {
			output, err := uc.shopUC.GetOne(gctx, scope, shop.GetOneInput{
				Filter: shop.Filter{
					ID: shopID,
				}})
			if err != nil {
				return err
			}
			shops = append(shops, output.Shop)
		}

		return nil
	})

	g.Go(func() error {
		regionIDs := make(map[string]struct{}, len(users))
		for _, u := range users {
			if u.RegionID == nil {
				continue
			}
			regionIDs[u.RegionID.Hex()] = struct{}{}
		}
		for regionID := range regionIDs {
			output, err := uc.regionUC.GetOne(gctx, scope, region.GetOneInput{
				Filter: region.Filter{
					ID: regionID,
				}})
			if err != nil {
				return err
			}
			regions = append(regions, output.Region)
		}

		return nil
	})

	g.Go(func() error {
		branchIDs := make(map[string]struct{}, len(users))
		for _, u := range users {
			if u.BranchID == nil {
				continue
			}
			branchIDs[u.BranchID.Hex()] = struct{}{}
		}
		for branchID := range branchIDs {
			output, err := uc.branchUC.GetOne(gctx, scope, branch.GetOneInput{
				Filter: branch.Filter{
					ID: branchID,
				}})
			if err != nil {
				return err
			}
			branches = append(branches, output.Branch)
		}

		return nil
	})

	g.Go(func() error {
		departmentIDs := make(map[string]struct{}, len(users))
		for _, u := range users {
			if u.DepartmentID == nil {
				continue
			}
			departmentIDs[u.DepartmentID.Hex()] = struct{}{}
		}
		for departmentID := range departmentIDs {
			output, err := uc.deptUC.GetOne(gctx, scope, department.GetOneInput{
				Filter: department.Filter{
					ID: departmentID,
				}})
			if err != nil {
				return err
			}
			departments = append(departments, output.Department)
		}

		return nil
	})

	if err := g.Wait(); err != nil {
		uc.l.Warnf(ctx, "user.usecase.Get.Get: %v", err)
		return user.GetOutPut{}, ErrDataFetch
	}

	output := user.GetOutPut{
		Users:       users,
		Pagin:       paginRes,
		Shops:       shops,
		Regions:     regions,
		Branches:    branches,
		Departments: departments,
	}

	return output, nil
}

func (uc implUsecase) UpdatePassword(ctx context.Context, scope models.Scope, id string, input user.UpdateInput) (models.User, error) {
	calU := ctx.Value("user").(models.User)

	if calU.ID.Hex() != id {
		uc.l.Warnf(ctx, "user.usecase.UpdatePassword.ID: %v forbidden", calU.ID.Hex())
		return models.User{}, ErrForbidden
	}

	encryptedPW, err := uc.encrypter.Encrypt(input.Password)
	if err != nil {
		uc.l.Warnf(ctx, "user.usecase.UpdatePassword.Encrypt: %v", err)
		return models.User{}, ErrEncryptPassword
	}

	opts := user.UpdateOptions{
		User:     calU,
		Password: encryptedPW,
	}

	u, err := uc.repo.Update(ctx, scope, id, opts)
	if err != nil {
		uc.l.Warnf(ctx, "user.usecase.UpdatePassword.Update: %v", err)
		return models.User{}, err
	}

	return u, nil
}

func (uc implUsecase) Update(ctx context.Context, scope models.Scope, id string, input user.UpdateInput) (models.User, error) {
	calU := ctx.Value("user").(models.User)
	tarU, err := uc.repo.GetOne(ctx, scope, user.GetOneInput{Filter: user.Filter{ID: id}})
	if err != nil {
		uc.l.Warnf(ctx, "user.usecase.Update.GetOne: %v", err)
		if errors.Is(err, mongo.ErrNoDocuments) || errors.Is(err, mongo.ErrInvalidObjectID) {
			return models.User{}, ErrUserNotFound
		}
		return models.User{}, err
	}

	if cRole, ok := models.RoleRank[calU.Role]; ok {
		if inputRole, ok := models.RoleRank[input.Role]; ok {
			if cRole < inputRole {
				uc.l.Warnf(ctx, "user.usecase.Update.Role: %v forbidden", calU.Role)
				return models.User{}, ErrForbidden
			}
		}

		if tarRole, ok := models.RoleRank[tarU.Role]; ok {
			if cRole < tarRole {
				uc.l.Warnf(ctx, "user.usecase.Update.Role: %v forbidden", tarU.Role)
				return models.User{}, ErrForbidden
			}
		}
	}

	u, err := uc.repo.GetOne(ctx, scope, user.GetOneInput{Filter: user.Filter{Email: input.Email, ShopID: input.ShopID}})
	if err != nil && !errors.Is(err, mongo.ErrNoDocuments) {
		uc.l.Warnf(ctx, "user.usecase.Update.FindByEmail: %v", err)
		return models.User{}, err
	}
	if u.ID.Hex() != id && err == nil {
		uc.l.Warnf(ctx, "user.usecase.Update.FindByEmail: %s", input.Email)
		return models.User{}, ErrEmailTaken
	}

	updateopts := user.UpdateOptions{
		User:         tarU,
		Username:     input.Username,
		Email:        input.Email,
		Role:         input.Role,
		ShopID:       input.ShopID,
		RegionID:     input.RegionID,
		BranchID:     input.BranchID,
		DepartmentID: input.DepartmentID,
	}

	updatedU, err := uc.repo.Update(ctx, scope, id, updateopts)
	if err != nil {
		uc.l.Warnf(ctx, "user.usecase.Update.Update: %v", err)
		if errors.Is(err, mongo.ErrNoDocuments) {
			return models.User{}, ErrUserNotFound
		}
		return models.User{}, err
	}

	return updatedU, nil
}

func (uc implUsecase) Delete(ctx context.Context, scope models.Scope, id string) (string, error) {
	calU := ctx.Value("user").(models.User)

	tarU, err := uc.repo.GetOne(ctx, scope, user.GetOneInput{Filter: user.Filter{ID: id}})
	if err != nil {
		uc.l.Warnf(ctx, "user.usecase.Delete.GetOne: %v", err)
		if errors.Is(err, mongo.ErrNoDocuments) || errors.Is(err, mongo.ErrInvalidObjectID) {
			return "", ErrUserNotFound
		}
		return "", err
	}

	if cRole, ok := models.RoleRank[calU.Role]; ok {
		if tRole, ok := models.RoleRank[tarU.Role]; ok {
			if tRole >= cRole {
				uc.l.Warnf(ctx, "user.usecase.Delete.Role: %v forbidden", calU.Role)
				return "", ErrForbidden
			}
		}
	}

	res, err := uc.repo.Delete(ctx, scope, id)
	if err != nil {
		uc.l.Warnf(ctx, "user.usecase.Delete.Delete: %v", err)
		if errors.Is(err, mongo.ErrNoDocuments) || errors.Is(err, mongo.ErrInvalidObjectID) {
			return "", ErrUserNotFound
		}
		return "", err
	}

	return res, nil
}

func (uc implUsecase) Create(ctx context.Context, scope models.Scope, input user.CreateUserInput) (models.User, error) {
	calU := ctx.Value("user").(models.User)

	if calU.Role == models.RoleEmployee {
		uc.l.Warnf(ctx, "user.usecase.CreateUser.Role: %v forbidden", calU.Role)
		return models.User{}, ErrForbidden
	}

	if rankInput, ok1 := models.RoleRank[input.Role]; ok1 {
		if rankC, ok2 := models.RoleRank[calU.Role]; ok2 {
			if rankInput >= rankC {
				uc.l.Warnf(ctx, "user.usecase.CreateUser.Role: %v forbidden", calU.Role)
				return models.User{}, ErrForbidden
			}
		}
	}

	switch input.Role {
	case models.RoleManager:
		if input.ShopID == "" {
			uc.l.Warnf(ctx, "user.usecase.CreateUser.CreateUserInput: %v", input)
			return models.User{}, ErrMissingData
		}
	case models.RoleRegionManager:
		if input.RegionID == "" && input.ShopID == "" {
			uc.l.Warnf(ctx, "user.usecase.CreateUser.CreateUserInput: %v", input)
			return models.User{}, ErrMissingData
		}
	case models.RoleBranchManager:
		if input.BranchID == "" && input.ShopID == "" && input.RegionID == "" {
			uc.l.Warnf(ctx, "user.usecase.CreateUser.CreateUserInput: %v", input)
			return models.User{}, ErrMissingData
		}
	case models.RoleHeadOfDept:
		if input.DepartmentID == "" && input.ShopID == "" && input.RegionID == "" && input.BranchID == "" {
			uc.l.Warnf(ctx, "user.usecase.CreateUser.CreateUserInput: %v", input)
			return models.User{}, ErrMissingData
		}
	case models.RoleEmployee:
		if input.BranchID == "" && input.ShopID == "" && input.RegionID == "" {
			uc.l.Warnf(ctx, "user.usecase.CreateUser.CreateUserInput: %v", input)
			return models.User{}, ErrMissingData
		}
	}

	u, err := uc.repo.GetOne(ctx, scope, user.GetOneInput{Filter: user.Filter{Email: input.Email, ShopID: input.ShopID}})
	if !errors.Is(err, mongo.ErrNoDocuments) && err != nil {
		uc.l.Warnf(ctx, "user.usecase.CreateUser.FindByEmail: %v", err)
		return models.User{}, err
	}
	if err == nil {
		uc.l.Warnf(ctx, "user.usecase.CreateUser.FindByEmail: %s", u)
		return models.User{}, ErrEmailTaken
	}

	encryptedPW, err := uc.encrypter.Encrypt(input.Password)
	if err != nil {
		uc.l.Warnf(ctx, "user.usecase.CreateUser.Encrypt: %v", err)
		return models.User{}, ErrEncryptPassword
	}

	opts := user.CreateOptions{
		Username:     input.Username,
		Email:        input.Email,
		Password:     encryptedPW,
		Role:         input.Role,
		ShopID:       input.ShopID,
		RegionID:     input.RegionID,
		BranchID:     input.BranchID,
		DepartmentID: input.DepartmentID,
	}

	newUser, err := uc.repo.Create(ctx, scope, opts)
	if err != nil {
		uc.l.Warnf(ctx, "user.usecase.CreateUser.Create: %v", err)
		return models.User{}, err
	}

	return newUser, nil
}

func (uc implUsecase) GetByID(ctx context.Context, scope models.Scope, id string) (user.GetOneOutPut, error) {
	calU := ctx.Value("user").(models.User)
	fil := user.Filter{ID: id}
	uc.buildGetFilter(calU, &fil)

	u, err := uc.repo.GetOne(ctx, scope, user.GetOneInput{Filter: fil})
	if err != nil {
		uc.l.Warnf(ctx, "user.usecase.GetByID.GetOne: %v", err)
		return user.GetOneOutPut{}, err
	}

	var s *models.Shop
	var r *models.Region
	var b *models.Branch
	var d *models.Department

	g, gctx := errgroup.WithContext(ctx)

	g.Go(func() error {
		if u.ShopID == nil {
			return nil
		}
		output, err := uc.shopUC.GetOne(gctx, scope, shop.GetOneInput{
			Filter: shop.Filter{
				ID: u.ShopID.Hex(),
			}})
		if err != nil {
			return err
		}

		s = &output.Shop

		return nil
	})

	g.Go(func() error {
		if u.RegionID == nil {
			return nil
		}

		output, err := uc.regionUC.GetOne(gctx, scope, region.GetOneInput{
			Filter: region.Filter{
				ID: u.RegionID.Hex(),
			}})
		if err != nil {
			return err
		}
		r = &output.Region

		return nil
	})

	g.Go(func() error {
		if u.BranchID == nil {
			return nil
		}
		output, err := uc.branchUC.GetOne(gctx, scope, branch.GetOneInput{
			Filter: branch.Filter{
				ID: u.BranchID.Hex(),
			}})
		if err != nil {
			return err
		}
		b = &output.Branch

		return nil
	})

	g.Go(func() error {
		if u.DepartmentID == nil {
			return nil
		}
		output, err := uc.deptUC.GetOne(gctx, scope, department.GetOneInput{
			Filter: department.Filter{
				ID: u.DepartmentID.Hex(),
			}})
		if err != nil {
			return err
		}
		d = &output.Department

		return nil
	})

	if err := g.Wait(); err != nil {
		uc.l.Warnf(ctx, "user.usecase.GetByID.GetOne: %v", err)
		return user.GetOneOutPut{}, ErrDataFetch
	}

	out := user.GetOneOutPut{
		User:       u,
		Shop:       s,
		Region:     r,
		Branch:     b,
		Department: d,
	}

	return out, nil
}
