# Notification Domain Refactoring - Business Logic to Use Case

## Overview

This refactoring moves business logic from the delivery layer (`delivery/asynq/handler.go`) to the use case layer (`usecase/asynq.go`), following clean architecture principles and CODING_STANDARDS.md.

## Motivation

### Problems with Previous Architecture

1. **Business Logic in Delivery Layer** ❌
   - `handleMessageCreated()` and `handleClassMemberAdded()` contained domain logic
   - Delivery layer knew about notification data structures
   - Difficult to test business logic independently

2. **Infrastructure Coupling** ❌
   - Delivery layer directly coupled to Redis client
   - Hard to mock Redis for testing
   - Mixed concerns (task parsing + business logic + Redis)

3. **Code Duplication** ❌
   - Helper functions (`stringPtr`, `truncateString`) duplicated across domains
   - Not reusable for other parts of codebase

### Goals

- ✅ Separate business logic from infrastructure
- ✅ Make code testable with mock dependencies
- ✅ Follow clean architecture (CODING_STANDARDS.md)
- ✅ Reuse utility functions across codebase
- ✅ Consistency with projection domain pattern

## Architecture Changes

### Before (Anti-pattern)

```
┌────────────────────────────────┐
│  Asynq Task Queue              │
└────────────┬───────────────────┘
             │
             ▼
┌────────────────────────────────┐
│  Delivery Layer                │
│  - Parse JSON ✅               │
│  - Business logic ❌           │
│  - Create notifications ❌     │
│  - Publish Redis ❌            │
│  - Redis client dependency ❌  │
└────────────┬───────────────────┘
             │
             ▼
┌────────────────────────────────┐
│  Use Case Layer                │
│  - Only Create() method        │
└────────────────────────────────┘
```

### After (Clean Architecture)

```
┌────────────────────────────────┐
│  Asynq Task Queue              │
└────────────┬───────────────────┘
             │
             ▼
┌────────────────────────────────┐
│  Delivery Layer                │
│  - Parse JSON ✅               │
│  - Delegate to UC ✅           │
└────────────┬───────────────────┘
             │
             ▼
┌────────────────────────────────┐
│  Use Case Layer                │
│  - Business logic ✅           │
│  - Create notifications ✅     │
│  - Publish Redis ✅            │
│  - Redis client dependency ✅  │
└────────────┬───────────────────┘
             │
             ▼
┌────────────────────────────────┐
│  Repository + Redis            │
└────────────────────────────────┘
```

## File Changes

### 1. Moved Helper Functions to `pkg/util/utils.go`

**Added:**
```go
// StringPtr returns a pointer to the given string
func StringPtr(s string) *string {
    return &s
}

// TruncateString truncates a string to maxLen characters and adds "..." if truncated
func TruncateString(s string, maxLen int) string {
    if len(s) <= maxLen {
        return s
    }
    return s[:maxLen] + "..."
}
```

**Why pkg/util:**
- Reusable across all domains
- Not specific to notification
- Common utility pattern

### 2. Updated `uc_interface.go`

**Added methods:**
```go
// Asynq notification handlers (used by delivery layer)
HandleMessageCreatedNotification(ctx context.Context, msg models.Message, participants []string) error
HandleClassMemberAddedNotification(ctx context.Context, class models.Class, member models.ClassMember) error
```

**Why:**
- Clear contract between delivery and use case
- Testable interface
- Can be mocked for delivery tests

### 3. Updated `usecase/new.go`

**Before:**
```go
type implUsecase struct {
    l    log.Logger
    repo notification.Repository
    db   postgres.Database
}

func New(l log.Logger, repo notification.Repository, db postgres.Database) notification.Usecase
```

**After:**
```go
type implUsecase struct {
    l     log.Logger
    repo  notification.Repository
    db    postgres.Database
    redis redis.Client  // NEW
}

func New(l log.Logger, repo notification.Repository, db postgres.Database, redisClient redis.Client) notification.Usecase
```

**Why:**
- Use case needs Redis to publish events
- Proper dependency injection
- Can mock Redis in tests

### 4. Created `usecase/asynq.go` (NEW)

**Implemented:**
```go
func (uc *implUsecase) HandleMessageCreatedNotification(ctx context.Context, msg models.Message, participants []string) error
func (uc *implUsecase) HandleClassMemberAddedNotification(ctx context.Context, class models.Class, member models.ClassMember) error
func (uc *implUsecase) publishNotificationEvent(ctx context.Context, userID string, notif models.Notification) error
```

**Business Logic:**
1. **HandleMessageCreatedNotification:**
   - Loop through participants (skip sender)
   - Build notification data
   - Create notification via `uc.Create()`
   - Publish to Redis channel `ws:user:{user_id}`
   - Continue on individual failures (partial success)

2. **HandleClassMemberAddedNotification:**
   - Build notification data
   - Create notification via `uc.Create()`
   - Publish to Redis channel `ws:user:{user_id}`
   - Return error on failure (single recipient)

3. **publishNotificationEvent (private):**
   - Build Redis event payload
   - Publish to `ws:user:{user_id}` channel
   - Format: `{"type": "notification.new", "data": {...}}`

### 5. Simplified `delivery/asynq/handler.go`

**Before:** 165 lines with business logic

**After:** 64 lines, only infrastructure

