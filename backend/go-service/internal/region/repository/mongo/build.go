package mongo

import (
	"init-src/internal/models"
	"init-src/internal/region"
	"init-src/pkg/mongo"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func (repo implRepository) buildCreateRegion(opts region.CreateOptions) (models.Region, error) {
	shopID, err := primitive.ObjectIDFromHex(opts.ShopID)
	if err != nil {
		return models.Region{}, mongo.ErrInvalidObjectID
	}
	now := repo.clock()
	newRegion := models.Region{
		ID:        repo.db.NewObjectID(),
		Name:      opts.Name,
		Alias:     opts.Alias,
		Code:      opts.Code,
		ShopID:    shopID,
		CreatedAt: now,
		UpdatedAt: now,
	}

	return newRegion, nil
}

func (repo implRepository) buildUpdateField(opts *region.UpdateOptions) bson.M {
	now := repo.clock()
	field := bson.M{
		"name":       opts.Name,
		"alias":      opts.Alias,
		"code":       opts.Code,
		"updated_at": now,
	}
	opts.Region.Name = opts.Name
	opts.Region.Alias = opts.Alias
	opts.Region.Code = opts.Code
	opts.Region.UpdatedAt = now

	update := bson.M{"$set": field}

	return update
}
