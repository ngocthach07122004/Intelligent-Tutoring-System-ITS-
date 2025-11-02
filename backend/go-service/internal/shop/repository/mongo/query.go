package mongo

import (
	"init-src/internal/shop"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func (repo implRepository) buildGetFilter(input shop.Filter) (bson.M, error) {
	filter := bson.M{"deleted_at": nil}

	if input.ID != "" {
		oID, err := primitive.ObjectIDFromHex(input.ID)
		if err != nil {
			return nil, err
		}
		filter["_id"] = oID
	}

	if input.Name != "" {
		filter["name"] = input.Name
	}

	if input.Alias != "" {
		filter["alias"] = input.Alias
	}

	if input.Code != "" {
		filter["code"] = input.Code
	}

	return filter, nil
}

func (repo implRepository) buildUpdateFilter(id string) (bson.M, error) {
	oID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	fil := bson.M{"_id": oID, "deleted_at": nil}

	return fil, nil
}
