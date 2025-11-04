package mongo

import (
	"init-src/internal/models"
	"init-src/internal/shop"

	"go.mongodb.org/mongo-driver/bson"
)

func (repo implRepository) buildCreateShop(opts shop.CreateOptions) models.Shop {
	newShop := models.Shop{
		ID:        repo.db.NewObjectID(),
		Name:      opts.Name,
		Alias:     opts.Alias,
		Code:      opts.Code,
		CreatedAt: repo.clock(),
		UpdatedAt: repo.clock(),
	}

	return newShop
}

func (repo implRepository) buildUpdateField(opts *shop.UpdateOptions) bson.M {
	now := repo.clock()
	field := bson.M{
		"name":       opts.Name,
		"alias":      opts.Alias,
		"code":       opts.Code,
		"updated_at": now,
	}
	opts.Shop.Name = opts.Name
	opts.Shop.Alias = opts.Alias
	opts.Shop.Code = opts.Code
	opts.Shop.UpdatedAt = now

	update := bson.M{"$set": field}

	return update
}
