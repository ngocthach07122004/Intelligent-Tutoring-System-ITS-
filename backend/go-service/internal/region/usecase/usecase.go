package usecase

import (
	"context"
	"errors"

	"init-src/internal/branch"
	brUcErr "init-src/internal/branch/usecase"
	"init-src/internal/models"
	"init-src/internal/region"
	"init-src/pkg/mongo"
	"init-src/pkg/util"
)

func (uc implUsecase) Create(ctx context.Context, sc models.Scope, input region.CreateInput) (models.Region, error) {
	reg, err := uc.repo.Create(ctx, sc, region.CreateOptions{
		Name:   input.Name,
		ShopID: input.ShopID,
		Alias:  util.BuildAlias(input.Name),
		Code:   util.BuildCode(input.Name),
	})
	if err != nil {
		uc.l.Warnf(ctx, "region.Usecase.Create error", err)
		if errors.Is(err, mongo.ErrInvalidObjectID) {
			return models.Region{}, ErrInvalidObjectID
		}
		return models.Region{}, err
	}

	return reg, nil
}

func (uc implUsecase) List(ctx context.Context, sc models.Scope, input region.ListInput) ([]models.Region, error) {
	regs, err := uc.repo.List(ctx, sc, input)
	if err != nil {
		uc.l.Warnf(ctx, "region.Usecase.List error", err)
		return nil, err
	}

	return regs, nil
}

func (uc implUsecase) Get(ctx context.Context, sc models.Scope, input region.GetInput) (region.GetOutput, error) {
	regs, paginRes, err := uc.repo.Get(ctx, sc, input)
	if err != nil {
		uc.l.Warnf(ctx, "region.Usecase.Get error", err, "input", input)
		return region.GetOutput{}, err
	}

	output := region.GetOutput{
		Regions: regs,
		Pagin:   paginRes,
	}

	return output, nil
}

func (uc implUsecase) GetOne(ctx context.Context, sc models.Scope, input region.GetOneInput) (region.GetOneOutput, error) {
	reg, err := uc.repo.GetOne(ctx, sc, input)
	if err != nil {
		uc.l.Warnf(ctx, "region.Usecase.GetOne error", err, "input", input)
		if errors.Is(err, mongo.ErrNoDocuments) || errors.Is(err, mongo.ErrInvalidObjectID) {
			return region.GetOneOutput{}, ErrNotFound
		}
		return region.GetOneOutput{}, err
	}

	output := region.GetOneOutput{
		Region: reg,
	}

	return output, nil
}

func (uc implUsecase) Delete(ctx context.Context, sc models.Scope, id string) (string, error) {
	// check if region has branch
	_, err := uc.branchUC.GetOne(ctx, sc, branch.GetOneInput{Filter: branch.Filter{RegionID: id}})
	if err != nil && !errors.Is(err, brUcErr.ErrNotFound) {
		uc.l.Warnf(ctx, "region.Usecase.Delete error", err)
		if errors.Is(err, mongo.ErrInvalidObjectID) {
			return "", ErrInvalidObjectID
		}
		return "", err
	}
	if err == nil {
		return "", ErrRegionHasBranch
	}

	_, err = uc.repo.Delete(ctx, sc, id)
	if err != nil {
		uc.l.Warnf(ctx, "region.Usecase.Delete error", err, "ID", id)
		if errors.Is(err, mongo.ErrInvalidObjectID) || errors.Is(err, mongo.ErrNoDocuments) {
			return "", ErrInvalidObjectID
		}
		return "", err
	}

	return "Deleted successfully", nil
}

func (uc implUsecase) Update(ctx context.Context, sc models.Scope, id string, opts region.UpdateInput) (models.Region, error) {
	reg, err := uc.repo.GetOne(ctx, sc, region.GetOneInput{Filter: region.Filter{ID: id}})
	if err != nil {
		uc.l.Warnf(ctx, "region.Usecase.Update error", err, "ID", id)
		if errors.Is(err, mongo.ErrInvalidObjectID) || errors.Is(err, mongo.ErrNoDocuments) {
			return models.Region{}, ErrNotFound
		}
		return models.Region{}, err
	}

	Uptdreg, err := uc.repo.Update(ctx, sc, id, region.UpdateOptions{
		Region: reg,
		Name:   opts.Name,
		Alias:  util.BuildAlias(opts.Name),
		Code:   util.BuildCode(opts.Name),
	})
	if err != nil {
		uc.l.Warnf(ctx, "region.Usecase.Update error", err, "ID", id)
		if errors.Is(err, mongo.ErrInvalidObjectID) || errors.Is(err, mongo.ErrNoDocuments) {
			return models.Region{}, ErrNotFound
		}
		return models.Region{}, err
	}

	return Uptdreg, nil
}
