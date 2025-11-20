package mongo

import (
	"context"

	"init-src/internal/models"
	"init-src/internal/user"
	"init-src/pkg/mongo"
	"init-src/pkg/paginator"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/sync/errgroup"
)

const (
	userCollection = "users"
)

func (repo implRepository) getUserCollection() mongo.Collection {
	return repo.db.Collection(userCollection)
}

func (repo implRepository) Create(ctx context.Context, sc models.Scope, opts user.CreateOptions) (models.User, error) {
	col := repo.getUserCollection()

	newUser, err := repo.buildCreateUser(ctx, opts)
	if err != nil {
		repo.l.Warnf(ctx, "user.Repository.Create.buildCreateUser: %v", err)
		return models.User{}, err
	}

	_, err = col.InsertOne(ctx, newUser)
	if err != nil {
		repo.l.Warnf(ctx, "user.Repository.Create.InsertOne: %v", err)
		return models.User{}, err
	}

	return newUser, nil
}

func (repo implRepository) List(ctx context.Context, sc models.Scope, opts user.ListInput) ([]models.User, error) {
	col := repo.getUserCollection()

	filter, err := repo.buildGetFilter(opts.Filter)
	if err != nil {
		repo.l.Warnf(ctx, "user.Repository.Get.buildGetFilter: %v", err)
		return nil, mongo.ErrInvalidObjectID
	}

	cursor, err := col.Find(ctx, filter)
	if err != nil {
		repo.l.Warnf(ctx, "user.Repository.List.Find: %v", err)
		return nil, err
	}
	defer cursor.Close(ctx)

	var users []models.User
	if err = cursor.All(ctx, &users); err != nil {
		repo.l.Warnf(ctx, "user.Repository.List.All: %v", err)
		return nil, err
	}

	return users, nil
}

func (repo implRepository) Get(ctx context.Context, sc models.Scope, opts user.GetInput) ([]models.User, paginator.Paginator, error) {
	col := repo.getUserCollection()

	filter, err := repo.buildGetFilter(opts.Filter)
	if err != nil {
		repo.l.Warnf(ctx, "user.Repository.Get.buildGetFilter: %v", err)
		return nil, paginator.Paginator{}, mongo.ErrInvalidObjectID
	}

	opt := options.Find().SetLimit(opts.Pagin.Limit).SetSkip(opts.Pagin.Offset())

	var (
		users []models.User
		total int64
	)

	g, ctx := errgroup.WithContext(ctx)

	g.Go(func() error {
		var err error
		total, err = col.CountDocuments(ctx, filter)
		if err != nil {
			repo.l.Warnf(ctx, "user.Repository.Get.CountDocuments: %v", err)
		}

		return err
	})

	g.Go(func() error {
		cur, err := col.Find(ctx, filter, opt)
		if err != nil {
			repo.l.Warnf(ctx, "user.Repository.Get.Find: %v", err)
			return err
		}
		defer cur.Close(ctx)

		if err := cur.All(ctx, &users); err != nil {
			repo.l.Warnf(ctx, "user.Repository.Get.All: %v", err)
			return err
		}

		return nil
	})

	if err := g.Wait(); err != nil {
		return nil, paginator.Paginator{}, err
	}

	pag := paginator.Paginator{
		Total:       total,
		Count:       int64(len(users)),
		PerPage:     opts.Pagin.Limit,
		CurrentPage: opts.Pagin.Page,
	}

	return users, pag, nil
}

func (repo implRepository) GetOne(ctx context.Context, sc models.Scope, opts user.GetOneInput) (models.User, error) {
	col := repo.getUserCollection()
	fil, err := repo.buildGetFilter(opts.Filter)
	if err != nil {
		repo.l.Warnf(ctx, "user.Repository.GetOne.buildGetFilter: %v", err)
		return models.User{}, mongo.ErrInvalidObjectID
	}

	var u models.User
	err = col.FindOne(ctx, fil).Decode(&u)
	if err != nil {
		repo.l.Warnf(ctx, "user.Repository.GetOne.FindOne: %v", err)
		return models.User{}, err
	}

	return u, nil
}

func (repo implRepository) Update(ctx context.Context, sc models.Scope, id string, opts user.UpdateOptions) (models.User, error) {
	col := repo.getUserCollection()

	fil, err := repo.buildUpdatefilter(id)
	if err != nil {
		repo.l.Warnf(ctx, "user.Repository.Update.buildUpdatefilter: %v", err)
		return models.User{}, mongo.ErrInvalidObjectID
	}

	updField, err := repo.buildUpdateField(&opts)
	if err != nil {
		repo.l.Warnf(ctx, "user.Repository.Update.BuildUpdatefilter: %v", err)
		return models.User{}, mongo.ErrInvalidObjectID
	}

	res, err := col.UpdateOne(ctx, fil, updField)
	if err != nil {
		repo.l.Warnf(ctx, "user.Repository.Update.UpdateOne: %v", err)
		return models.User{}, err
	}
	if res != nil && res.MatchedCount == 0 {
		repo.l.Warnf(ctx, "user.Repository.Update.UpdateOne: %v", err)
		return models.User{}, mongo.ErrNoDocuments
	}

	return opts.User, nil
}

func (repo implRepository) Delete(ctx context.Context, sc models.Scope, id string) (string, error) {
	col := repo.getUserCollection()

	fil, err := repo.buildDeletefilter(id)
	if err != nil {
		repo.l.Warnf(ctx, "user.Repository.Delete.buildDeletefilter: %v", err)
		return "", mongo.ErrInvalidObjectID
	}

	upd := bson.M{"$set": bson.M{"deleted_at": repo.clock()}}

	res, err := col.UpdateOne(ctx, fil, upd)
	if err != nil {
		repo.l.Warnf(ctx, "user.Repository.Delete.UpdateOne: %v", err)
		return "", err
	}
	if res.MatchedCount == 0 {
		repo.l.Warnf(ctx, "user.Repository.Delete.UpdateOne: %v", err)
		return "", mongo.ErrNoDocuments
	}

	return "Delete success", nil
}
