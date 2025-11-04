package mongo

import (
	"init-src/internal/branch"
	"init-src/pkg/mongo"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func (repo implRepository) buildGetFilter(input branch.Filter) (bson.M, error) {
	filter := bson.M{"deleted_at": nil}

	if input.Name != "" {
		filter["name"] = input.Name
	}
	if input.Code != "" {
		filter["code"] = input.Code
	}
	if input.Alias != "" {
		filter["alias"] = input.Alias
	}
	if input.ID != "" {
		oid, err := primitive.ObjectIDFromHex(input.ID)
		if err != nil {
			return nil, mongo.ErrInvalidObjectID
		}
		filter["_id"] = oid
	}
	if input.RegionID != "" {
		oid, err := primitive.ObjectIDFromHex(input.RegionID)
		if err != nil {
			return nil, mongo.ErrInvalidObjectID
		}
		filter["region_id"] = oid
	}
	if input.ShopID != "" {
		oid, err := primitive.ObjectIDFromHex(input.ShopID)
		if err != nil {
			return nil, mongo.ErrInvalidObjectID
		}
		filter["shop_id"] = oid
	}
	return filter, nil
}

func (repo implRepository) buildUpdateFilter(id string) (bson.M, error) {
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, mongo.ErrInvalidObjectID
	}

	filter := bson.M{"_id": oid, "deleted_at": nil}

	return filter, nil
}

func (repo implRepository) buildDeleteFilter(id string) (bson.M, error) {
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, mongo.ErrInvalidObjectID
	}
	fil := bson.M{"_id": oid, "deleted_at": nil}

	return fil, nil
}
