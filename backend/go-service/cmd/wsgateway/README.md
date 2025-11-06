# WebSocket Gateway

Separate WebSocket Gateway server for handling real-time WebSocket connections independently from the REST API server.

## Architecture

The WebSocket Gateway is a standalone service that:
- Handles WebSocket connections for real-time communication
- Listens to Redis Pub/Sub channels for events from the API server
- Broadcasts messages to connected clients
- Manages presence and typing indicators
- Runs independently from the API server for better scalability

## Communication Flow

```
Client → API Server → Postgres + Outbox
                ↓
        Projection Worker → Redis Pub/Sub
                ↓
        WS Gateway → WebSocket Clients
```

## Running the Server

### Development Mode

```bash
# Run WebSocket Gateway only
make run-ws

# Run both API and WebSocket Gateway
make run-all
```

### Production Build

```bash
# Build binary
make build-ws

# Run binary
./bin/wsgateway.exe
```

### Docker

```bash
# Run with Docker Compose
docker-compose up wsgateway

# Run all services
docker-compose up
```

## Configuration

Environment variables:

```bash
# WebSocket Gateway Port
WSGATEWAY_PORT=8081

# Redis configuration (for Pub/Sub)
REDIS_HOST=localhost:6379
REDIS_PASSWORD=redis_password
REDIS_DATABASE=0

# Postgres configuration (for projection queries)
POSTGRES_DSN=postgres://user:password@localhost:5432/dbname?sslmode=disable

# JWT configuration (for WebSocket authentication)
JWT_SECRET=your-secret-key

# Logger configuration
LOGGER_LEVEL=debug
LOGGER_ENCODING=console
MODE=development
```

## Endpoints

### WebSocket Endpoint
- **URL**: `ws://localhost:8081/ws`
- **Description**: WebSocket upgrade endpoint for client connections

### Health Check
- **URL**: `http://localhost:8081/health`
- **Method**: GET
- **Response**:
  ```json
  {
    "status": "ok",
    "connections": 42
  }
  ```

### Root
- **URL**: `http://localhost:8081/`
- **Method**: GET
- **Response**:
  ```json
  {
    "service": "WebSocket Gateway",
    "status": "ok"
  }
  ```

## WebSocket Protocol

### 1. Authentication

Client → Server:
```json
{
  "type": "auth",
  "payload": {
    "token": "jwt_token_here"
  }
}
```

Server → Client (Success):
```json
{
  "type": "auth.success",
  "payload": {
    "user_id": "507f1f77bcf86cd799439011",
    "session_id": "uuid-session-id"
  }
}
```

### 2. Subscribe to Conversations

Client → Server:
```json
{
  "type": "subscribe",
  "payload": {
    "conversation_ids": ["conv-uuid-1", "conv-uuid-2"]
  }
}
```

Server → Client:
```json
{
  "type": "subscribed",
  "payload": {
    "conversation_ids": ["conv-uuid-1", "conv-uuid-2"]
  }
}
```

### 3. Receive Messages

Server → Client:
```json
{
  "type": "message.new",
  "payload": {
    "conversation_id": "conv-uuid-1",
    "message": {
      "id": "msg-uuid",
      "sender_id": "user-uuid",
      "content": "Hello!",
      "created_at": "2025-10-27T12:00:00Z"
    }
  }
}
```

### 4. Typing Indicator

Client → Server:
```json
{
  "type": "typing",
  "payload": {
    "conversation_id": "conv-uuid-1"
  }
}
```

Server → Client (to other participants):
```json
{
  "type": "typing.start",
  "payload": {
    "conversation_id": "conv-uuid-1",
    "user_id": "user-uuid"
  }
}
```

### 5. Heartbeat (Keep-Alive)

Client → Server (every 30 seconds):
```json
{
  "type": "ping"
}
```

Server → Client:
```json
{
  "type": "pong"
}
```

## Benefits of Separate Gateway

1. **Performance**: Optimized for long-lived WebSocket connections
2. **Scalability**: Scale WebSocket and API servers independently
3. **Resource Isolation**: API crashes don't affect WebSocket connections
4. **Deployment Flexibility**: Update API without restarting WebSocket connections
5. **Better Monitoring**: Separate metrics for REST and WebSocket traffic

## Testing

### Manual Testing

1. Start the WebSocket Gateway:
   ```bash
   make run-ws
   ```

2. Connect using a WebSocket client:
   ```javascript
   const ws = new WebSocket('ws://localhost:8081/ws');

   ws.onopen = () => {
     // Authenticate
     ws.send(JSON.stringify({
       type: 'auth',
       payload: { token: 'your-jwt-token' }
     }));
   };

   ws.onmessage = (event) => {
     const message = JSON.parse(event.data);
     console.log('Received:', message);
   };
   ```

3. Subscribe to conversations:
   ```javascript
   ws.send(JSON.stringify({
     type: 'subscribe',
     payload: { conversation_ids: ['conv-id-1', 'conv-id-2'] }
   }));
   ```

### Health Check

```bash
curl http://localhost:8081/health
```

Expected response:
```json
{
  "status": "ok",
  "connections": 0
}
```

## Architecture Diagram

```
┌─────────────────────┐         ┌──────────────────────┐
│   API Server        │         │  WS Gateway Server   │
│   (Port 8080)       │         │  (Port 8081)         │
│                     │         │                      │
│  - REST handlers    │         │  - WebSocket upgrade │
│  - Business logic   │         │  - Hub management    │
│  - Write to PG      │         │  - Connection pools  │
│  - Write to Outbox  │         │  - Presence/typing   │
└──────────┬──────────┘         └──────────┬───────────┘
           │                               │
           │         ┌─────────────┐       │
           └────────>│   Redis     │<──────┘
                     │  Pub/Sub    │
                     │             │
                     │ ws:conv:{id}│
                     │ ws:user:{id}│
                     └─────────────┘
```

## Troubleshooting

### Connection Refused
- Ensure Redis is running: `docker-compose up redis`
- Check REDIS_HOST configuration

### Authentication Failed
- Verify JWT_SECRET matches the API server
- Check token expiration

### No Messages Received
- Verify subscription to correct conversation IDs
- Check Redis Pub/Sub channels: `redis-cli PSUBSCRIBE ws:*`
- Ensure Projection Worker is publishing events

## Development Notes

- WebSocket connections timeout after 60 seconds of inactivity
- Ping/pong heartbeat every 30 seconds
- Typing indicators expire after 10 seconds
- Presence status expires after 90 seconds
- Maximum message size: 8KB
