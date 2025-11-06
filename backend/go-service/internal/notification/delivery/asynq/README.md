# Notification Delivery Layer - Redis Pub/Sub

## Overview

This delivery layer handles **notification generation tasks** from Asynq queue and publishes them to Redis Pub/Sub for WebSocket broadcasting. It replaces the old `internal/scheduler/workers/notification_handlers.go` with a clean architecture approach.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Asynq Queue                           │
│  - TaskNotifyNewMessage                                  │
│  - TaskNotifyClassInvite                                 │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│         Notification Delivery (redisPubSub)              │
│  - HandleNewMessage(): Handle new message notifications  │
│  - HandleClassInvite(): Handle class invite notifications│
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│         Notification Use Case                            │
│  - Create(): Create notification in database             │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│         Notification Repository (Postgres)               │
│  - Persist notification to database                      │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│              PostgreSQL Database                         │
│             notifications table                          │
└─────────────────────────────────────────────────────────┘

                       │ (After DB save)
                       ▼
┌─────────────────────────────────────────────────────────┐
│              Redis Pub/Sub                               │
│  Channel: ws:user:{user_id}                              │
│  Event: {"type": "notification.new", "data": {...}}     │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│              WebSocket Gateway                           │
│  Broadcasts to connected clients                         │
└─────────────────────────────────────────────────────────┘
```

## File Structure

```
internal/notification/delivery/redisPubSub/
├── new.go        # Handler constructor & interface
├── handler.go    # Task handlers implementation
├── routes.go     # Register handlers with Asynq
└── helpers.go    # Helper functions
```

## Components

### 1. Handler Interface (`new.go`)

```go
type Handler interface {
    HandleNewMessage(ctx context.Context, task *asynq.Task) error
    HandleClassInvite(ctx context.Context, task *asynq.Task) error
}
```

**Constructor:**
```go
func New(l log.Logger, uc notification.Usecase, redisClient redis.Client) Handler
```

**Dependencies:**
- `log.Logger`: For logging
- `notification.Usecase`: For creating notifications
- `redis.Client`: For publishing to Redis Pub/Sub

### 2. Task Handlers (`handler.go`)

#### HandleNewMessage

**Purpose:** Generate notifications for new messages

**Input payload:**
```json
{
  "event_type": "message.created",
  "message": {
    "id": "uuid",
    "conversation_id": "uuid",
    "sender_id": "507f1f77bcf86cd799439011",
    "content": "Hello world",
    "created_at": "2025-01-01T12:00:00Z"
  },
  "participants": ["user-id-1", "user-id-2"]
}
```

**Processing flow:**
1. Parse task payload
2. For each participant (except sender):
   - Create notification in database
   - Publish to Redis channel `ws:user:{user_id}`

**Notification fields:**
- **Type:** `NotificationNewMessage`
- **Title:** "New message"
- **Body:** First 100 chars of message content
- **EntityType:** "message"
- **EntityID:** Message ID
- **Data:** JSON with message_id, conversation_id, sender_id

#### HandleClassInvite

**Purpose:** Generate notifications for class invitations

**Input payload:**
```json
{
  "event_type": "class.member.added",
  "class": {
    "id": "uuid",
    "name": "CS101 - Introduction to Programming",
    "created_by": "507f1f77bcf86cd799439011"
  },
  "class_member": {
    "user_id": "507f1f77bcf86cd799439012",
    "role": "student"
  }
}
```

**Processing flow:**
1. Parse task payload
2. Create notification for the invited member
3. Publish to Redis channel `ws:user:{user_id}`

**Notification fields:**
- **Type:** `NotificationClassInvite`
- **Title:** "Class invitation"
- **Body:** "You have been added to class: {class_name}"
- **EntityType:** "class"
- **EntityID:** Class ID
- **Data:** JSON with class_id, class_name, role

### 3. Registration (`routes.go`)

```go
func RegisterNotificationHandlers(s *asynq.Server, h Handler) {
    s.HandleFunc(asynq.TaskNotifyNewMessage, h.HandleNewMessage)
    s.HandleFunc(asynq.TaskNotifyClassInvite, h.HandleClassInvite)
}
```

Registers handlers with Asynq server for the following task types:
- `asynq.TaskNotifyNewMessage` → `HandleNewMessage`
- `asynq.TaskNotifyClassInvite` → `HandleClassInvite`

### 4. Helper Functions (`helpers.go`)

**stringPtr(s string) *string**
- Returns pointer to string (for optional fields)

**truncateString(s string, maxLen int) string**
- Truncates string to maxLen characters
- Adds "..." if truncated
- Used for notification body (100 char limit)

## Usage in Scheduler

### Old Pattern (scheduler/workers/notification_handlers.go)

```go
// ❌ OLD WAY - Workers in scheduler package
notificationHandlers := workers.NewNotificationHandlers(s.l, s.notificationUC, s.redis)
s.asynqServer.HandleFunc(pkgAsynq.TaskNotifyNewMessage, notificationHandlers.HandleNewMessageNotification)
s.asynqServer.HandleFunc(pkgAsynq.TaskNotifyClassInvite, notificationHandlers.HandleClassInviteNotification)
```

### New Pattern (notification/delivery/redisPubSub)

```go
// ✅ NEW WAY - Clean architecture delivery layer
import notificationDelivery "init-src/internal/notification/delivery/redisPubSub"

