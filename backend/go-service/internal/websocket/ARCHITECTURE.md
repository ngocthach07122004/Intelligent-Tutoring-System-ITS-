# WebSocket Module - Clean Architecture & SOLID

> **⚠️ NOTE**: Đây là **DESIGN DOCUMENT** cho future refactoring.
> **Current code** (gateway.go, hub.go, connection.go, subscriber.go) vẫn đang hoạt động bình thường.
> Document này định nghĩa interfaces và architecture để refactor dần dần khi cần.

## 🏛️ Architecture Overview

Module được thiết kế để refactor theo Clean Architecture và SOLID principles với interfaces rõ ràng, separation of concerns, và dependency inversion.

---

## 📁 Folder Structure

### **Current (Working) 🟢:**
```
internal/websocket/
├── domain.go              # ✅ Core domain interfaces (NEW)
├── types.go              # ✅ Message types
├── gateway.go            # ✅ Main orchestrator (OLD but working)
├── hub.go                # ✅ Connection + broadcast manager (OLD but working)
├── connection.go         # ✅ WebSocket connection (OLD but working)
├── subscriber.go         # ✅ Redis Pub/Sub (OLD but working)
├── ARCHITECTURE.md       # ✅ Design document (NEW)
├── NAMING_CONVENTION.md  # ✅ Naming guide (NEW)
└── delivery/http/        # ✅ HTTP handlers (NEW)
    ├── handler.go
    └── routes.go
```

### **Future (Planned) 🔵:**
```
internal/websocket/
├── domain.go                  # ✅ DONE
├── types.go                   # ✅ DONE
├── connection/                # 🔵 TODO - Connection management layer
│   ├── manager.go            # ConnectionManager implementation
│   ├── connection.go         # Connection implementation
│   └── new.go                # Factory
├── broadcast/                # 🔵 TODO - Broadcasting service
│   ├── service.go            # Broadcaster implementation
│   └── new.go                # Factory
├── presence/                 # 🔵 TODO - Presence management
│   ├── manager.go            # PresenceManager implementation
│   └── new.go                # Factory
├── typing/                   # 🔵 TODO - Typing indicators
│   ├── manager.go            # TypingManager implementation
│   └── new.go                # Factory
├── subscriber/               # 🔵 TODO - Refactor Redis Pub/Sub
│   ├── redis.go              # Subscriber implementation
│   └── new.go                # Factory
├── gateway.go                # 🔵 TODO - Refactored gateway
└── delivery/http/            # ✅ DONE
    ├── handler.go
    └── routes.go
```

---

## 🎯 SOLID Principles Applied

### **S - Single Responsibility Principle**

❌ **Before**: Hub did everything
```go
type Hub struct {
    // Manages connections
    // Handles broadcasting
    // Tracks presence
    // Tracks typing
    // Subscribes to events
}
```

✅ **After**: Each component has one responsibility
```go
// Chỉ quản lý connections
type ConnectionManager interface {
    Register(conn Connection)
    Unregister(conn Connection)
}

// Chỉ broadcast messages
type Broadcaster interface {
    BroadcastToConversation(...)
    BroadcastToUser(...)
}

// Chỉ quản lý presence
type PresenceManager interface {
    SetOnline(...)
    SetOffline(...)
}

// Chỉ quản lý typing
type TypingManager interface {
    SetTyping(...)
    GetTypingUsers(...)
}
```

---

### **O - Open/Closed Principle**

❌ **Before**: Muốn thêm tính năng phải modify Hub
```go
func (h *Hub) Run() {
    // Hardcoded logic
    // Cannot extend without modifying
}
```

✅ **After**: Open for extension, closed for modification
```go
// Có thể thêm implementation mới mà không modify interface
type Broadcaster interface {
    BroadcastToConversation(...)
}

// Có thể có nhiều implementations
type RedisBroadcaster struct {} // Qua Redis
type KafkaBroadcaster struct {} // Qua Kafka
type DirectBroadcaster struct {} // Direct in-memory
```

---

### **L - Liskov Substitution Principle**

✅ **After**: Mọi implementation đều thay thế được cho interface
```go
var broadcaster Broadcaster

// Có thể dùng bất kỳ implementation nào
broadcaster = broadcast.New(...)
broadcaster = mockBroadcaster{}  // For testing
broadcaster = redisBroadcaster{} // For production
```

---

### **I - Interface Segregation Principle**

❌ **Before**: Không có interfaces, hoặc interfaces quá lớn

✅ **After**: Interfaces nhỏ, tập trung
```go
// Clients chỉ depend vào những gì cần
type ConnectionManager interface {
    Register(conn Connection)
    Unregister(conn Connection)
    // Không force clients implement những gì không cần
}

type Broadcaster interface {
    BroadcastToConversation(...)
    BroadcastToUser(...)
    // Không mix với connection management
}
```

---

### **D - Dependency Inversion Principle**

❌ **Before**: High-level modules depend on low-level modules
```go
type Gateway struct {
    hub        *Hub              // Concrete type
    subscriber *Subscriber       // Concrete type
}
```

✅ **After**: Both depend on abstractions
```go
type Gateway struct {
    connManager ConnectionManager  // Interface
    broadcaster Broadcaster        // Interface
    presence    PresenceManager    // Interface
    typing      TypingManager      // Interface
    subscriber  Subscriber         // Interface
}

// Gateway không biết gì về implementations
// Dễ test, dễ mock, dễ thay thế
```

