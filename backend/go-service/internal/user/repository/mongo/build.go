package mongo

import (
	"context"

	"init-src/internal/models"
	"init-src/internal/user"
	"init-src/pkg/mongo"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func (repo implRepository) buildCreateUser(ctx context.Context, opts user.CreateOptions) (models.User, error) {
	var (
		shopID, regionID, branchID, departmentID *primitive.ObjectID
	)

	if opts.ShopID != "" {
		id, err := primitive.ObjectIDFromHex(opts.ShopID)
		if err != nil {
			repo.l.Warnf(ctx, "user.Repository.Create.ShopID: %v", err)
			return models.User{}, mongo.ErrInvalidObjectID
		}
		shopID = &id
	}

	if opts.RegionID != "" {
		id, err := primitive.ObjectIDFromHex(opts.RegionID)
		if err != nil {
			repo.l.Warnf(ctx, "user.Repository.Create.RegionID: %v", err)
			return models.User{}, mongo.ErrInvalidObjectID
		}
		regionID = &id
	}

	if opts.BranchID != "" {
		id, err := primitive.ObjectIDFromHex(opts.BranchID)
		if err != nil {
			repo.l.Warnf(ctx, "user.Repository.Create.BranchID: %v", err)
			return models.User{}, mongo.ErrInvalidObjectID
		}
		branchID = &id
	}

	if opts.DepartmentID != "" {
		id, err := primitive.ObjectIDFromHex(opts.DepartmentID)
		if err != nil {
			repo.l.Warnf(ctx, "user.Repository.Create.DepartmentID: %v", err)
			return models.User{}, mongo.ErrInvalidObjectID
		}
		departmentID = &id
	}

	newUser := models.User{
		ID:           repo.db.NewObjectID(),
		Username:     opts.Username,
		Email:        opts.Email,
		Password:     opts.Password,
		Role:         opts.Role,
		ShopID:       shopID,
		RegionID:     regionID,
		BranchID:     branchID,
		DepartmentID: departmentID,
		CreatedAt:    repo.clock(),
		UpdatedAt:    repo.clock(),
	}

	return newUser, nil
}

func (repo implRepository) buildUpdateField(opts *user.UpdateOptions) (bson.M, error) {
	now := repo.clock()
	set := bson.M{"updated_at": now}
	opts.User.UpdatedAt = now

	if opts.Password != "" {
		set["password"] = opts.Password
		opts.User.Password = opts.Password
	}
	if opts.Username != "" {
		set["username"] = opts.Username
		opts.User.Username = opts.Username
	}
	if opts.Email != "" {
		set["email"] = opts.Email
		opts.User.Email = opts.Email
	}
	if opts.Role != "" {
		set["role"] = opts.Role
		opts.User.Role = opts.Role
	}
	if opts.ShopID != "" {
		shopID, err := primitive.ObjectIDFromHex(opts.ShopID)
		if err != nil {
			return bson.M{}, mongo.ErrInvalidObjectID
		}
		set["shop_id"] = shopID
		opts.User.ShopID = &shopID
	}
	if opts.RegionID != "" {
		regionID, err := primitive.ObjectIDFromHex(opts.RegionID)
		if err != nil {
			return bson.M{}, mongo.ErrInvalidObjectID
		}
		set["region_id"] = regionID
		opts.User.RegionID = &regionID
	}
	if opts.BranchID != "" {
		branchID, err := primitive.ObjectIDFromHex(opts.BranchID)
		if err != nil {
			return bson.M{}, mongo.ErrInvalidObjectID
		}
		set["branch_id"] = branchID
		opts.User.BranchID = &branchID
	}
	if opts.DepartmentID != "" {
		departmentID, err := primitive.ObjectIDFromHex(opts.DepartmentID)
		if err != nil {
			return bson.M{}, mongo.ErrInvalidObjectID
		}
		set["department_id"] = departmentID
		opts.User.DepartmentID = &departmentID
	}

	update := bson.M{"$set": set}

	return update, nil
}