notificationHandler := notificationDelivery.New(s.l, s.notificationUC, s.redis)
notificationDelivery.RegisterNotificationHandlers(s.asynqServer, notificationHandler)
```

## Redis Pub/Sub Event Format

When a notification is created, an event is published to Redis:

**Channel:** `ws:user:{user_id}`

**Event payload:**
```json
{
  "type": "notification.new",
  "data": {
    "notification": {
      "id": "uuid",
      "user_id": "507f1f77bcf86cd799439011",
      "type": "new_message",
      "title": "New message",
      "body": "Hello world",
      "entity_type": "message",
      "entity_id": "uuid",
      "data": "{\"message_id\":\"...\",\"conversation_id\":\"...\"}",
      "read_at": null,
      "created_at": "2025-01-01T12:00:00Z"
    }
  }
}
```

## Error Handling

### Partial Failure (New Message)

When creating notifications for multiple participants:
- Failures for individual users are logged but don't fail the task
- Processing continues for remaining participants
- Redis publish failures are logged as warnings (non-critical)

```go
for _, userID := range participants {
    if err := createNotification(userID); err != nil {
        h.l.Errorf(ctx, "Failed for user=%s: %v", userID, err)
        continue // ✅ Continue processing other users
    }
}
```

### Complete Failure (Class Invite)

Single notification creation:
- Database failure returns error → task will retry
- Redis publish failure is logged as warning → task succeeds

```go
notif, err := h.uc.Create(ctx, input)
if err != nil {
    return err // ❌ Fail task, will retry
}

if err := h.publishToRedis(ctx, userID, notif); err != nil {
    h.l.Warnf(ctx, "Publish failed: %v", err) // ⚠️ Log warning
    // ✅ Task succeeds even if publish fails
}
```

## Testing

### Unit Test Example

```go
package redispubsub_test

import (
    "context"
    "encoding/json"
    "testing"

    "init-src/internal/models"
    "init-src/internal/notification"
    "init-src/internal/notification/delivery/redisPubSub"
    "init-src/internal/notification/mocks"
    "init-src/pkg/asynq"

    "github.com/stretchr/testify/assert"
    "github.com/stretchr/testify/mock"
)

