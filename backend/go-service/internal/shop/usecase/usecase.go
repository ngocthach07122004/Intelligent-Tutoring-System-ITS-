package usecase

import (
	"context"
	"errors"

	"init-src/internal/models"
	"init-src/internal/region"
	regUcErr "init-src/internal/region/usecase"

	"init-src/internal/shop"

	"init-src/pkg/mongo"
	"init-src/pkg/util"
)

func (uc implUsecase) Create(ctx context.Context, sc models.Scope, input shop.CreateInput) (models.Shop, error) {
	shop, err := uc.repo.Create(ctx, sc, shop.CreateOptions{
		Name:  input.Name,
		Alias: util.BuildAlias(input.Name),
		Code:  util.BuildCode(input.Name),
	})
	if err != nil {
		uc.l.Warnf(ctx, "shop.Usecase.Create error", err, "name", input.Name)
		return models.Shop{}, err
	}

	return shop, nil
}

func (uc implUsecase) List(ctx context.Context, sc models.Scope, input shop.ListInput) ([]models.Shop, error) {
	shops, err := uc.repo.List(ctx, sc, input)
	if err != nil {
		uc.l.Warnf(ctx, "shop.Usecase.List error", err)
		return nil, err
	}

	return shops, nil
}

func (uc implUsecase) Get(ctx context.Context, sc models.Scope, input shop.GetInput) (shop.GetOutput, error) {
	shops, paginRes, err := uc.repo.Get(ctx, sc, input)
	if err != nil {
		uc.l.Warnf(ctx, "shop.Usecase.Get error", err, "input", input)
		return shop.GetOutput{}, err
	}

	output := shop.GetOutput{
		Shops: shops,
		Pagin: paginRes,
	}

	return output, nil
}

func (uc implUsecase) GetOne(ctx context.Context, sc models.Scope, input shop.GetOneInput) (shop.GetOneOutput, error) {
	sh, err := uc.repo.GetOne(ctx, sc, input)
	if err != nil {
		uc.l.Warnf(ctx, "shop.Usecase.GetOne error", err, "input", input)
		if errors.Is(err, mongo.ErrNoDocuments) || errors.Is(err, mongo.ErrInvalidObjectID) {
			return shop.GetOneOutput{}, ErrNotFound
		}
		return shop.GetOneOutput{}, err
	}

	output := shop.GetOneOutput{
		Shop: sh,
	}

	return output, nil
}

func (uc implUsecase) Update(ctx context.Context, sc models.Scope, id string, input shop.UpdateInput) (models.Shop, error) {
	sh, err := uc.repo.GetOne(ctx, sc, shop.GetOneInput{Filter: shop.Filter{ID: id}})
	if err != nil {
		uc.l.Warnf(ctx, "shop.Usecase.Update error", err, "ID", id)
		if errors.Is(err, mongo.ErrNoDocuments) || errors.Is(err, mongo.ErrInvalidObjectID) {
			return models.Shop{}, ErrNotFound
		}
		return models.Shop{}, err
	}

	updsh, err := uc.repo.Update(ctx, sc, id, shop.UpdateOptions{
		Shop:  sh,
		Name:  input.Name,
		Alias: util.BuildAlias(input.Name),
		Code:  util.BuildCode(input.Name),
	})

	if err != nil {
		uc.l.Warnf(ctx, "shop.Usecase.Update error", err, "ID", id)
		if errors.Is(err, mongo.ErrNoDocuments) || errors.Is(err, mongo.ErrInvalidObjectID) {
			return models.Shop{}, ErrNotFound
		}
		return models.Shop{}, err
	}

	return updsh, nil
}

func (uc implUsecase) Delete(ctx context.Context, sc models.Scope, id string) (string, error) {
	// validate before delete shop if exist region
	_, err := uc.regionUC.GetOne(ctx, sc, region.GetOneInput{Filter: region.Filter{ShopID: id}})
	if err != nil && !errors.Is(err, regUcErr.ErrNotFound) {
		uc.l.Warnf(ctx, "shop.Usecase.Delete error", err.Error())
		return "", err
	}
	if err == nil {
		return "", ErrShopHasRegion
	}

	_, err = uc.repo.Delete(ctx, sc, id)
	if err != nil {
		uc.l.Warnf(ctx, "shop.Usecase.Delete error", err, "ID", id)
		if errors.Is(err, mongo.ErrNoDocuments) || errors.Is(err, mongo.ErrInvalidObjectID) {
			return "", ErrNotFound
		}
		return "", err
	}

	return "Deleted successfully", nil
}