**Before:**
```go
func (h *handler) HandleNewMessage(ctx context.Context, task *asynq.Task) error {
    // Parse payload
    var payload struct { ... }
    json.Unmarshal(task.Payload(), &payload)

    // Business logic ❌
    for _, userID := range participants {
        // Create notification
        // Build data
        // Publish Redis
    }
}
```

**After:**
```go
func (h *handler) HandleNewMessage(ctx context.Context, task *asynq.Task) error {
    // Parse payload
    var payload struct { ... }
    json.Unmarshal(task.Payload(), &payload)

    // Delegate to use case ✅
    return h.uc.HandleMessageCreatedNotification(ctx, payload.Message, payload.Participants)
}
```

### 6. Updated `delivery/asynq/new.go`

**Before:**
```go
type handler struct {
    l       log.Logger
    uc      notification.Usecase
    redis   redis.Client  // ❌ Shouldn't be here
}

func New(l log.Logger, uc notification.Usecase, redisClient redis.Client) Handler
```

**After:**
```go
type handler struct {
    l  log.Logger
    uc notification.Usecase
}

func New(l log.Logger, uc notification.Usecase) Handler
```

### 7. Deleted `delivery/asynq/helpers.go`

**Why:**
- Moved to `pkg/util/utils.go`
- More reusable location
- Follows DRY principle

### 8. Updated `internal/workers/worker.go`

**Before:**
```go
notificationUC := notificationUsecase.New(s.l, notificationRepo, s.postgresDatabase)
notificationHandler := notificationDelivery.New(s.l, notificationUC, s.redis)
```

**After:**
```go
notificationUC := notificationUsecase.New(s.l, notificationRepo, s.postgresDatabase, s.redis)
notificationHandler := notificationDelivery.New(s.l, notificationUC)
```

**Changes:**
- Redis passed to use case ✅
- Delivery simplified ✅

## Benefits

### 1. Clean Architecture ✅

| Layer      | Responsibility                    | Before | After |
|------------|-----------------------------------|--------|-------|
| Delivery   | Parse JSON, route to use case     | ❌     | ✅    |
| Use Case   | Business logic, orchestration     | ❌     | ✅    |
| Repository | Data persistence                  | ✅     | ✅    |

### 2. Testability ✅

**Use Case Tests:**
```go
func TestHandleMessageCreatedNotification(t *testing.T) {
    mockRepo := mocks.NewRepository(t)
    mockRedis := mocks.NewRedisClient(t)

    uc := usecase.New(logger, mockRepo, db, mockRedis)

    // Test business logic without Asynq
    err := uc.HandleMessageCreatedNotification(ctx, message, participants)

    assert.NoError(t, err)
    mockRepo.AssertExpectations(t)
    mockRedis.AssertExpectations(t)
}
```

**Delivery Tests:**
```go
func TestHandleNewMessage(t *testing.T) {
    mockUC := mocks.NewUsecase(t)

    handler := delivery.New(logger, mockUC)

    // Test JSON parsing without business logic
    err := handler.HandleNewMessage(ctx, task)

    assert.NoError(t, err)
    mockUC.AssertExpectations(t)
}
```

### 3. Maintainability ✅

- **Single Source of Truth:** Business logic in one place (use case)
- **Easy to Find:** No need to search across layers
- **Easy to Change:** Change logic in use case, delivery unchanged

### 4. Reusability ✅

- **Utility Functions:** `pkg/util` usable everywhere
- **Use Case Methods:** Can be called from different deliveries (HTTP, gRPC, CLI)
- **Consistent Pattern:** Same as projection domain

### 5. CODING_STANDARDS.md Compliance ✅

Following the 3-layer pattern:

```
┌─────────────────────────────────────┐
│  Delivery (asynq)                   │
│  - Infrastructure concerns only     │
│  - Asynq task parsing               │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  Use Case                            │
│  - Business logic                    │
│  - Orchestration                     │
│  - Domain rules                      │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  Repository                          │
│  - Data access                       │
│  - Persistence                       │
└─────────────────────────────────────┘
```

## Migration Guide

### For New Features

When adding new notification types:

1. **Add use case method** in `uc_interface.go`:
   ```go
   HandleXXXNotification(ctx context.Context, ...) error
   ```

2. **Implement in `usecase/asynq.go`**:
   ```go
   func (uc *implUsecase) HandleXXXNotification(...) error {
       // Business logic here
       notif, _ := uc.Create(ctx, input)
       uc.publishNotificationEvent(ctx, userID, notif)
   }
   ```

3. **Add delivery handler** in `delivery/asynq/handler.go`:
   ```go
   func (h *handler) HandleXXX(ctx context.Context, task *asynq.Task) error {
       var payload struct { ... }
       json.Unmarshal(task.Payload(), &payload)
       return h.uc.HandleXXXNotification(ctx, ...)
   }
   ```

4. **Register** in `delivery/asynq/routes.go`:
   ```go
   s.HandleFunc(asynq.TaskXXX, h.HandleXXX)
   ```

### Testing Strategy

1. **Unit test use case methods** with mocks
2. **Integration test delivery** with real Asynq (optional)
3. **Mock Redis** for predictable tests

## Verification

All code compiles successfully:

```bash
# Test notification domain
go build ./internal/notification/...

# Test workers
go build ./internal/workers/...

# Test worker binary
go build ./cmd/worker/...
```

## References

- **CODING_STANDARDS.md:** Section on 3-layer architecture
- **Projection Domain:** Similar pattern for reference
- **Clean Architecture:** Uncle Bob's principles
