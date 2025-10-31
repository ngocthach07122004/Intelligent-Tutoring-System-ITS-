# Coding Standards and Style Guide

This document outlines the coding standards, file organization patterns, and style conventions used in this project. All new code must follow these guidelines to maintain consistency.

## Table of Contents
- [Architecture Overview](#architecture-overview)
- [Directory Structure](#directory-structure)
- [File Organization](#file-organization)
- [Naming Conventions](#naming-conventions)
- [Type System](#type-system)
- [Code Patterns](#code-patterns)
- [Error Handling](#error-handling)
- [Logging](#logging)
<!-- - [Testing](#testing) -->
- [Import Organization](#import-organization)

---

## Architecture Overview

This project follows **Clean Architecture** principles with clear separation of concerns:

```
Delivery Layer (HTTP) → Use Case Layer → Repository Layer → Database
```

**Key Principles:**
- Domain models are independent of external frameworks
- Business logic resides in the use case layer
- Each layer has its own types and error definitions
- Dependencies point inward (delivery → usecase → repository)

---

## Directory Structure

### Project Root Structure
```
.
├── cmd/                    # Application entry points
├── config/                 # Configuration management
├── internal/              # Private application code
│   ├── models/           # Domain models
│   ├── {module}/         # Feature modules (branch, user, etc.)
│   ├── httpserver/       # HTTP server setup
│   ├── middleware/       # HTTP middleware
│   └── appconfig/        # Application configuration
├── pkg/                   # Public shared packages
│   ├── log/             # Logging utilities
│   ├── jwt/             # JWT utilities
│   ├── errors/          # Error utilities
│   ├── mongo/           # MongoDB client
│   ├── postgres/        # PostgreSQL client
│   ├── redis/           # Redis client
│   ├── paginator/       # Pagination utilities
│   └── util/            # Common utilities
└── docs/                  # API documentation (Swagger)
```

### Feature Module Structure

Each feature module (e.g., `internal/branch`, `internal/user`) MUST follow this exact structure:

```
internal/{module}/
├── repo_interface.go          # Repository interface definition
├── repo_types.go              # Repository-specific types (Options)
├── uc_interface.go            # Use case interface definition
├── uc_types.go                # Use case-specific types (Input/Output/Filter)
├── delivery/
│   └── http/
│       ├── new.go             # Handler constructor
│       ├── handlers.go        # HTTP handler implementations
│       ├── routes.go          # Route mappings
│       ├── presenters.go      # Request/Response DTOs
│       ├── process_request.go # Request processing logic
│       ├── errors.go          # HTTP error mapping
│       └── {module}_test.go   # HTTP handler tests
├── usecase/
│   ├── new.go                 # Use case constructor
│   ├── usecase.go             # Use case implementations
│   ├── errors.go              # Use case error definitions
│   ├── utils.go               # (Optional) Helper functions
│   └── usecase_test.go        # Use case tests
└── repository/
    └── {db_type}/             # e.g., mongo, postgres
        ├── new.go             # Repository constructor
        ├── {module}.go        # Repository implementations
        ├── query.go           # Query/filter builders
        ├── build.go           # Entity builders (create/update)
        └── repository_test.go # Repository tests
```

---

## File Organization

### 1. Interface Files (`*_interface.go`)

**Repository Interface** (`repo_interface.go`):
```go
package {module}

import (
    "context"

    "init-src/internal/models"
    "init-src/pkg/paginator"
)

// Repository is the interface for {module} repository
//
//go:generate mockery --name=Repository
type Repository interface {
    Create(ctx context.Context, sc models.Scope, opts CreateOptions) (models.{Module}, error)
    List(ctx context.Context, sc models.Scope, opts ListOptions) ([]models.{Module}, error)
    Get(ctx context.Context, sc models.Scope, opts GetOptions) ([]models.{Module}, paginator.Paginator, error)
    GetOne(ctx context.Context, sc models.Scope, opts GetOneOptions) (models.{Module}, error)
    Update(ctx context.Context, sc models.Scope, id string, opts UpdateOptions) (models.{Module}, error)
    Delete(ctx context.Context, sc models.Scope, id string) (string, error)
}
```

**Use Case Interface** (`uc_interface.go`):
```go
package {module}

import (
    "context"

    "init-src/internal/models"
)

//go:generate mockery --name=Usecase
type Usecase interface {
    Create(ctx context.Context, sc models.Scope, input CreateInput) (models.{Module}, error)
    List(ctx context.Context, sc models.Scope, input ListInput) ([]models.{Module}, error)
    Get(ctx context.Context, sc models.Scope, input GetInput) (GetOutput, error)
    GetOne(ctx context.Context, sc models.Scope, input GetOneInput) (GetOneOutput, error)
    Update(ctx context.Context, sc models.Scope, id string, input UpdateInput) (models.{Module}, error)
    Delete(ctx context.Context, sc models.Scope, id string) (string, error)
}
```

**Key Rules:**
- Include `//go:generate mockery --name={InterfaceName}` for test mocking
- Always pass `context.Context` as first parameter
- Always pass `models.Scope` for authorization context
- Use consistent method signatures across modules

### 2. Types Files (`*_types.go`)

- repo input type will be otps
- uc input type is input
- uc call repo need to convert input to opts

**Repository Types** (`repo_types.go`):
```go
package {module}

import models "init-src/internal/models"

// Options suffix for repository layer
type CreateOptions struct {
    Field1 string
    Field2 string
    // ... all fields needed for creation
}

type UpdateOptions struct {
    {Module} models.{Module}  // Include existing entity
    Field1   string
    Field2   string
    // ... fields that can be updated
}
```

**Use Case Types** (`uc_types.go`):
```go
package {module}

import (
    "init-src/internal/models"
    "init-src/pkg/paginator"
)

// Input suffix for use case parameters
type CreateInput struct {
    Field1 string
    Field2 string
}

type UpdateInput struct {
    Field1 string
    Field2 string
}

// Filter for query conditions
type Filter struct {
    ID     string
    Field1 string
    Field2 string
}

// Input types that include filters
type ListInput struct {
    Filter Filter
}

type GetInput struct {
    Filter Filter
    Pagin  paginator.PaginatorQuery
}

type GetOneInput struct {
    Filter Filter
}

// Output suffix for use case results
type GetOutput struct {
    {Modules} []models.{Module}
    Pagin     paginator.Paginator
}

type GetOneOutput struct {
    {Module} models.{Module}
}
```

### 3. Implementation Files

**Use Case Constructor** (`usecase/new.go`):
```go
package usecase

import (
    "init-src/internal/{module}"
    "init-src/pkg/log"
)

type implUsecase struct {
    l    log.Logger
    repo {module}.Repository
    // Add other dependencies here
}

func New(l log.Logger, repo {module}.Repository) {module}.Usecase {
    return &implUsecase{
        l:    l,
        repo: repo,
    }
}
```

**Use Case Implementation** (`usecase/usecase.go`):
```go
package usecase

import (
    "context"
    "errors"

    "init-src/internal/{module}"
    "init-src/internal/models"
    "init-src/pkg/mongo"
)

func (uc implUsecase) Create(ctx context.Context, sc models.Scope, input {module}.CreateInput) (models.{Module}, error) {
    entity, err := uc.repo.Create(ctx, sc, {module}.CreateOptions{
        Field1: input.Field1,
        Field2: input.Field2,
    })
    if err != nil {
        uc.l.Warnf(ctx, "{module}.Usecase.Create error", err, "field", input.Field1)
        if errors.Is(err, mongo.ErrNoDocuments) || errors.Is(err, mongo.ErrInvalidObjectID) {
            return models.{Module}{}, ErrNotFound
        }
        return models.{Module}{}, err
    }

    return entity, nil
}

// Implement other interface methods...
```

**Repository Constructor** (`repository/{db_type}/new.go`):
```go
package {db_type}

import (
    "time"

    "init-src/internal/{module}"
    "init-src/pkg/log"
    "init-src/pkg/{db_type}"
)

type implRepository struct {
    l     log.Logger
    db    {db_type}.Database
    clock func() time.Time
}

func New(l log.Logger, db {db_type}.Database) {module}.Repository {
    return &implRepository{
        l:     l,
        db:    db,
        clock: time.Now,
    }
}
```

**Repository Implementation** (`repository/{db_type}/{module}.go`):
```go
package {db_type}

import (
    "context"

    "init-src/internal/{module}"
    "init-src/internal/models"
    "init-src/pkg/{db_type}"
    "init-src/pkg/paginator"

    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/mongo/options"
    "golang.org/x/sync/errgroup"
)

const (
    {module}Collection = "{modules}"
)

func (repo implRepository) get{Module}Collection() {db_type}.Collection {
    return repo.db.Collection({module}Collection)
}

func (repo implRepository) Create(ctx context.Context, sc models.Scope, opts {module}.CreateOptions) (models.{Module}, error) {
    col := repo.get{Module}Collection()

    entity, err := repo.buildCreate{Module}(opts)
    if err != nil {
        repo.l.Errorf(ctx, "{module}.{db_type}.Create.buildCreate{Module}", err)
        return models.{Module}{}, err
    }

    _, err = col.InsertOne(ctx, entity)
    if err != nil {
        repo.l.Errorf(ctx, "{module}.{db_type}.Create.InsertOne", err)
        return models.{Module}{}, err
    }

    return entity, nil
}

// Implement other interface methods...
```

**Query Builders** (`repository/{db_type}/query.go`):
```go
package {db_type}

import (
    "init-src/internal/{module}"
    "init-src/pkg/{db_type}"

    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/bson/primitive"
)

func (repo implRepository) buildGetFilter(input {module}.Filter) (bson.M, error) {
    filter := bson.M{"deleted_at": nil}

    if input.ID != "" {
        oid, err := primitive.ObjectIDFromHex(input.ID)
        if err != nil {
            return nil, {db_type}.ErrInvalidObjectID
        }
        filter["_id"] = oid
    }

    if input.Field1 != "" {
        filter["field1"] = input.Field1
    }

    return filter, nil
}

func (repo implRepository) buildUpdateFilter(id string) (bson.M, error) {
    oid, err := primitive.ObjectIDFromHex(id)
    if err != nil {
        return nil, {db_type}.ErrInvalidObjectID
    }

    return bson.M{"_id": oid, "deleted_at": nil}, nil
}

func (repo implRepository) buildDeleteFilter(id string) (bson.M, error) {
    oid, err := primitive.ObjectIDFromHex(id)
    if err != nil {
        return nil, {db_type}.ErrInvalidObjectID
    }

    return bson.M{"_id": oid, "deleted_at": nil}, nil
}
```

**Build Helpers** (`repository/{db_type}/build.go`):
```go
package {db_type}

import (
    "init-src/internal/{module}"
    "init-src/internal/models"
    "init-src/pkg/{db_type}"

    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/bson/primitive"
)

func (repo implRepository) buildCreate{Module}(opts {module}.CreateOptions) (models.{Module}, error) {
    now := repo.clock()

    // Convert string IDs to ObjectIDs
    refID, err := primitive.ObjectIDFromHex(opts.RefID)
    if err != nil {
        return models.{Module}{}, {db_type}.ErrInvalidObjectID
    }

    entity := models.{Module}{
        ID:        repo.db.NewObjectID(),
        Field1:    opts.Field1,
        RefID:     refID,
        CreatedAt: now,
        UpdatedAt: now,
    }

    return entity, nil
}

func (repo implRepository) buildUpdateField(opts *{module}.UpdateOptions) (bson.M, error) {
    now := repo.clock()

    field := bson.M{
        "field1":     opts.Field1,
        "updated_at": now,
    }

    // Update the entity in opts
    opts.{Module}.Field1 = opts.Field1
    opts.{Module}.UpdatedAt = now

    // Handle optional fields
    if opts.Field2 != "" {
        refID, err := primitive.ObjectIDFromHex(opts.Field2)
        if err != nil {
            return bson.M{}, err
        }
        field["field2"] = refID
        opts.{Module}.Field2 = refID
    }

    return bson.M{"$set": field}, nil
}
```

### 4. HTTP Delivery Layer

**Handler Constructor** (`delivery/http/new.go`):
```go
package http

import (
    "init-src/internal/{module}"
    "init-src/pkg/log"

    "github.com/gin-gonic/gin"
)

type Handler interface {
    create(c *gin.Context)
    list(c *gin.Context)
    findByID(c *gin.Context)
    update(c *gin.Context)
    delete(c *gin.Context)
}

type handler struct {
    l  log.Logger
    uc {module}.Usecase
}

// New returns a new instance of the HTTPHandler interface
func New(l log.Logger, uc {module}.Usecase) Handler {
    return handler{
        l:  l,
        uc: uc,
    }
}
```

**Handlers** (`delivery/http/handlers.go`):
```go
package http

import (
    "init-src/pkg/response"

    "github.com/gin-gonic/gin"
)

// @Summary Create {module}
// @Description Create a new {module}
// @Tags {Modules}
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer JWT token"
// @Param body body createReq true "{Module} info"
// @Success 200 {object} detailResp
// @Failure 400 {object} response.Resp "Bad Request"
// @Failure 401 {object} response.Resp "Unauthorized"
// @Failure 403 {object} response.Resp "Forbidden"
// @Failure 500 {object} response.Resp "Internal Server Error"
// @Router /api/v1/{modules} [POST]
func (h handler) create(c *gin.Context) {
    ctx := c.Request.Context()

    req, sc, err := h.processCreateRequest(c)
    if err != nil {
        h.l.Warnf(ctx, "{module}.handler.create.processCreateRequest: %s", err)
        mapErr := h.mapError(err)
        response.Error(c, mapErr)
        return
    }

    entity, err := h.uc.Create(ctx, sc, req.toInput())
    if err != nil {
        h.l.Warnf(ctx, "{module}.handler.create.uc.Create: %s", err)
        mapErr := h.mapError(err)
        response.Error(c, mapErr)
        return
    }

    response.OK(c, h.newDetailResp(entity))
}

// Implement other handler methods following the same pattern...
```

**Routes** (`delivery/http/routes.go`):
```go
package http

import (
    "init-src/internal/middleware"

    "github.com/gin-gonic/gin"
)

// MapRoutes maps the routes to the handler functions
func MapRoutes(r *gin.RouterGroup, mw middleware.Middleware, h Handler) {
    {module} := r.Group("/{modules}")
    {module}.Use(mw.Auth(), mw.Authorize())
    {module}.POST("", h.create)
    {module}.GET("", h.list)
    {module}.GET("/:id", h.findByID)
    {module}.PUT("/:id", h.update)
    {module}.DELETE("/:id", h.delete)
}
```

**Presenters** (`delivery/http/presenters.go`):
```go
package http

import (
    "strings"

    "init-src/internal/{module}"
    "init-src/internal/models"
    "init-src/pkg/paginator"
    "init-src/pkg/response"
)

// Request types
type createReq struct {
    Field1 string `json:"field1" binding:"required"`
    Field2 string `json:"field2" binding:"required"`
}

type updateReq struct {
    Field1 string `json:"field1" binding:"required"`
    Field2 string `json:"field2"`
}

// Validation methods
func (r createReq) validate() error {
    if strings.TrimSpace(r.Field1) == "" {
        return errWrongBody
    }
    return nil
}

// Conversion methods
func (r createReq) toInput() {module}.CreateInput {
    return {module}.CreateInput{
        Field1: r.Field1,
        Field2: r.Field2,
    }
}

func (r updateReq) toInput() {module}.UpdateInput {
    return {module}.UpdateInput{
        Field1: r.Field1,
        Field2: r.Field2,
    }
}

// Response types
type detailResp struct {
    ID        string             `json:"id"`
    Field1    string             `json:"field1"`
    CreatedAt response.DateTime  `json:"created_at"`
}

type deleteResp struct {
    Message string `json:"message"`
}

type GetResponse struct {
    {Modules} []detailResp                `json:"{modules}"`
    Pagin     paginator.PaginatorResponse `json:"pagin"`
}

// Response constructors
func (h handler) newDetailResp(d models.{Module}) detailResp {
    return detailResp{
        ID:        d.ID.Hex(),
        Field1:    d.Field1,
        CreatedAt: response.DateTime(d.CreatedAt),
    }
}

func (h handler) newGetResponse(entities []models.{Module}, pagin paginator.Paginator) GetResponse {
    var resp GetResponse
    for _, v := range entities {
        resp.{Modules} = append(resp.{Modules}, h.newDetailResp(v))
    }
    return GetResponse{
        Pagin:    pagin.ToResponse(),
        {Modules}: resp.{Modules},
    }
}
```

**Request Processing** (`delivery/http/process_request.go`):
```go
package http

import (
    "init-src/internal/models"
    pkgErrors "init-src/pkg/errors"
    "init-src/pkg/jwt"
    "init-src/pkg/paginator"

    "github.com/gin-gonic/gin"
)

func (h handler) processCreateRequest(c *gin.Context) (createReq, models.Scope, error) {
    ctx := c.Request.Context()

    payload, ok := jwt.GetPayloadFromContext(ctx)
    if !ok {
        h.l.Warnf(ctx, "{module}.http.processCreateRequest.GetPayloadFromContext: unauthorized")
        return createReq{}, models.Scope{}, pkgErrors.NewUnauthorizedHTTPError()
    }

    sc := jwt.NewScope(payload)

    var req createReq
    if err := c.ShouldBindJSON(&req); err != nil {
        h.l.Errorf(ctx, "{module}.http.processCreateRequest.ShouldBindJSON", err)
        return createReq{}, sc, errWrongBody
    }

    if err := req.validate(); err != nil {
        h.l.Errorf(ctx, "{module}.http.processCreateRequest.validate", err)
        return createReq{}, sc, err
    }

    return req, sc, nil
}

func (h handler) processListRequest(c *gin.Context) (GetRequest, paginator.PaginatorQuery, models.Scope, error) {
    ctx := c.Request.Context()

    payload, ok := jwt.GetPayloadFromContext(ctx)
    if !ok {
        h.l.Warnf(ctx, "{module}.http.processListRequest.GetPayloadFromContext: unauthorized")
        return GetRequest{}, paginator.PaginatorQuery{}, models.Scope{}, pkgErrors.NewUnauthorizedHTTPError()
    }

    sc := jwt.NewScope(payload)

    var pagin paginator.PaginatorQuery
    if err := c.ShouldBindQuery(&pagin); err != nil {
        h.l.Warnf(ctx, "{module}.http.processListRequest.ShouldBindQuery: %v", err)
        return GetRequest{}, pagin, models.Scope{}, errWrongQuery
    }
    pagin.Adjust()

    req := GetRequest{
        Field1: c.Query("field1"),
        Field2: c.Query("field2"),
    }

    return req, pagin, sc, nil
}

// Implement other process methods...
```

**Error Mapping** (`delivery/http/errors.go`):
```go
package http

import (
    "init-src/internal/{module}/usecase"
    pkgErrors "init-src/pkg/errors"
)

var (
    errWrongBody       = pkgErrors.NewHTTPError(10000, "Wrong body")
    errNotFound        = pkgErrors.NewNotFoundHTTPError("{Module} not found")
    errForbidden       = pkgErrors.NewForbiddenHTTPError()
    errUnauthorized    = pkgErrors.NewUnauthorizedHTTPError()
    errInvalidObjectID = pkgErrors.NewHTTPError(400, "Invalid object ID")
    errWrongQuery      = pkgErrors.NewHTTPError(400, "Wrong query")
)

func (h handler) mapError(err error) error {
    switch err {
    case usecase.ErrNotFound:
        return errNotFound
    case usecase.ErrForbidden:
        return errForbidden
    case usecase.ErrUnauthorized:
        return errUnauthorized
    case usecase.ErrInvalidObjectID:
        return errInvalidObjectID
    }

    return err
}
```

### 5. Error Definitions

**Use Case Errors** (`usecase/errors.go`):
```go
package usecase

import "errors"

var (
    ErrNotFound        = errors.New("{module} not found")
    ErrUnauthorized    = errors.New("unauthorized")
    ErrForbidden       = errors.New("forbidden")
    ErrInvalidObjectID = errors.New("invalid object ID")
)
```

---

## Naming Conventions

### General Rules
1. **Interfaces**: Noun describing the contract (e.g., `Repository`, `Usecase`, `Handler`)
2. **Implementations**: Prefix with `impl` (e.g., `implRepository`, `implUsecase`, `handler`)
3. **Constructors**: Always named `New` or `New{Type}` (e.g., `New`, `New`)
4. **Files**: Lowercase snake_case (e.g., `process_request.go`, `uc_types.go`)
5. **Packages**: Lowercase, single word (e.g., `branch`, `usecase`, `mongo`)

### Variable Names
- `ctx` for `context.Context`
- `sc` for `models.Scope`
- `l` for logger
- `uc` for use case
- `repo` for repository
- `db` for database
- `col` for collection
- `req` for request
- `resp` for response
- `err` for error
- `opts` for options
- Abbreviated entity names (e.g., `br` for branch, `u` for user)

### Type Suffixes
- `Options`: Repository layer parameters (e.g., `CreateOptions`, `UpdateOptions`)
- `Input`: Use case layer parameters (e.g., `CreateInput`, `GetInput`)
- `Output`: Use case layer results (e.g., `GetOutput`, `GetOneOutput`)
- `Filter`: Query filtering criteria
- `Req`: HTTP request types (unexported, e.g., `createReq`, `updateReq`)
- `Resp`: HTTP response types (unexported, e.g., `detailResp`, `GetResponse`)
- `Request`: HTTP request types (exported, e.g., `GetRequest`, `GetByIDRequest`)
- `Response`: HTTP response types (exported, e.g., `GetResponse`, `LoginResponse`)

### Collection Names
- MongoDB collection names: Lowercase plural (e.g., `"branches"`, `"users"`)
- Stored as constants: `{module}Collection` (e.g., `branchCollection`)

---

## Type System

### Domain Models (`internal/models/`)

```go
package models

import (
    "time"

    "go.mongodb.org/mongo-driver/bson/primitive"
)

type {Module} struct {
    ID        primitive.ObjectID  `bson:"_id"`
    Field1    string              `bson:"field1"`
    Field2    string              `bson:"field2"`
    RefID     primitive.ObjectID  `bson:"ref_id"`
    CreatedAt time.Time           `bson:"created_at"`
    UpdatedAt time.Time           `bson:"updated_at"`
    DeletedAt *time.Time          `bson:"deleted_at,omitempty"`
}
```

**Key Rules:**
- Use `primitive.ObjectID` for MongoDB IDs
- Always include: `ID`, `CreatedAt`, `UpdatedAt`, `DeletedAt`
- `DeletedAt` must be pointer for soft delete
- Use BSON tags for MongoDB field mapping
- Field names in BSON: lowercase snake_case

### Scope and Authorization

```go
type Scope struct {
    UserID   string
    ShopID   string
    RegionID string
    BranchID string
    Role     string
}
```

Pass `models.Scope` to all repository and use case methods for authorization context.

---

## Code Patterns

### 1. Soft Delete Pattern

**Always use soft delete** by setting `deleted_at` timestamp:

```go
// Delete implementation
upd := bson.M{"$set": bson.M{"deleted_at": repo.clock()}}
res, err := col.UpdateOne(ctx, fil, upd)
```

**Include in filters**:
```go
filter := bson.M{"deleted_at": nil}
```

### 2. Pagination Pattern

```go
func (repo implRepository) Get(ctx context.Context, sc models.Scope, input {module}.GetInput) ([]models.{Module}, paginator.Paginator, error) {
    col := repo.get{Module}Collection()

    fil, err := repo.buildGetFilter(input.Filter)
    if err != nil {
        repo.l.Errorf(ctx, "{module}.{db}.Get", err)
        return nil, paginator.Paginator{}, {db}.ErrInvalidObjectID
    }

    var (
        entities []models.{Module}
        total    int64
    )

    g, gctx := errgroup.WithContext(ctx)

    // Count documents
    g.Go(func() error {
        var err error
        total, err = col.CountDocuments(gctx, fil)
        if err != nil {
            repo.l.Warnf(ctx, "{module}.{db}.Get.CountDocuments: %v", err)
        }
        return err
    })

    // Fetch paginated results
    g.Go(func() error {
        opts := options.Find().SetLimit(input.Pagin.Limit).SetSkip(input.Pagin.Offset())
        crs, err := col.Find(gctx, fil, opts)
        if err != nil {
            repo.l.Errorf(ctx, "{module}.{db}.Get", err)
            return err
        }
        defer crs.Close(gctx)

        if err = crs.All(gctx, &entities); err != nil {
            repo.l.Errorf(ctx, "{module}.{db}.Get", err)
            return err
        }
        return nil
    })

    if err := g.Wait(); err != nil {
        return nil, paginator.Paginator{}, err
    }

    pag := paginator.Paginator{
        Total:       total,
        Count:       int64(len(entities)),
        PerPage:     input.Pagin.Limit,
        CurrentPage: input.Pagin.Page,
    }

    return entities, pag, nil
}
```

### 3. Concurrent Data Fetching

Use `errgroup` for parallel operations:

```go
import "golang.org/x/sync/errgroup"

func (uc implUsecase) GetWithRelated(ctx context.Context, sc models.Scope, input GetInput) (GetOutput, error) {
    entities, pag, err := uc.repo.Get(ctx, sc, input)
    if err != nil {
        return GetOutput{}, err
    }

    var relatedData []RelatedModel

    g, gctx := errgroup.WithContext(ctx)

    g.Go(func() error {
        // Fetch related data concurrently
        ids := make(map[string]struct{})
        for _, entity := range entities {
            if entity.RefID != nil {
                ids[entity.RefID.Hex()] = struct{}{}
            }
        }

        for id := range ids {
            data, err := uc.relatedUC.GetOne(gctx, sc, RelatedInput{
                Filter: RelatedFilter{ID: id},
            })
            if err != nil {
                return err
            }
            relatedData = append(relatedData, data)
        }
        return nil
    })

    if err := g.Wait(); err != nil {
        uc.l.Warnf(ctx, "{module}.usecase.GetWithRelated: %v", err)
        return GetOutput{}, ErrDataFetch
    }

    return GetOutput{
        Entities:    entities,
        RelatedData: relatedData,
        Pagin:       pag,
    }, nil
}
```

### 4. Context Usage

**Always:**
- Pass `context.Context` as first parameter
- Extract context from Gin: `ctx := c.Request.Context()`
- Store user data in context: `ctx.Value("user").(models.User)`
- Pass JWT payload via context

### 5. Request Validation Pattern

```go
type createReq struct {
    Field1 string `json:"field1" binding:"required"`
    Field2 string `json:"field2" binding:"required"`
}

func (r createReq) validate() error {
    if strings.TrimSpace(r.Field1) == "" {
        return errWrongBody
    }
    if r.Field2 == "" {
        return errWrongBody
    }
    return nil
}
```

### 6. Clock Injection Pattern

For testable timestamps:

```go
type implRepository struct {
    l     log.Logger
    db    mongo.Database
    clock func() time.Time  // Injectable for testing
}

func New(l log.Logger, db mongo.Database) Repository {
    return &implRepository{
        l:     l,
        db:    db,
        clock: time.Now,  // Use real clock in production
    }
}

// In implementation
now := repo.clock()
```

---

## Error Handling

### Error Propagation Rules

1. **Repository Layer**: Return database-specific errors
2. **Use Case Layer**: Translate to domain errors
3. **HTTP Layer**: Map to HTTP status codes

### Error Chain

```go
// Repository
if err != nil {
    return models.Entity{}, err  // Return raw error
}

// Use Case
if err != nil {
    uc.l.Warnf(ctx, "{module}.Usecase.Method: %v", err)
    if errors.Is(err, mongo.ErrNoDocuments) || errors.Is(err, mongo.ErrInvalidObjectID) {
        return models.Entity{}, ErrNotFound
    }
    return models.Entity{}, err
}

// HTTP Handler
if err != nil {
    h.l.Warnf(ctx, "{module}.handler.method: %s", err)
    mapErr := h.mapError(err)
    response.Error(c, mapErr)
    return
}
```

### Use `errors.Is()` for Error Checking

```go
if errors.Is(err, mongo.ErrNoDocuments) {
    return ErrNotFound
}
```

**Never use `err == ErrType`** - always use `errors.Is()` or `errors.As()`

---

## Logging

### Logging Conventions

**Pattern**: `"{module}.{layer}.{method}.{operation}"`

Examples:
```go
// Warning logs with context
uc.l.Warnf(ctx, "branch.Usecase.Create error", err, "name", input.Name)
uc.l.Warnf(ctx, "user.usecase.Login.FindByEmail: %v", err)

// Error logs
repo.l.Errorf(ctx, "branch.mongo.Create.InsertOne", err)
repo.l.Errorf(ctx, "event.branch.http.processCreateRequest.ShouldBindJSON", err)
```

### Log Levels

- `Errorf()`: Technical errors (database, network, parsing)
- `Warnf()`: Business logic failures (not found, validation, unauthorized)
- `Infof()`: Informational messages
- `Debugf()`: Debug information (not used in production)

### Always Log Errors Before Returning

```go
if err != nil {
    uc.l.Warnf(ctx, "module.layer.method: %v", err)
    return Model{}, err
}
```

---


## Import Organization

### Import Order

1. Standard library
2. External packages
3. Internal packages

```go
import (
    // Standard library
    "context"
    "errors"
    "time"

    // External packages
    "github.com/gin-gonic/gin"
    "go.mongodb.org/mongo-driver/bson"
    "golang.org/x/sync/errgroup"

    // Internal packages
    "init-src/internal/models"
    "init-src/internal/{module}"
    "init-src/pkg/log"
    "init-src/pkg/mongo"
)
```

### Import Aliases

Use aliases for conflicting names or clarity:

```go
import (
    customJwt "init-src/pkg/jwt"
    pkgErrors "init-src/pkg/errors"
    deptUcErr "init-src/internal/department/usecase"
)
```

---

## Configuration

### Environment-Based Config

```go
package config

import (
    "fmt"

    "github.com/caarlos0/env/v6"
)

type Config struct {
    AppVersion string `env:"APP_VERSION" envDefault:"1.0.0"`
    Mode       string `env:"MODE" envDefault:"development"`

    HTTPServer HTTPServerConfig
    Logger     LoggerConfig
    Mongo      MongoConfig
}

type HTTPServerConfig struct {
    Port int    `env:"PORT"`
    Mode string `env:"MODE"`
}

type LoggerConfig struct {
    Level    string `env:"LOGGER_LEVEL" envDefault:"debug"`
    Mode     string `env:"MODE" envDefault:"development"`
    Encoding string `env:"LOGGER_ENCODING" envDefault:"console"`
}

func Load() (*Config, error) {
    cfg := &Config{}

    if err := env.Parse(cfg); err != nil {
        return nil, fmt.Errorf("failed to parse config: %w", err)
    }

    return cfg, nil
}
```

---

## Swagger/OpenAPI Documentation

### Handler Documentation

Every handler must have Swagger comments:

```go
// @Summary Create {module}
// @Description Create a new {module}
// @Tags {Modules}
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer JWT token"
// @Param body body createReq true "{Module} info"
// @Success 200 {object} detailResp
// @Failure 400 {object} response.Resp "Bad Request"
// @Failure 401 {object} response.Resp "Unauthorized"
// @Failure 403 {object} response.Resp "Forbidden"
// @Failure 500 {object} response.Resp "Internal Server Error"
// @Router /api/v1/{modules} [POST]
func (h handler) create(c *gin.Context) {
    // Implementation
}
```

### Response Types

All response types should be documented:

```go
// detailResp represents a single {module} in responses
type detailResp struct {
    // Unique identifier of the {module}
    ID string `json:"id"`
    // Name of the {module}
    Name string `json:"name"`
    // Creation timestamp
    CreatedAt response.DateTime `json:"created_at"`
}
```

---

## Common Utilities

### Alias and Code Generation

```go
import "init-src/pkg/util"

alias := util.BuildAlias(name)  // "Product Name" → "product-name"
code := util.BuildCode(name)    // "Product Name" → "PROD-NAME"
```

### DateTime Response

```go
import "init-src/pkg/response"

type Response struct {
    CreatedAt response.DateTime `json:"created_at"`
}

// Usage
resp := Response{
    CreatedAt: response.DateTime(entity.CreatedAt),
}
```

---

## Additional Guidelines

### DRY Principle
- Extract common patterns into helper functions
- Reuse types across similar operations
- Share utilities in `pkg/` directory

### SOLID Principles
- **Single Responsibility**: Each file/function has one purpose
- **Open/Closed**: Extend behavior without modifying existing code
- **Liskov Substitution**: Implementations must fulfill interface contracts
- **Interface Segregation**: Keep interfaces focused and minimal
- **Dependency Inversion**: Depend on interfaces, not implementations

### Code Comments
- Comment exported types and functions
- Explain "why" not "what" in comments
- Use TODO comments for future improvements
- Document complex business logic

### Security
- Never log sensitive data (passwords, tokens)
- Always validate user input
- Use prepared statements/parameterized queries
- Implement proper authorization checks
- Hash passwords before storage

---

## Checklist for New Feature Module

When creating a new feature module, ensure:

- [ ] Directory structure follows the standard pattern
- [ ] All required files are present (interfaces, types, implementations)
- [ ] Repository interface includes all CRUD operations
- [ ] Use case interface mirrors repository with appropriate transformations
- [ ] HTTP handlers have Swagger documentation
- [ ] Error definitions exist in all layers
- [ ] Errors are properly mapped between layers
- [ ] Logging follows the standard format
- [ ] Tests are written for all layers
- [ ] Mockery directives are added for interfaces
- [ ] Soft delete is implemented correctly
- [ ] Pagination is implemented for list endpoints
- [ ] Authorization checks are in place
- [ ] Request validation is comprehensive
- [ ] Routes are properly registered

---

## References

### Key Dependencies

- **Web Framework**: Gin (`github.com/gin-gonic/gin`)
- **MongoDB Driver**: `go.mongodb.org/mongo-driver`
- **PostgreSQL Driver**: `github.com/jackc/pgx/v5`
- **Redis**: `github.com/redis/go-redis/v9`
- **Logging**: Zap (`go.uber.org/zap`)
- **JWT**: `github.com/golang-jwt/jwt`
- **Config**: `github.com/caarlos0/env/v6`
- **Testing**: Testify (`github.com/stretchr/testify`)
- **Mocking**: Mockery (`github.com/vektra/mockery`)
- **Concurrency**: `golang.org/x/sync/errgroup`
- **API Docs**: Swaggo (`github.com/swaggo/swag`)

---

## Conclusion

This document serves as the single source of truth for coding standards in this project. All contributors must adhere to these guidelines to maintain code quality, consistency, and maintainability.

For questions or clarifications, please refer to existing implementations in `internal/branch` or `internal/user` as reference examples.
