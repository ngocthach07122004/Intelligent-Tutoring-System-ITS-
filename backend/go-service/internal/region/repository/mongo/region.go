package mongo

import (
	"context"

	"init-src/internal/models"
	"init-src/internal/region"
	"init-src/pkg/mongo"
	"init-src/pkg/paginator"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/sync/errgroup"
)

const (
	regionCollection = "regions"
)

func (repo implRepository) getRegionCollection() mongo.Collection {
	return repo.db.Collection(regionCollection)
}

func (repo implRepository) Create(ctx context.Context, sc models.Scope, opts region.CreateOptions) (models.Region, error) {
	col := repo.getRegionCollection()

	reg, err := repo.buildCreateRegion(opts)
	if err != nil {
		repo.l.Warnf(ctx, "region.mongo.Create.buildCreateRegion", err, "Name", opts.Name)
		return models.Region{}, err
	}

	_, err = col.InsertOne(ctx, reg)
	if err != nil {
		repo.l.Warnf(ctx, "region.mongo.Create.InsertOne", err, "Name", opts.Name)
		return models.Region{}, err
	}

	return reg, nil
}

func (repo implRepository) List(ctx context.Context, sc models.Scope, input region.ListInput) ([]models.Region, error) {
	col := repo.getRegionCollection()

	fil, err := repo.buildGetFilter(input.Filter)
	if err != nil {
		repo.l.Warnf(ctx, "region.mongo.List.buildGetFilter", err)
		return nil, err
	}

	crs, err := col.Find(ctx, fil)
	if err != nil {
		repo.l.Warnf(ctx, "region.mongo.List.Find", err)
		return nil, err
	}
	defer crs.Close(ctx)

	var regs []models.Region
	if err = crs.All(ctx, &regs); err != nil {
		repo.l.Warnf(ctx, "region.mongo.List.FindAll", err)
		return nil, err
	}

	return regs, nil
}

func (repo implRepository) Get(ctx context.Context, sc models.Scope, input region.GetInput) ([]models.Region, paginator.Paginator, error) {
	col := repo.getRegionCollection()

	fil, err := repo.buildGetFilter(input.Filter)
	if err != nil {
		repo.l.Warnf(ctx, "region.mongo.Get", err)
		return nil, paginator.Paginator{}, mongo.ErrInvalidObjectID
	}

	var (
		regs  []models.Region
		total int64
	)

	g, gctx := errgroup.WithContext(ctx)

	g.Go(func() error {
		var err error
		total, err = col.CountDocuments(gctx, fil)
		if err != nil {
			repo.l.Warnf(ctx, "region.mongo.Get.CountDocuments: %v", err)
		}
		return err
	})

	g.Go(func() error {
		opts := options.Find().SetLimit(input.Pagin.Limit).SetSkip(input.Pagin.Offset())
		crs, err := col.Find(gctx, fil, opts)
		if err != nil {
			repo.l.Warnf(ctx, "region.mongo.Get", err)
			return err
		}
		defer crs.Close(gctx)

		if err = crs.All(gctx, &regs); err != nil {
			repo.l.Warnf(ctx, "region.mongo.Get", err)
			return err
		}
		return nil
	})

	if err := g.Wait(); err != nil {
		return nil, paginator.Paginator{}, err
	}

	pag := paginator.Paginator{
		Total:       total,
		Count:       int64(len(regs)),
		PerPage:     input.Pagin.Limit,
		CurrentPage: input.Pagin.Page,
	}

	return regs, pag, nil
}

func (repo implRepository) GetOne(ctx context.Context, sc models.Scope, input region.GetOneInput) (models.Region, error) {
	col := repo.getRegionCollection()

	fil, err := repo.buildGetFilter(input.Filter)
	if err != nil {
		repo.l.Warnf(ctx, "region.mongo.GetOne", err)
		return models.Region{}, mongo.ErrInvalidObjectID
	}

	var reg models.Region
	err = col.FindOne(ctx, fil).Decode(&reg)
	if err != nil {
		repo.l.Warnf(ctx, "region.mongo.GetOne", err)
		return models.Region{}, err
	}

	return reg, nil
}

func (repo implRepository) Update(ctx context.Context, sc models.Scope, id string, opts region.UpdateOptions) (models.Region, error) {
	col := repo.getRegionCollection()

	fil, err := repo.buildUpdateFilter(id)
	if err != nil {
		repo.l.Warnf(ctx, "region.mongo.Update.buildUpdateQuery", err, "ID", id)
		return models.Region{}, mongo.ErrInvalidObjectID
	}

	upd := repo.buildUpdateField(&opts)

	res, err := col.UpdateOne(ctx, fil, upd)
	if err != nil {
		repo.l.Warnf(ctx, "region.mongo.Update.UpdateOne", err, "ID", id)
		return models.Region{}, err
	}
	if res.MatchedCount == 0 {
		repo.l.Warnf(ctx, "region.mongo.Update.UpdateOne", err, "ID", id)
		return models.Region{}, mongo.ErrNoDocuments
	}

	return opts.Region, nil
}

func (repo implRepository) Delete(ctx context.Context, sc models.Scope, id string) (string, error) {
	col := repo.getRegionCollection()

	fil, err := repo.buildUpdateFilter(id)
	if err != nil {
		repo.l.Warnf(ctx, "region.mongo.Delete.buildUpdateFilter", err, "ID", id)
		return "", mongo.ErrInvalidObjectID
	}

	upd := bson.M{"$set": bson.M{"deleted_at": repo.clock()}}

	res, err := col.UpdateOne(ctx, fil, upd)
	if err != nil {
		repo.l.Warnf(ctx, "region.mongo.Delete.UpdateOne", err, "ID", id)
		return "", err
	}
	if res.MatchedCount == 0 {
		repo.l.Warnf(ctx, "region.mongo.Delete.UpdateOne", err, "ID", id)
		return "", mongo.ErrNoDocuments
	}

	return "success", nil
}
