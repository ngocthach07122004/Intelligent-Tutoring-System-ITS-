package usecase

import (
	"context"
	"errors"

	"init-src/internal/department"
	"init-src/internal/models"
	"init-src/pkg/mongo"
	"init-src/pkg/util"
)

func (uc implUsecase) Create(ctx context.Context, sc models.Scope, input department.CreateInput) (models.Department, error) {
	dep, err := uc.repo.Create(ctx, sc, department.CreateOptions{
		Name:     input.Name,
		ShopID:   input.ShopID,
		RegionID: input.RegionID,
		BranchID: input.BranchID,
		Alias:    util.BuildAlias(input.Name),
		Code:     util.BuildCode(input.Name),
	})
	if err != nil {
		uc.l.Errorf(ctx, "department.Usecase.Create error", err)
		if errors.Is(err, mongo.ErrInvalidObjectID) {
			return models.Department{}, ErrInvalidObjectID
		}
		return models.Department{}, err
	}

	return dep, nil
}

func (uc implUsecase) List(ctx context.Context, sc models.Scope, input department.ListInput) ([]models.Department, error) {
	deps, err := uc.repo.List(ctx, sc, input)
	if err != nil {
		uc.l.Errorf(ctx, "department.Usecase.List error", err)
		return nil, err
	}

	return deps, nil
}

func (uc implUsecase) Update(ctx context.Context, sc models.Scope, id string, input department.UpdateInput) (models.Department, error) {
	dept, err := uc.repo.GetOne(ctx, sc, department.GetOneInput{Filter: department.Filter{ID: id}})
	if err != nil {
		uc.l.Errorf(ctx, "department.Usecase.Update error", err, "ID", id)
		if errors.Is(err, mongo.ErrNoDocuments) || errors.Is(err, mongo.ErrInvalidObjectID) {
			return models.Department{}, ErrNotFound
		}
		return models.Department{}, err
	}

	uptdep, err := uc.repo.Update(ctx, sc, id, department.UpdateOptions{
		Dept:     dept,
		Name:     input.Name,
		BranchID: input.BranchID,
		Alias:    util.BuildAlias(input.Name),
		Code:     util.BuildCode(input.Name),
	})
	if err != nil {
		uc.l.Errorf(ctx, "department.Usecase.Update error", err, "ID", id)
		if errors.Is(err, mongo.ErrNoDocuments) || errors.Is(err, mongo.ErrInvalidObjectID) {
			return models.Department{}, ErrNotFound
		}
		return models.Department{}, err
	}

	return uptdep, nil
}

func (uc implUsecase) Delete(ctx context.Context, sc models.Scope, id string) (string, error) {
	_, err := uc.repo.Delete(ctx, sc, id)
	if err != nil {
		uc.l.Errorf(ctx, "department.Usecase.Delete error", err, "ID", id)
		if errors.Is(err, mongo.ErrNoDocuments) || errors.Is(err, mongo.ErrInvalidObjectID) {
			return "", ErrNotFound
		}
		return "", err
	}

	return "Deleted", nil
}

func (uc implUsecase) GetOne(ctx context.Context, sc models.Scope, input department.GetOneInput) (department.GetOneOutput, error) {
	dep, err := uc.repo.GetOne(ctx, sc, input)
	if err != nil {
		uc.l.Errorf(ctx, "department.Usecase.GetOne error", err)
		if errors.Is(err, mongo.ErrNoDocuments) || errors.Is(err, mongo.ErrInvalidObjectID) {
			return department.GetOneOutput{}, ErrNotFound
		}
		return department.GetOneOutput{}, err
	}

	output := department.GetOneOutput{
		Department: dep,
	}

	return output, nil
}

func (uc implUsecase) Get(ctx context.Context, sc models.Scope, input department.GetInput) (department.GetOutput, error) {
	deps, paginRes, err := uc.repo.Get(ctx, sc, input)
	if err != nil {
		uc.l.Errorf(ctx, "department.Usecase.Get error", err)
		return department.GetOutput{}, err
	}

	output := department.GetOutput{
		Departments: deps,
		Pagin:       paginRes,
	}

	return output, nil
}
