package mongo

// department

import (
	"context"

	"init-src/internal/department"
	"init-src/internal/models"
	"init-src/pkg/mongo"
	"init-src/pkg/paginator"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/sync/errgroup"
)

const (
	departmentCollection = "departments"
)

func (repo implRepository) getDepartmentCollection() mongo.Collection {
	return repo.db.Collection(departmentCollection)
}

func (repo implRepository) Create(ctx context.Context, sc models.Scope, opts department.CreateOptions) (models.Department, error) {
	collection := repo.getDepartmentCollection()

	dep, err := repo.buildCreateDepartment(opts)
	if err != nil {
		repo.l.Errorf(ctx, "department.mongo.Create.buildCreateDepartment", err)
		return models.Department{}, err
	}

	_, err = collection.InsertOne(ctx, dep)
	if err != nil {
		repo.l.Errorf(ctx, "department.mongo.Create.InsertOne", err, "Name", opts.Name)
		return models.Department{}, err
	}

	return dep, nil
}

func (repo implRepository) GetOne(ctx context.Context, sc models.Scope, input department.GetOneInput) (models.Department, error) {
	collection := repo.getDepartmentCollection()

	fil, err := repo.buildGetFilter(input.Filter)
	if err != nil {
		repo.l.Errorf(ctx, "department.mongo.GetOne", err)
		return models.Department{}, mongo.ErrInvalidObjectID
	}

	var dept models.Department
	err = collection.FindOne(ctx, fil).Decode(&dept)
	if err != nil {
		repo.l.Errorf(ctx, "department.mongo.GetOne", err)
		return models.Department{}, err
	}

	return dept, nil
}

func (repo implRepository) Get(ctx context.Context, sc models.Scope, input department.GetInput) ([]models.Department, paginator.Paginator, error) {
	col := repo.getDepartmentCollection()

	fil, err := repo.buildGetFilter(input.Filter)
	if err != nil {
		repo.l.Errorf(ctx, "department.mongo.Get", err)
		return nil, paginator.Paginator{}, mongo.ErrInvalidObjectID
	}

	var (
		deps  []models.Department
		total int64
	)

	g, gctx := errgroup.WithContext(ctx)

	g.Go(func() error {
		var err error
		total, err = col.CountDocuments(gctx, fil)
		if err != nil {
			repo.l.Warnf(ctx, "department.mongo.Get.CountDocuments: %v", err)
		}
		return err
	})

	g.Go(func() error {
		opts := options.Find().SetLimit(input.Pagin.Limit).SetSkip(input.Pagin.Offset())
		cursor, err := col.Find(gctx, fil, opts)
		if err != nil {
			repo.l.Errorf(ctx, "department.mongo.Get", err)
			return err
		}
		defer cursor.Close(gctx)

		if err = cursor.All(gctx, &deps); err != nil {
			repo.l.Errorf(ctx, "department.mongo.Get", err)
			return err
		}
		return nil
	})

	if err := g.Wait(); err != nil {
		return nil, paginator.Paginator{}, err
	}

	pag := paginator.Paginator{
		Total:       total,
		Count:       int64(len(deps)),
		PerPage:     input.Pagin.Limit,
		CurrentPage: input.Pagin.Page,
	}

	return deps, pag, nil
}

func (repo implRepository) List(ctx context.Context, sc models.Scope, input department.ListInput) ([]models.Department, error) {
	col := repo.getDepartmentCollection()

	fil, err := repo.buildGetFilter(input.Filter)
	if err != nil {
		repo.l.Errorf(ctx, "department.mongo.FindAll", err)
		return nil, err
	}

	var deps []models.Department
	cursor, err := col.Find(ctx, fil)
	if err != nil {
		repo.l.Errorf(ctx, "department.mongo.FindAll", err)
		return nil, err
	}

	if err = cursor.All(ctx, &deps); err != nil {
		repo.l.Errorf(ctx, "department.mongo.FindAll", err)
		return nil, err
	}

	return deps, nil
}

func (repo implRepository) Update(ctx context.Context, sc models.Scope, id string, opts department.UpdateOptions) (models.Department, error) {
	col := repo.getDepartmentCollection()

	fil, err := repo.buildUpdateFilter(id)
	if err != nil {
		repo.l.Errorf(ctx, "department.mongo.Update.buildUpdateFilter", err)
		return models.Department{}, err
	}

	upd, err := repo.buildUpdateField(&opts)
	if err != nil {
		repo.l.Errorf(ctx, "department.mongo.Update.buildUpdateField", err)
		return models.Department{}, err
	}

	result, err := col.UpdateOne(ctx, fil, upd)
	if err != nil {
		repo.l.Errorf(ctx, "department.mongo.Update.UpdateOne", err, "ID", id)
		return models.Department{}, err
	}
	if result.MatchedCount == 0 {
		repo.l.Errorf(ctx, "department.mongo.Update.UpdateOne", err, "ID", id)
		return models.Department{}, mongo.ErrNoDocuments
	}

	return opts.Dept, nil
}

func (repo implRepository) Delete(ctx context.Context, sc models.Scope, id string) (string, error) {
	col := repo.getDepartmentCollection()

	fil, err := repo.buildDeleteFilter(id)
	if err != nil {
		repo.l.Errorf(ctx, "department.mongo.Delete.buildDeleteFilter", err)
		return "", err
	}

	upd := bson.M{"$set": bson.M{"deleted_at": repo.clock()}}

	result, err := col.UpdateOne(ctx, fil, upd)
	if err != nil {
		repo.l.Errorf(ctx, "department.mongo.Delete.UpdateOne", err, "ID", id)
		return "", err
	}
	if result.MatchedCount == 0 {
		repo.l.Errorf(ctx, "department.mongo.Delete.UpdateOne", err, "ID", id)
		return "", mongo.ErrNoDocuments
	}

	return "success", nil
}
