package mongo

import (
	"context"

	"init-src/internal/models"
	"init-src/internal/shop"
	"init-src/pkg/mongo"
	"init-src/pkg/paginator"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/sync/errgroup"
)

const (
	shopCollection = "shops"
)

func (repo implRepository) getUserCollection() mongo.Collection {
	return repo.db.Collection(shopCollection)
}

func (repo implRepository) Create(ctx context.Context, sc models.Scope, opts shop.CreateOptions) (models.Shop, error) {
	collection := repo.getUserCollection()

	shop := repo.buildCreateShop(opts)

	_, err := collection.InsertOne(ctx, shop)
	if err != nil {
		repo.l.Warnf(ctx, "shop.mongo.Create.InsertOne", err, "Name", opts.Name)
		return models.Shop{}, err
	}

	return shop, nil
}

func (repo implRepository) List(ctx context.Context, sc models.Scope, input shop.ListInput) ([]models.Shop, error) {
	collection := repo.getUserCollection()

	filter, err := repo.buildGetFilter(input.Filter)
	if err != nil {
		repo.l.Warnf(ctx, "shop.mongo.List", err)
		return nil, mongo.ErrInvalidObjectID
	}

	crs, err := collection.Find(ctx, filter)
	if err != nil {
		repo.l.Warnf(ctx, "shop.mongo.FindAll", err)
		return nil, err
	}
	defer crs.Close(ctx)

	var shops []models.Shop
	if err = crs.All(ctx, &shops); err != nil {
		repo.l.Warnf(ctx, "shop.mongo.FindAll", err)
		return nil, err
	}

	return shops, nil
}

func (repo implRepository) Get(ctx context.Context, sc models.Scope, input shop.GetInput) ([]models.Shop, paginator.Paginator, error) {
	collection := repo.getUserCollection()

	fil, err := repo.buildGetFilter(input.Filter)
	if err != nil {
		repo.l.Warnf(ctx, "shop.mongo.Get", err)
		return nil, paginator.Paginator{}, mongo.ErrInvalidObjectID
	}
	opts := options.Find().SetLimit(input.Pagin.Limit).SetSkip(input.Pagin.Offset())

	var (
		shops []models.Shop
		total int64
	)

	g, gctx := errgroup.WithContext(ctx)

	g.Go(func() error {
		var err error
		total, err = collection.CountDocuments(gctx, fil)
		if err != nil {
			repo.l.Warnf(ctx, "shop.mongo.Get.CountDocuments: %v", err)
		}
		return err
	})

	g.Go(func() error {
		crs, err := collection.Find(gctx, fil, opts)
		if err != nil {
			repo.l.Warnf(ctx, "shop.mongo.Get", err)
			return err
		}
		defer crs.Close(gctx)

		if err = crs.All(gctx, &shops); err != nil {
			repo.l.Warnf(ctx, "shop.mongo.Get", err)
			return err
		}
		return nil
	})

	if err := g.Wait(); err != nil {
		return nil, paginator.Paginator{}, err
	}

	pag := paginator.Paginator{
		Total:       total,
		Count:       int64(len(shops)),
		PerPage:     input.Pagin.Limit,
		CurrentPage: input.Pagin.Page,
	}

	return shops, pag, nil
}

func (repo implRepository) GetOne(ctx context.Context, sc models.Scope, input shop.GetOneInput) (models.Shop, error) {
	collection := repo.getUserCollection()
	fil, err := repo.buildGetFilter(input.Filter)
	if err != nil {
		repo.l.Warnf(ctx, "shop.mongo.GetOne", err)
		return models.Shop{}, mongo.ErrInvalidObjectID
	}

	var shop models.Shop
	err = collection.FindOne(ctx, fil).Decode(&shop)
	if err != nil {
		repo.l.Warnf(ctx, "shop.mongo.GetOne", err)
		return models.Shop{}, err
	}

	return shop, nil
}

func (repo implRepository) Update(ctx context.Context, sc models.Scope, id string, opts shop.UpdateOptions) (models.Shop, error) {
	collection := repo.getUserCollection()

	fil, err := repo.buildUpdateFilter(id)
	if err != nil {
		repo.l.Warnf(ctx, "shop.mongo.Update.buildUpdatefilter", err, "ID", id)
		return models.Shop{}, mongo.ErrInvalidObjectID
	}

	updField := repo.buildUpdateField(&opts)

	result, err := collection.UpdateOne(ctx, fil, updField)
	if err != nil {
		repo.l.Warnf(ctx, "shop.mongo.Update.UpdateOne", err, "ID", id)
		return models.Shop{}, err
	}
	if result.MatchedCount == 0 {
		return models.Shop{}, mongo.ErrNoDocuments
	}

	return opts.Shop, nil
}

func (repo implRepository) Delete(ctx context.Context, sc models.Scope, id string) (string, error) {
	collection := repo.getUserCollection()
	fil, err := repo.buildUpdateFilter(id)
	if err != nil {
		repo.l.Warnf(ctx, "shop.mongo.Delete.buildDeletefilter", err, "ID", id)
		return "", mongo.ErrInvalidObjectID
	}

	upd := bson.M{"$set": bson.M{"deleted_at": repo.clock()}}

	result, err := collection.UpdateOne(ctx, fil, upd)
	if err != nil {
		repo.l.Warnf(ctx, "shop.mongo.Delete.UpdateOne", err, "ID", id)
		return "", err
	}
	if result.MatchedCount == 0 {
		return "", mongo.ErrNoDocuments
	}

	return "delete success", nil
}
