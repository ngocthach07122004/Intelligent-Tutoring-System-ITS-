package mongo

import (
	"init-src/internal/region"
	"init-src/pkg/mongo"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func (repo implRepository) buildGetFilter(otps region.Filter) (bson.M, error) {
	filter := bson.M{"deleted_at": nil}

	if otps.ID != "" {
		oid, err := primitive.ObjectIDFromHex(otps.ID)
		if err != nil {
			return nil, mongo.ErrInvalidObjectID
		}
		filter["_id"] = oid
	}
	if otps.Name != "" {
		filter["name"] = otps.Name
	}
	if otps.Code != "" {
		filter["code"] = otps.Code
	}
	if otps.Alias != "" {
		filter["alias"] = otps.Alias
	}
	if otps.ShopID != "" {
		oid, err := primitive.ObjectIDFromHex(otps.ShopID)
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
