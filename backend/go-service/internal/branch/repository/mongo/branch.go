package mongo

import (
	"context"

	"init-src/internal/branch"
	"init-src/internal/models"
	"init-src/pkg/mongo"
	"init-src/pkg/paginator"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/sync/errgroup"
)

const (
	branchCollection = "branches"
)

func (repo implRepository) getBranchCollection() mongo.Collection {
	return repo.db.Collection(branchCollection)
}

func (repo implRepository) Create(ctx context.Context, sc models.Scope, opts branch.CreateOptions) (models.Branch, error) {
	col := repo.getBranchCollection()

	br, err := repo.buildCreateBranch(opts)
	if err != nil {
		repo.l.Errorf(ctx, "event.branch.mongo.Create.buildCreateBranch", err)
		return models.Branch{}, err
	}

	_, err = col.InsertOne(ctx, br)
	if err != nil {
		repo.l.Errorf(ctx, "event.branch.mongo.Create.InsertOne", err)
		return models.Branch{}, err
	}

	return br, nil
}

func (repo implRepository) List(ctx context.Context, sc models.Scope, input branch.ListInput) ([]models.Branch, error) {
	col := repo.getBranchCollection()

	fil, err := repo.buildGetFilter(input.Filter)
	if err != nil {
		repo.l.Errorf(ctx, "event.branch.mongo.FindAll.Find", err)
		return nil, err
	}

	crs, err := col.Find(ctx, fil)
	if err != nil {
		repo.l.Errorf(ctx, "event.branch.mongo.FindAll.Find", err)
		return nil, err
	}
	defer crs.Close(ctx)

	var brs []models.Branch
	if err = crs.All(ctx, &brs); err != nil {
		repo.l.Errorf(ctx, "event.branch.mongo.FindAll.All", err)
		return nil, err
	}

	return brs, nil
}

func (repo implRepository) Get(ctx context.Context, sc models.Scope, input branch.GetInput) ([]models.Branch, paginator.Paginator, error) {
	col := repo.getBranchCollection()

	fil, err := repo.buildGetFilter(input.Filter)
	if err != nil {
		repo.l.Errorf(ctx, "branch.mongo.Get", err)
		return nil, paginator.Paginator{}, mongo.ErrInvalidObjectID
	}

	var (
		brs   []models.Branch
		total int64
	)

	g, gctx := errgroup.WithContext(ctx)

	g.Go(func() error {
		var err error
		total, err = col.CountDocuments(gctx, fil)
		if err != nil {
			repo.l.Warnf(ctx, "branch.mongo.Get.CountDocuments: %v", err)
		}
		return err
	})

	g.Go(func() error {
		opts := options.Find().SetLimit(input.Pagin.Limit).SetSkip(input.Pagin.Offset())
		crs, err := col.Find(gctx, fil, opts)
		if err != nil {
			repo.l.Errorf(ctx, "branch.mongo.Get", err)
			return err
		}
		defer crs.Close(gctx)

		if err = crs.All(gctx, &brs); err != nil {
			repo.l.Errorf(ctx, "branch.mongo.Get", err)
			return err
		}
		return nil
	})

	if err := g.Wait(); err != nil {
		return nil, paginator.Paginator{}, err
	}

	pag := paginator.Paginator{
		Total:       total,
		Count:       int64(len(brs)),
		PerPage:     input.Pagin.Limit,
		CurrentPage: input.Pagin.Page,
	}

	return brs, pag, nil
}

func (repo implRepository) GetOne(ctx context.Context, sc models.Scope, input branch.GetOneInput) (models.Branch, error) {
	col := repo.getBranchCollection()

	fil, err := repo.buildGetFilter(input.Filter)
	if err != nil {
		repo.l.Errorf(ctx, "branch.mongo.GetOne", err)
		return models.Branch{}, mongo.ErrInvalidObjectID
	}

	var br models.Branch
	err = col.FindOne(ctx, fil).Decode(&br)
	if err != nil {
		repo.l.Errorf(ctx, "branch.mongo.GetOne", err)
		return models.Branch{}, err
	}

	return br, nil
}

func (repo implRepository) Update(ctx context.Context, sc models.Scope, id string, opts branch.UpdateOptions) (models.Branch, error) {
	col := repo.getBranchCollection()

	fil, err := repo.buildUpdateFilter(id)
	if err != nil {
		repo.l.Errorf(ctx, "event.branch.mongo.Update.buildUpdateFilter", err, "ID", id)
		return models.Branch{}, mongo.ErrInvalidObjectID
	}
	upd, err := repo.buildUpdateField(&opts)
	if err != nil {
		repo.l.Errorf(ctx, "event.branch.mongo.Update.buildUpdateQuery", err, "ID", id)
		return models.Branch{}, mongo.ErrInvalidObjectID
	}

	res, err := col.UpdateOne(ctx, fil, upd)
	if err != nil {
		repo.l.Errorf(ctx, "event.branch.mongo.Update.UpdateOne", err, "ID", id)
		return models.Branch{}, err
	}
	if res.MatchedCount == 0 {
		repo.l.Errorf(ctx, "event.branch.mongo.Update.UpdateOne", err, "ID", id)
		return models.Branch{}, mongo.ErrNoDocuments
	}

	return opts.Branch, nil
}

func (repo implRepository) Delete(ctx context.Context, sc models.Scope, id string) (string, error) {
	col := repo.getBranchCollection()

	fil, err := repo.buildDeleteFilter(id)
	if err != nil {
		repo.l.Errorf(ctx, "event.branch.mongo.Delete.buildDeleteFilter", err, "ID", id)
		return "", err
	}

	upd := bson.M{"$set": bson.M{"deleted_at": repo.clock()}}

	res, err := col.UpdateOne(ctx, fil, upd)
	if err != nil {
		repo.l.Errorf(ctx, "event.branch.mongo.Delete.UpdateOne", err, "ID", id)
		return "", err
	}

	if res.MatchedCount == 0 {
		repo.l.Errorf(ctx, "event.branch.mongo.Delete.UpdateOne", err, "ID", id)
		return "", mongo.ErrNoDocuments
	}

	return "Deleted", nil
}
