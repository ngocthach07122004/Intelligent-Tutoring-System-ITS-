# WebSocket Module

## 📦 Current Status: **WORKING** ✅

Module này đang **hoạt động bình thường** và đã được tách riêng thành WebSocket Gateway service.

---

## 🗂️ Files Overview

### **Working Code (Production Ready)**

| File | Purpose | Status |
|------|---------|--------|
| `gateway.go` | Main WebSocket Gateway orchestrator | ✅ Working |
| `hub.go` | Connection + broadcast manager | ✅ Working |
| `connection.go` | Individual WebSocket connection handler | ✅ Working |
| `subscriber.go` | Redis Pub/Sub listener | ✅ Working |
| `types.go` | Message type definitions | ✅ Working |
| `delivery/http/handler.go` | HTTP upgrade handler | ✅ Working |
| `delivery/http/routes.go` | Route mapping | ✅ Working |

### **Design Documents (For Future)**

| File | Purpose | Status |
|------|---------|--------|
| `domain.go` | Interface definitions (SOLID) | 📖 Design Doc |
| `ARCHITECTURE.md` | Clean Architecture design | 📖 Design Doc |
| `NAMING_CONVENTION.md` | Naming convention guide | 📖 Design Doc |

---

## 🚀 How It Works

```
Client → /ws endpoint → Gateway.HandleWebSocket()
                              ↓
                    Connection created
                              ↓
                    Hub.Register(connection)
                              ↓
           Client sends auth message
                              ↓
           Connection authenticated
                              ↓
           Client subscribes to conversations
                              ↓
[Meanwhile] API Server publishes to Redis
                              ↓
           Subscriber receives event
                              ↓
           Hub broadcasts to connections
                              ↓
           Client receives message
```

---

## 📖 Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Clean Architecture design with SOLID principles
- **[NAMING_CONVENTION.md](./NAMING_CONVENTION.md)** - Why we use `ConnInterface` vs `Connection`
- **[cmd/wsgateway/README.md](../../cmd/wsgateway/README.md)** - How to run WebSocket Gateway

---

## 🎯 Why Design Documents?

Design documents (`domain.go`, `ARCHITECTURE.md`) được tạo để:

1. **Document best practices** - Chuẩn SOLID và Clean Architecture
2. **Guide future refactoring** - Khi cần scale hoặc thêm features
3. **Improve testability** - Interfaces giúp dễ test
4. **Team onboarding** - New members hiểu architecture nhanh

**Không cần implement ngay** - Current code đã đủ tốt cho production.

---

## 🔄 Future Refactoring (Optional)

Khi nào cần refactor theo Clean Architecture:

1. **Cần scale lớn** - Tách services nhỏ hơn
2. **Cần test coverage cao** - Mock dependencies
3. **Team lớn** - Multiple people work on same module
4. **Thêm features phức tạp** - Cần better separation

Current code hoàn toàn **OK để dùng production**.

---

## ⚙️ Configuration

WebSocket Gateway chạy độc lập với API Server:

```bash
# Environment variables
WSGATEWAY_PORT=8081
REDIS_HOST=localhost:6379
REDIS_PASSWORD=redis_password
JWT_SECRET=your-secret-key
```

---

## 🧪 Testing

```bash
# Build
make build-ws

# Run
make run-ws

# Test WebSocket connection
wscat -c ws://localhost:8081/ws
```

---

## 📝 Key Points

✅ **Current code works perfectly**
📖 **Design docs = future reference**
🔵 **Refactoring = optional (khi cần)**
🚀 **Production ready as-is**

---

## 🤝 Contributing

Khi add features mới:
1. Check `ARCHITECTURE.md` để hiểu design principles
2. Follow `NAMING_CONVENTION.md` cho naming
3. Keep SOLID principles in mind
4. Write tests nếu có thể

---

## 📞 Support

- **Issues**: GitHub Issues
- **Architecture Questions**: See `ARCHITECTURE.md`
- **WebSocket Protocol**: See `cmd/wsgateway/README.md`
