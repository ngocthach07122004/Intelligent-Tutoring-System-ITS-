package usecase

import (
	"context"
	"errors"

	"init-src/internal/branch"
	"init-src/internal/department"
	deptUcErr "init-src/internal/department/usecase"
	"init-src/internal/models"
	"init-src/pkg/mongo"
	"init-src/pkg/util"
)

func (uc implUsecase) Create(ctx context.Context, sc models.Scope, input branch.CreateInput) (models.Branch, error) {
	br, err := uc.repo.Create(ctx, sc, branch.CreateOptions{
		Name:     input.Name,
		Alias:    util.BuildAlias(input.Name),
		Code:     util.BuildCode(input.Name),
		RegionID: input.RegionID,
		ShopID:   input.ShopID,
	})
	if err != nil {
		uc.l.Warnf(ctx, "branch.Usecase.Create error", err, "name", input.Name)
		if errors.Is(err, mongo.ErrNoDocuments) || errors.Is(err, mongo.ErrInvalidObjectID) {
			return models.Branch{}, ErrNotFound
		}
		return models.Branch{}, err
	}

	return br, nil
}

func (uc implUsecase) Get(ctx context.Context, sc models.Scope, input branch.GetInput) (branch.GetOutput, error) {
	brs, pag, err := uc.repo.Get(ctx, sc, input)
	if err != nil {
		uc.l.Warnf(ctx, "branch.usecase.Get", err)
		return branch.GetOutput{}, err
	}

	return branch.GetOutput{
		Branches: brs,
		Pagin:    pag,
	}, nil
}

func (uc implUsecase) GetOne(ctx context.Context, sc models.Scope, input branch.GetOneInput) (branch.GetOneOutput, error) {
	br, err := uc.repo.GetOne(ctx, sc, input)
	if err != nil {
		uc.l.Warnf(ctx, "branch.usecase.GetOne", err)
		if errors.Is(err, mongo.ErrNoDocuments) || errors.Is(err, mongo.ErrInvalidObjectID) {
			return branch.GetOneOutput{}, ErrNotFound
		}
		return branch.GetOneOutput{}, err
	}

	return branch.GetOneOutput{
		Branch: br,
	}, nil
}

func (uc implUsecase) List(ctx context.Context, sc models.Scope, input branch.ListInput) ([]models.Branch, error) {
	brs, err := uc.repo.List(ctx, sc, input)
	if err != nil {
		uc.l.Warnf(ctx, "branch.usecase.List.FindAll", err)
		return nil, err
	}

	return brs, nil
}

func (uc implUsecase) Update(ctx context.Context, sc models.Scope, id string, input branch.UpdateInput) (models.Branch, error) {
	br, err := uc.repo.GetOne(ctx, sc, branch.GetOneInput{Filter: branch.Filter{ID: id}})
	if err != nil {
		uc.l.Warnf(ctx, "branch.Usecase.Update.GetOne error", err, "ID", id)
		if errors.Is(err, mongo.ErrNoDocuments) || errors.Is(err, mongo.ErrInvalidObjectID) {
			return models.Branch{}, ErrNotFound
		}
		return models.Branch{}, err
	}

	updbr, err := uc.repo.Update(ctx, sc, id, branch.UpdateOptions{
		Branch: br,
		Name:   input.Name,
		Alias:  util.BuildAlias(input.Name),
		Code:   util.BuildCode(input.Name),
	})
	if err != nil {
		uc.l.Warnf(ctx, "branch.Usecase.Update error", err, "ID", id)
		if errors.Is(err, mongo.ErrNoDocuments) || errors.Is(err, mongo.ErrInvalidObjectID) {
			return models.Branch{}, ErrNotFound
		}
		return models.Branch{}, err
	}

	return updbr, nil
}

func (uc implUsecase) Delete(ctx context.Context, sc models.Scope, id string) (string, error) {
	// Check if branch has departments before delete
	_, err := uc.deptUC.GetOne(ctx, sc, department.GetOneInput{Filter: department.Filter{BranchID: id}})
	if err != nil && !errors.Is(err, deptUcErr.ErrNotFound) {
		uc.l.Warnf(ctx, "branch.Usecase.Delete error", err)
		if errors.Is(err, mongo.ErrInvalidObjectID) {
			return "", ErrInvalidObjectID
		}
		return "", err
	}
	if err == nil {
		return "", ErrBranchHasDept
	}

	_, err = uc.repo.Delete(ctx, sc, id)
	if err != nil {
		uc.l.Warnf(ctx, "branch.Usecase.Delete error", err, "ID", id)
		if errors.Is(err, mongo.ErrNoDocuments) || errors.Is(err, mongo.ErrInvalidObjectID) {
			return "", ErrNotFound
		}
		return "", err
	}

	return "Deleted", nil
}
