package models

import (
    "time"

    "go.mongodb.org/mongo-driver/bson/primitive"
)

type Department struct {
    ID        primitive.ObjectID  `bson:"_id"`
    Name      string              `bson:"name"`
    Alias     string              `bson:"alias"`
    Code      string              `bson:"code"`
    RegionID  primitive.ObjectID  `bson:"region_id"`
    ShopID    primitive.ObjectID  `bson:"shop_id"`
    BranchID  primitive.ObjectID  `bson:"branch_id"`           
    CreatedAt time.Time           `bson:"created_at"`
    UpdatedAt time.Time           `bson:"updated_at"`
    DeletedAt *time.Time          `bson:"deleted_at,omitempty"`
}