---

## 🔧 Component Responsibilities

### 1. **Connection Manager** (`connection/manager.go`)
**Responsibility**: Quản lý lifecycle của connections
- Register/Unregister connections
- Track user sessions
- Maintain connection pool
- Thread-safe operations

### 2. **Broadcaster** (`broadcast/service.go`)
**Responsibility**: Broadcast messages tới targets
- Broadcast to conversation subscribers
- Broadcast to specific users
- Broadcast to specific sessions
- Handle exclusions

### 3. **Presence Manager** (`presence/manager.go`)
**Responsibility**: Quản lý online/offline status
- Set user online/offline
- Track presence with Redis TTL
- Heartbeat refresh
- Get presence status

### 4. **Typing Manager** (`typing/manager.go`)
**Responsibility**: Quản lý typing indicators
- Set typing indicator (with TTL)
- Get who's typing in conversation
- Auto-expire after 10s

### 5. **Subscriber** (`subscriber/redis.go`)
**Responsibility**: Listen to Redis Pub/Sub
- Subscribe to `ws:*` channels
- Parse incoming events
- Forward to Broadcaster
- Handle reconnection

### 6. **Gateway** (`gateway.go`)
**Responsibility**: Orchestrate all components
- Initialize all services
- Wire dependencies
- Handle WebSocket upgrade
- Graceful shutdown

---

## 🔄 Data Flow

### **New Message Flow:**

```
1. API Server writes to Postgres + Outbox
                 ↓
2. Projection Worker processes event
                 ↓
3. Worker publishes to Redis: PUBLISH ws:conv:{id} {...}
                 ↓
4. Subscriber receives event (subscriber/redis.go)
                 ↓
5. Subscriber forwards to Broadcaster
                 ↓
6. Broadcaster gets target connections from ConnectionManager
                 ↓
7. Broadcaster sends message to each Connection
                 ↓
8. Connection writes to WebSocket (connection/connection.go)
```

### **Client Authentication Flow:**

```
1. Client connects to /ws endpoint
                 ↓
2. Gateway creates Connection
                 ↓
3. ConnectionManager registers Connection
                 ↓
4. Client sends auth message
                 ↓
5. Connection calls Authenticator.ValidateToken()
                 ↓
6. Connection.SetUserID(userID)
                 ↓
7. PresenceManager.SetOnline(userID)
```

---

## 🧪 Testing Benefits

### **Before**: Hard to test
```go
// Cannot mock, tightly coupled
hub := NewHub(...)
// Must have real Redis, real everything
```

### **After**: Easy to test
```go
// Mock any component
mockConnManager := &MockConnectionManager{}
mockBroadcaster := &MockBroadcaster{}
mockPresence := &MockPresenceManager{}

gateway := NewGateway(
    mockConnManager,
    mockBroadcaster,
    mockPresence,
    ...
)

// Test Gateway in isolation
```

---

## 📝 Usage Example

### **Creating Gateway (cmd/wsgateway/main.go):**

```go
// Old way (tightly coupled)
hub := websocket.NewHub(ctx, jwtManager, projector, l)
subscriber := websocket.NewSubscriber(ctx, redis, hub, l)
gateway := websocket.NewGateway(ctx, hub, subscriber, l)

// New way (dependency injection)
connManager := connection.NewManager(ctx, l)
broadcaster := broadcast.NewService(connManager, l)
presence := presence.NewManager(ctx, projector, l)
typing := typing.NewManager(ctx, projector, l)
subscriber := subscriber.NewRedis(ctx, redis, broadcaster, l)

gateway := websocket.NewGateway(
    ctx,
    connManager,
    broadcaster,
    presence,
    typing,
    subscriber,
    jwtManager,
    l,
)
```

---

## ✅ Benefits Summary

1. **Testability**: Mọi component có thể mock
2. **Maintainability**: Mỗi component rõ ràng, dễ hiểu
3. **Extensibility**: Thêm features không modify existing code
4. **Reusability**: Components có thể reuse ở nơi khác
5. **Flexibility**: Dễ dàng thay đổi implementation
6. **Documentation**: Interfaces là self-documenting
7. **Team Collaboration**: Team members có thể work parallel trên từng component

---

## 🚀 Migration Path

1. ✅ Create domain interfaces
2. ⏳ Create new implementations
3. ⏳ Update Gateway to use interfaces
4. ⏳ Update main.go
5. ⏳ Keep old code temporarily for comparison
6. ⏳ Test thoroughly
7. ⏳ Delete old code (hub.go, old connection.go)

---

## 📚 Additional Resources

- [Clean Architecture by Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://www.digitalocean.com/community/conceptual_articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design)
- [Dependency Injection in Go](https://github.com/google/wire)

---

**Status**:
- ✅ Architecture designed
- ✅ Domain interfaces created
- ✅ Current code working (no breaking changes)
- 🔵 Future implementations (optional, khi cần scale hoặc test)

**Current Code Status**:
- **Gateway**: Working ✅
- **Hub**: Working ✅
- **Connection**: Working ✅
- **Subscriber**: Working ✅
- **All tests pass**: ✅

**Next Steps** (Optional - khi có nhu cầu refactor):
1. Implement ConnectionManager following interface
2. Implement Broadcaster following interface
3. Implement PresenceManager following interface
4. Implement TypingManager following interface
5. Refactor Gateway to use new components
6. Migrate gradually (old + new coexist)
7. Remove old code when migration complete
