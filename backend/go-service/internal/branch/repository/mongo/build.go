package mongo

import (
	"init-src/internal/branch"
	"init-src/internal/models"
	"init-src/pkg/mongo"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func (repo implRepository) buildCreateBranch(opts branch.CreateOptions) (models.Branch, error) {
	now := repo.clock()

	shopID, err := primitive.ObjectIDFromHex(opts.ShopID)
	if err != nil {
		return models.Branch{}, mongo.ErrInvalidObjectID
	}

	regionID, err := primitive.ObjectIDFromHex(opts.RegionID)
	if err != nil {
		return models.Branch{}, mongo.ErrInvalidObjectID
	}

	branch := models.Branch{
		ID:        repo.db.NewObjectID(),
		Name:      opts.Name,
		Alias:     opts.Alias,
		Code:      opts.Code,
		ShopID:    shopID,
		RegionID:  regionID,
		CreatedAt: now,
		UpdatedAt: now,
	}

	return branch, nil
}

func (repo implRepository) buildUpdateField(opts *branch.UpdateOptions) (bson.M, error) {
	now := repo.clock()

	field := bson.M{
		"name":       opts.Name,
		"alias":      opts.Alias,
		"code":       opts.Code,
		"updated_at": now,
	}
	opts.Branch.Name = opts.Name
	opts.Branch.Alias = opts.Alias
	opts.Branch.Code = opts.Code
	opts.Branch.UpdatedAt = now

	if opts.RegionID != "" {
		regId, err := primitive.ObjectIDFromHex(opts.RegionID)
		if err != nil {
			return bson.M{}, err
		}

		field["region_id"] = regId
		opts.Branch.RegionID = regId
	}

	update := bson.M{"$set": field}

	return update, nil
}
