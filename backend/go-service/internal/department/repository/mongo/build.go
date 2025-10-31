package mongo

import (
	"init-src/internal/department"
	"init-src/internal/models"
	"init-src/pkg/mongo"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func (repo implRepository) buildCreateDepartment(opts department.CreateOptions) (models.Department, error) {
	now := repo.clock()

	shopID, err := primitive.ObjectIDFromHex(opts.ShopID)
	if err != nil {
		return models.Department{}, mongo.ErrInvalidObjectID
	}

	regionID, err := primitive.ObjectIDFromHex(opts.RegionID)
	if err != nil {
		return models.Department{}, mongo.ErrInvalidObjectID
	}

	branchID, err := primitive.ObjectIDFromHex(opts.BranchID)
	if err != nil {
		return models.Department{}, mongo.ErrInvalidObjectID
	}

	newDepartment := models.Department{
		ID:        repo.db.NewObjectID(),
		Name:      opts.Name,
		Alias:     opts.Alias,
		Code:      opts.Code,
		ShopID:    shopID,
		RegionID:  regionID,
		BranchID:  branchID,
		CreatedAt: now,
		UpdatedAt: now,
	}

	return newDepartment, nil
}

func (repo implRepository) buildUpdateField(opts *department.UpdateOptions) (bson.M, error) {
	now := repo.clock()

	field := bson.M{
		"name":       opts.Name,
		"alias":      opts.Alias,
		"code":       opts.Code,
		"updated_at": now,
	}
	opts.Dept.Name = opts.Name
	opts.Dept.Alias = opts.Alias
	opts.Dept.Code = opts.Code

	if opts.BranchID != "" {
		brID, err := primitive.ObjectIDFromHex(opts.BranchID)
		if err != nil {
			return nil, mongo.ErrInvalidObjectID
		}
		field["branch_id"] = brID
		opts.Dept.BranchID = brID
	}

	upd := bson.M{"$set": field}

	return upd, nil
}