func TestHandleNewMessage_Success(t *testing.T) {
    // Setup
    mockUC := mocks.NewUsecase(t)
    mockRedis := &redis.MockClient{}
    logger := log.NewNoop()

    handler := redispubsub.New(logger, mockUC, mockRedis)

    // Mock data
    msg := models.Message{
        ID:             uuid.New(),
        ConversationID: uuid.New(),
        SenderID:       "sender-123",
        Content:        "Hello world",
    }

    payload, _ := json.Marshal(map[string]interface{}{
        "event_type":   "message.created",
        "message":      msg,
        "participants": []string{"user-1", "user-2", "sender-123"},
    })

    task := asynq.NewTask(asynq.TaskNotifyNewMessage, payload)

    // Expectations
    mockUC.On("Create", mock.Anything, mock.MatchedBy(func(input notification.CreateInput) bool {
        return input.UserID == "user-1" || input.UserID == "user-2"
    })).Return(models.Notification{}, nil).Times(2)

    mockRedis.On("Publish", mock.Anything, mock.Anything, mock.Anything).Return(nil)

    // Execute
    err := handler.HandleNewMessage(context.Background(), task)

    // Assert
    assert.NoError(t, err)
    mockUC.AssertExpectations(t)
}
```

## Comparison: Old vs New

| Aspect | Old (workers/) | New (delivery/redisPubSub) |
|--------|----------------|---------------------------|
| **Location** | `internal/scheduler/workers` | `internal/notification/delivery/redisPubSub` |
| **Package** | `workers` | `redispubsub` |
| **Separation** | Mixed with scheduler | Part of notification domain |
| **Testing** | Hard to test (coupled to scheduler) | Easy to test (standalone) |
| **Reusability** | Tied to scheduler | Reusable in other contexts |
| **Consistency** | Different pattern from projection | Same pattern as projection |
| **Naming** | `HandleNewMessageNotification` | `HandleNewMessage` |
| **Registration** | Manual `HandleFunc` calls | `RegisterNotificationHandlers()` |

## Benefits

### 1. Clean Architecture ✅
- Notification logic stays in notification domain
- Clear separation of concerns
- Follows CODING_STANDARDS.md

### 2. Consistency ✅
- Same pattern as `projection/delivery`
- Predictable structure across domains
- Easy to navigate codebase

### 3. Testability ✅
- Can mock `notification.Usecase`
- Can mock `redis.Client`
- No dependency on scheduler

### 4. Maintainability ✅
- Clear file organization
- Single responsibility per file
- Easy to add new notification types

### 5. Reusability ✅
- Can be used in different schedulers
- Can be used in tests
- Not coupled to specific Asynq setup

## Migration Checklist

- [x] Create `delivery/redisPubSub/new.go`
- [x] Create `delivery/redisPubSub/handler.go`
- [x] Create `delivery/redisPubSub/routes.go`
- [x] Create `delivery/redisPubSub/helpers.go`
- [x] Update `scheduler/scheduler.go` to use new delivery
- [x] Remove old imports from scheduler
- [ ] Delete `scheduler/workers/notification_handlers.go` (optional)
- [x] Test compilation
- [ ] Run integration tests
- [ ] Deploy and verify

## Troubleshooting

### Notifications not being created

1. Check Asynq queue:
   ```bash
   redis-cli
   > LLEN asynq:queues:default
   ```

2. Check logs:
   ```
   [INFO] notification.HandleNewMessage: msg=uuid
   [ERROR] notification.handleMessageCreated.Create: user=..., err=...
   ```

3. Check database:
   ```sql
   SELECT * FROM notifications ORDER BY created_at DESC LIMIT 10;
   ```

### WebSocket not receiving notifications

1. Check Redis Pub/Sub:
   ```bash
   redis-cli
   > PSUBSCRIBE ws:user:*
   ```

2. Check logs:
   ```
   [WARN] notification.handleMessageCreated.Publish: user=..., err=...
   ```

3. Verify Redis connection in scheduler

### Task retrying indefinitely

1. Check error type:
   - Database errors → Will retry (correct)
   - JSON unmarshal errors → Should not retry (check payload)

2. Check Asynq configuration:
   - Max retries
   - Retry intervals

## References

- **Notification Domain**: `F:\Personal\ktmt\internal\notification`
- **Projection Delivery** (reference): `F:\Personal\ktmt\internal\projection\delivery`
- **Old Implementation**: `F:\Personal\ktmt\internal\scheduler\workers\notification_handlers.go`
- **Scheduler**: `F:\Personal\ktmt\internal\scheduler\scheduler.go`
- **Design Document**: `F:\Personal\ktmt\DESIGN.md`
- **Coding Standards**: `F:\Personal\ktmt\CODING_STANDARDS.md`
