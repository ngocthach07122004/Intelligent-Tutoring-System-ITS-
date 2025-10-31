package mongo

import (
	"init-src/internal/user"
	"init-src/pkg/mongo"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func (repo implRepository) buildUpdatefilter(id string) (bson.M, error) {
	oID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return bson.M{}, mongo.ErrInvalidObjectID
	}
	fil := bson.M{"_id": oID, "deleted_at": nil}

	return fil, nil
}

func (repo implRepository) buildDeletefilter(id string) (bson.M, error) {
	oID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return bson.M{}, mongo.ErrInvalidObjectID
	}
	fil := bson.M{"_id": oID, "deleted_at": nil}
	return fil, nil
}

func (repo implRepository) buildGetFilter(opts user.Filter) (bson.M, error) {
	filter := bson.M{"deleted_at": nil}

	if opts.ID != "" {
		oID, err := primitive.ObjectIDFromHex(opts.ID)
		if err != nil {
			return filter, mongo.ErrInvalidObjectID
		}
		filter["_id"] = oID
	}

	if opts.ShopID != "" {
		shopID, err := primitive.ObjectIDFromHex(opts.ShopID)
		if err != nil {
			return filter, mongo.ErrInvalidObjectID
		}
		filter["shop_id"] = shopID
	}

	if opts.RegionID != "" {
		regionID, err := primitive.ObjectIDFromHex(opts.RegionID)
		if err != nil {
			return filter, mongo.ErrInvalidObjectID
		}
		filter["region_id"] = regionID
	}

	if opts.BranchID != "" {
		branchID, err := primitive.ObjectIDFromHex(opts.BranchID)
		if err != nil {
			return filter, mongo.ErrInvalidObjectID
		}
		filter["branch_id"] = branchID
	}

	if opts.DepartmentID != "" {
		departmentID, err := primitive.ObjectIDFromHex(opts.DepartmentID)
		if err != nil {
			return filter, mongo.ErrInvalidObjectID
		}
		filter["department_id"] = departmentID
	}

	if opts.Email != "" {
		filter["email"] = opts.Email
	}

	if opts.Role != "" {
		filter["role"] = opts.Role
	}

	if opts.Username != "" {
		filter["username"] = opts.Username
	}

	return filter, nil
}
