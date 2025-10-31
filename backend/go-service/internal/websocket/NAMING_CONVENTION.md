# WebSocket Module - Naming Convention

## 🔧 Problem Fixed

### ❌ Before: Compilation Errors
```
internal\websocket\domain.go:11:6: Connection redeclared in this block
internal\websocket\connection.go:30:6: other declaration of Connection

internal\websocket\subscriber.go:13:6: Subscriber redeclared in this block
internal\websocket\domain.go:97:6: other declaration of Subscriber
```

### ✅ After: Clean Compilation
All modules compile successfully without conflicts.

---

## 📝 Naming Convention Applied

### **Interfaces vs Concrete Types**

Khi có cả interface và concrete type cùng concept, chúng ta đặt tên theo convention:

#### **Option 1: Suffix Interface (CHOSEN)**
```go
// Interface - suffix với "Interface"
type ConnInterface interface {
    GetUserID() string
    SendMessage(msg ServerMessage)
}

type SubscriberInterface interface {
    Run()
    Stop()
}

// Concrete type - tên ngắn gọn
type Connection struct {
    conn pkgWs.Conn
    userID string
}

type Subscriber struct {
    redis redis.Client
    hub *Hub
}
```

**Pros:**
- ✅ Code cũ không cần sửa (backward compatible)
- ✅ Rõ ràng đâu là interface, đâu là concrete
- ✅ Dễ migrate dần dần

**Cons:**
- ❌ Tên interface hơi dài
- ❌ Không theo "pure Go" style

---

#### **Option 2: Suffix Implementation (Go Style)**
```go
// Interface - tên ngắn gọn (idiomatic Go)
type Connection interface {
    GetUserID() string
    SendMessage(msg ServerMessage)
}

// Concrete type - suffix với "Impl" hoặc prefix
type wsConnection struct {
    conn pkgWs.Conn
}

type connectionImpl struct {
    conn pkgWs.Conn
}
```

**Pros:**
- ✅ Theo Go convention
- ✅ Interface có tên đẹp

**Cons:**
- ❌ Phải refactor toàn bộ code cũ
- ❌ Breaking change lớn

---

## 🎯 Current State

### **Interfaces (domain.go)**
```go
ConnInterface          // WebSocket connection interface
ConnectionManager      // Connection lifecycle manager
Broadcaster           // Message broadcasting
PresenceManager       // Online/offline status
TypingManager         // Typing indicators
SubscriberInterface   // Redis Pub/Sub listener
ConnectionFactory     // Factory for creating connections
Authenticator         // JWT token validation
```

### **Concrete Types (existing files)**
```go
Connection            // connection.go - WebSocket connection implementation
Hub                   // hub.go - Connection + broadcast manager (old)
Subscriber            // subscriber.go - Redis subscriber implementation
WSGateway            // gateway.go - Main orchestrator
```

---

## 🚀 Future Refactoring Path

### **Phase 1: Current (Done ✅)**
- Interfaces và concrete types coexist
- Không breaking changes
- Code cũ hoạt động bình thường

### **Phase 2: Gradual Migration**
```go
// Dần dần implement các interfaces
type connection struct {
    // implements ConnInterface
}

type broadcaster struct {
    // implements Broadcaster
}
```

### **Phase 3: Full Clean Architecture**
```go
// Rename để follow pure Go style
type Connection interface {}        // Interface
type wsConnection struct {}         // Implementation

type Subscriber interface {}        // Interface
type redisSubscriber struct {}      // Implementation
```

---

## 📖 Go Naming Best Practices

### **Interfaces**
1. **Single-method interfaces**: Name = Method name + "er"
   ```go
   type Reader interface {
       Read(p []byte) (n int, err error)
   }
   ```

2. **Multi-method interfaces**: Use noun
   ```go
   type ConnectionManager interface {
       Register(...)
       Unregister(...)
   }
   ```

3. **Avoid "I" prefix**: Go không dùng `IConnection`
   ```go
   // Bad
   type IConnection interface {}

   // Good
   type Connection interface {}
   ```

### **Implementations**
1. **Lowercase for private**:
   ```go
   type connection struct {}  // private
   type Connection struct {}  // public
   ```

2. **Descriptive names**:
   ```go
   type redisSubscriber struct {}
   type kafkaSubscriber struct {}
   type mockSubscriber struct {}
   ```

---

## ✅ Verification

Build successful for all modules:
```bash
✅ internal/websocket     - No errors
✅ cmd/wsgateway         - No errors
✅ cmd/api               - No errors
```

All binaries compile successfully:
```
bin/api.exe        - 47M
bin/wsgateway.exe  - 16M
bin/consumer.exe   - 23M
```

---

## 📚 References

- [Effective Go - Interface Names](https://go.dev/doc/effective_go#interface-names)
- [Go Code Review Comments - Interface Naming](https://github.com/golang/go/wiki/CodeReviewComments#interfaces)
- [Clean Architecture in Go](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
