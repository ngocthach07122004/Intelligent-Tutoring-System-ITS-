# Chat & Notification System - Design Document

> **Version**: 1.0
> **Last Updated**: 2025-10-17
> **Architecture**: CQRS + Event-Driven với Postgres (Write) + Redis (Read Projections)

---

## Table of Contents

- [1. Overview](#1-overview)
- [2. Architecture](#2-architecture)
- [3. Database Design (PostgreSQL)](#3-database-design-postgresql)
- [4. Redis Data Structures](#4-redis-data-structures)
- [5. Domain Models](#5-domain-models)
- [6. Events & Messages](#6-events--messages)
- [7. API Endpoints](#7-api-endpoints)
- [8. WebSocket Protocol](#8-websocket-protocol)
- [9. Flow Diagrams](#9-flow-diagrams)
- [10. Implementation Plan](#10-implementation-plan)

---

## 1. Overview

### 1.1 Business Requirements

**Tính năng chính:**
1. **Chat 1-1 và Group Chat** giữa học sinh - giảng viên
2. **Hệ thống thông báo** (in-app notification)
3. **Quản lý lớp học** với roles (Teacher, Student, TA, Observer)
4. **Tìm kiếm** trong lịch sử chat
5. **Realtime updates** qua WebSocket

### 1.2 Tech Stack

| Component | Technology | Note |
|-----------|-----------|------|
| **Write Model** | PostgreSQL | Source of truth |
| **Read Model** | Redis | Projections (conversation list, unread, last message) |
| **API Server** | Gin + REST | CRUD operations |
| **WebSocket** | github.com/coder/websocket | Realtime push (via pkg/websocket wrapper) |
| **Message Queue** | Asynq (Redis) | Background jobs |
| **Outbox** | PostgreSQL | Transactional event publishing |
| **Search** | Postgres FTS | Full-text search |
| **Existing Code** | MongoDB | Không đổi (User, Branch, Shop, ...) |

### 1.3 Key Patterns

- **CQRS**: Write vào Postgres, Read từ Redis projections
- **Outbox Pattern**: Ghi event + business data trong 1 transaction
- **Event-Driven**: Asynq workers xử lý events, đẩy qua Redis Pub/Sub
- **WebSocket Gateway**: Server push events tới connected clients
- **Idempotent Projections**: Redis data có thể rebuild từ Postgres

---

## 2. Architecture

### 2.1 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Web/Mobile)                      │
└────────────┬────────────────────────────┬───────────────────────┘
             │ REST API                   │ WebSocket (WSS)
             │                            │
┌────────────▼────────────────────────────▼───────────────────────┐
│                      API SERVER (Gin)                            │
│  ┌──────────────┐  ┌─────────────┐  ┌────────────────────┐     │
│  │ REST Handler │  │ WS Gateway  │  │  Middleware        │     │
│  │  (CRUD)      │  │ (Push/Sub)  │  │  (Auth, Logging)   │     │
│  └──────┬───────┘  └──────┬──────┘  └────────────────────┘     │
│         │                  │                                     │
│  ┌──────▼──────────────────▼──────────┐                         │
│  │         Use Case Layer             │                         │
│  │  - CreateMessage                   │                         │
│  │  - GetConversations                │                         │
│  │  - CreateClass, InviteMembers      │                         │
│  └──────┬─────────────────────────────┘                         │
│         │                                                        │
│  ┌──────▼────────────┐  ┌────────────────────┐                 │
│  │ Repository (PG)   │  │ Projection (Redis) │                 │
│  │ - Write model     │  │ - Read model       │                 │
│  └──────┬────────────┘  └────────────────────┘                 │
└─────────┼─────────────────────────────────────────────────────┘
          │
┌─────────▼─────────────────────────────────────────────────────┐
│                   DATA LAYER                                   │
│  ┌────────────────┐         ┌──────────────┐                  │
│  │   PostgreSQL   │         │    Redis     │                  │
│  │  - messages    │         │ - conv:list  │                  │
│  │  - classes     │         │ - msg:hash   │                  │
│  │  - outbox      │         │ - unread     │                  │
│  └────────┬───────┘         │ - presence   │                  │
│           │                 │ - pub/sub    │                  │
│           │                 └──────▲───────┘                  │
│  ┌────────▼────────┐               │                          │
│  │ Outbox Worker   │───────────────┘                          │
│  │ (Asynq)         │  Polling every 100ms                     │
│  └────────┬────────┘                                           │
│           │                                                    │
│  ┌────────▼────────────────────────────┐                      │
│  │    Asynq Task Queue (Redis)        │                      │
│  └────────┬───────────────────────────┘                      │
│           │                                                    │
│  ┌────────▼──────────┐  ┌────────────────┐                   │
│  │ Projection Worker │  │  Notify Worker │                   │
│  │ - Update Redis    │  │ - Send in-app  │                   │
│  │ - Publish WS      │  └────────────────┘                   │
│  └───────────────────┘                                        │
└───────────────────────────────────────────────────────────────┘
```

### 2.2 Component Responsibilities

#### **API Server** (`cmd/api`)
- REST handlers cho CRUD operations
- WebSocket gateway cho realtime
- Authentication & authorization
- Request validation

#### **Outbox Worker** (trong `cmd/consumer`)
- Poll outbox table mỗi 100ms
- Publish events vào Asynq queue
- Mark processed events

#### **Projection Worker** (trong `cmd/consumer`)
- Subscribe Asynq tasks
- Update Redis read models (conversation list, unread, last message)
- Publish WebSocket events qua Redis Pub/Sub

#### **Notification Worker** (trong `cmd/consumer`)
- Tạo in-app notifications
- Lưu vào Redis hoặc Postgres (TBD)

### 2.3 Data Flow: Write Path

```
1. Client POST /api/v1/messages
   ↓
2. REST Handler validates request
   ↓
3. Use Case: CreateMessage()
   ↓
4. BEGIN TRANSACTION
   - Insert into messages table
   - Insert into outbox table (event payload)
   COMMIT
   ↓
5. Return 200 OK to client
   ↓
6. [Async] Outbox Worker polls
   ↓
7. Enqueue Asynq task
   ↓
8. Projection Worker receives task
   ↓
9. Update Redis:
   - conv:{uid}:list (ZADD)
   - conv:{cid}:meta (HSET)
   - conv:{cid}:unread:{uid} (INCR)
   - msg:{mid} (HSET with 30d TTL)
   ↓
10. Publish to Redis channel: ws:conv:{cid}
   ↓
11. WS Gateway broadcasts to connected clients
```

### 2.4 Data Flow: Read Path

```
1. Client GET /api/v1/conversations
   ↓
2. REST Handler
   ↓
3. Use Case: GetConversations()
   ↓
4. Try Redis first:
   - ZREVRANGE conv:{uid}:list 0 19
   - HMGET conv:{cid}:meta
   ↓
5. If cache miss → Fallback to Postgres
   ↓
6. Build projection và cache vào Redis
   ↓
7. Return to client
```

---

## 3. Database Design (PostgreSQL)

### 3.1 Schema Overview

```sql
-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For full-text search

-- Enums
CREATE TYPE class_member_role AS ENUM ('teacher', 'student', 'ta', 'observer');
CREATE TYPE conversation_type AS ENUM ('direct', 'group', 'class');
CREATE TYPE message_type AS ENUM ('text', 'system');
CREATE TYPE notification_type AS ENUM ('class_invite', 'mention', 'new_message');
CREATE TYPE event_status AS ENUM ('pending', 'processing', 'processed', 'failed');
```

### 3.2 Core Tables

#### **classes** (Lớp học)

```sql
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    code VARCHAR(50) UNIQUE NOT NULL, -- Mã lớp để mời (e.g., "CS101-2025")

    -- MongoDB User reference
    created_by VARCHAR(24) NOT NULL, -- MongoDB ObjectID

    -- Metadata
    archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_classes_code ON classes(code) WHERE deleted_at IS NULL;
CREATE INDEX idx_classes_created_by ON classes(created_by) WHERE deleted_at IS NULL;
```

#### **class_members** (Thành viên lớp)

```sql
CREATE TABLE class_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,

    -- MongoDB User reference
    user_id VARCHAR(24) NOT NULL, -- MongoDB ObjectID

    role class_member_role NOT NULL DEFAULT 'student',

    joined_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,

    UNIQUE(class_id, user_id)
);

CREATE INDEX idx_class_members_class ON class_members(class_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_class_members_user ON class_members(user_id) WHERE deleted_at IS NULL;
```

#### **conversations** (Cuộc trò chuyện)

```sql
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type conversation_type NOT NULL,

    -- For direct: null
    -- For group: user-defined name
    -- For class: auto-generated from class name
    name VARCHAR(255),

    -- Link to class if type='class'
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,

    -- Metadata
    created_by VARCHAR(24) NOT NULL, -- MongoDB ObjectID
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_conversations_type ON conversations(type) WHERE deleted_at IS NULL;
CREATE INDEX idx_conversations_class ON conversations(class_id) WHERE deleted_at IS NULL;
```

#### **conversation_participants** (Người tham gia)

```sql
CREATE TABLE conversation_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,

    user_id VARCHAR(24) NOT NULL, -- MongoDB ObjectID

    -- Sequence number của tin nhắn cuối cùng đã đọc
    last_read_seq BIGINT DEFAULT 0,

    -- Đã rời khỏi conversation chưa
    left_at TIMESTAMPTZ,

    joined_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(conversation_id, user_id)
);

CREATE INDEX idx_conv_participants_conv ON conversation_participants(conversation_id);
CREATE INDEX idx_conv_participants_user ON conversation_participants(user_id);
```

#### **messages** (Tin nhắn)

```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,

    sender_id VARCHAR(24) NOT NULL, -- MongoDB ObjectID

    -- Sequence number (auto-increment per conversation)
    seq BIGSERIAL,

    type message_type NOT NULL DEFAULT 'text',
    content TEXT NOT NULL,

    -- For future: file attachments (JSON array)
    attachments JSONB,

    -- Reply to another message
    reply_to_id UUID REFERENCES messages(id) ON DELETE SET NULL,

    -- Edit history
    edited_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,

    -- Full-text search
    search_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('english', coalesce(content, ''))
    ) STORED
);

CREATE INDEX idx_messages_conv ON messages(conversation_id, seq DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_messages_sender ON messages(sender_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_messages_created ON messages(created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_messages_search ON messages USING GIN(search_vector);

-- Unique sequence per conversation
CREATE UNIQUE INDEX idx_messages_conv_seq ON messages(conversation_id, seq);
```

#### **notifications** (Thông báo in-app)

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    user_id VARCHAR(24) NOT NULL, -- MongoDB ObjectID (người nhận)

    type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT,

    -- Link to related entity
    entity_type VARCHAR(50), -- 'class', 'message', 'conversation'
    entity_id UUID,

    -- Metadata
    data JSONB,

    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_notifications_unread ON notifications(user_id) WHERE read_at IS NULL AND deleted_at IS NULL;
```

#### **outbox** (Event outbox pattern)

```sql
CREATE TABLE outbox (
    id BIGSERIAL PRIMARY KEY,

    -- Event metadata
    aggregate_type VARCHAR(100) NOT NULL, -- 'message', 'class', 'notification'
    aggregate_id UUID NOT NULL,
    event_type VARCHAR(100) NOT NULL, -- 'message.created', 'class.member_added'

    -- Event payload (JSON)
    payload JSONB NOT NULL,

    -- Processing status
    status event_status DEFAULT 'pending',
    attempts INT DEFAULT 0,
    last_error TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

CREATE INDEX idx_outbox_pending ON outbox(created_at) WHERE status = 'pending';
CREATE INDEX idx_outbox_aggregate ON outbox(aggregate_type, aggregate_id);
```

### 3.3 Key Constraints & Triggers

#### Auto-update `updated_at`

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### Sequence number cho messages

```sql
-- Messages trong 1 conversation có seq tăng dần từ 1
CREATE SEQUENCE messages_seq_generator START 1;

CREATE OR REPLACE FUNCTION assign_message_seq()
RETURNS TRIGGER AS $$
BEGIN
    NEW.seq := (
        SELECT COALESCE(MAX(seq), 0) + 1
        FROM messages
        WHERE conversation_id = NEW.conversation_id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER assign_message_seq_trigger
BEFORE INSERT ON messages
FOR EACH ROW EXECUTE FUNCTION assign_message_seq();
```

---

## 4. Redis Data Structures

### 4.1 Projection Keys (No TTL)

#### **Conversation List**
```
Key:    conv:{user_id}:list
Type:   SORTED SET
Score:  Unix timestamp (ms) của last message
Member: {conversation_id}
Size:   Giới hạn 500 conversations (ZREMRANGEBYRANK)

Example:
ZADD conv:507f1f77bcf86cd799439011:list 1704067200000 "uuid-of-conv-1"
ZADD conv:507f1f77bcf86cd799439011:list 1704070800000 "uuid-of-conv-2"

Query: ZREVRANGE conv:507f1f77bcf86cd799439011:list 0 19 WITHSCORES
```

#### **Conversation Metadata**
```
Key:  conv:{conversation_id}:meta
Type: HASH

Fields:
- type: "direct" | "group" | "class"
- name: "Class CS101" (nullable)
- last_msg_id: "uuid"
- last_msg_text: "Hello world" (truncated to 100 chars)
- last_msg_at: "1704067200000" (Unix ms)
- last_msg_sender: "507f1f77bcf86cd799439011" (MongoDB User ID)

Example:
HMSET conv:uuid-123:meta
  type "group"
  name "Project Team A"
  last_msg_id "msg-uuid-456"
  last_msg_text "Let's meet tomorrow"
  last_msg_at "1704067200000"
  last_msg_sender "507f1f77bcf86cd799439011"
```

#### **Unread Counter**
```
Key:  conv:{conversation_id}:unread:{user_id}
Type: STRING (integer)
TTL:  None (reset về 0 khi user đọc)

Example:
INCR conv:uuid-123:unread:507f1f77bcf86cd799439011
→ 5

DECR hoặc SET 0 khi user mark as read
```

#### **Participant List** (Optional, để WS routing)
```
Key:    conv:{conversation_id}:participants
Type:   SET
Member: {user_id}

Example:
SADD conv:uuid-123:participants "507f1f77bcf86cd799439011" "507f1f77bcf86cd799439012"

Query: SISMEMBER conv:uuid-123:participants "507f1f77bcf86cd799439011"
```

### 4.2 Cache Keys (With TTL)

#### **Message Hash** (30 days)
```
Key:  msg:{message_id}
Type: HASH
TTL:  30 days (2592000s)

Fields:
- id: "uuid"
- conversation_id: "uuid"
- sender_id: "507f1f77bcf86cd799439011"
- seq: "123"
- content: "Hello world"
- created_at: "2025-01-01T12:00:00Z"
- reply_to_id: "uuid" (nullable)
- edited_at: "" (nullable)

Example:
HMSET msg:uuid-456
  id "uuid-456"
  conversation_id "uuid-123"
  sender_id "507f1f77bcf86cd799439011"
  seq "123"
  content "Hello world"
  created_at "2025-01-01T12:00:00Z"

EXPIRE msg:uuid-456 2592000
```

#### **Presence (Online Status)** (60-90s)
```
Key:  presence:{user_id}
Type: STRING (enum: "online", "away")
TTL:  90 seconds

Example:
SET presence:507f1f77bcf86cd799439011 "online" EX 90

Client heartbeat mỗi 30s để refresh
```

#### **Typing Indicator** (5-10s)
```
Key:  typing:{conversation_id}:{user_id}
Type: STRING ("1")
TTL:  10 seconds

Example:
SET typing:uuid-123:507f1f77bcf86cd799439011 "1" EX 10

Query all typing users:
KEYS typing:uuid-123:* (hoặc dùng SET để efficient hơn)
```

#### **Search Cache** (60s)
```
Key:  search:{user_id}:{hash(query)}
Type: STRING (JSON array)
TTL:  60 seconds

Example:
SET search:507f1f77bcf86cd799439011:abc123 "[{\"id\":\"uuid-1\",\"content\":\"...\"}]" EX 60
```

### 4.3 Pub/Sub Channels

#### **WebSocket Events**
```
Channel: ws:conv:{conversation_id}
Payload: JSON
{
  "type": "message.created",
  "data": {
    "message": { ... }
  }
}

Usage:
- WS Gateway SUBSCRIBE to all user's conversations
- Projection worker PUBLISH after updating Redis
```

#### **Notification Events**
```
Channel: ws:user:{user_id}
Payload: JSON
{
  "type": "notification.new",
  "data": {
    "notification": { ... }
  }
}
```

### 4.4 Redis Config

```redis
# Eviction policy
maxmemory-policy volatile-lru  # Chỉ evict keys có TTL

# Max memory (adjust theo RAM server)
maxmemory 2gb

# Persistence (optional, để rebuild cache)
save 900 1
save 300 10
save 60 10000
```

---

## 5. Domain Models

### 5.1 Go Structs (internal/models/)

#### **class.go**

```go
package models

import (
    "time"

    "github.com/google/uuid"
)

type ClassMemberRole string

const (
    RoleTeacher  ClassMemberRole = "teacher"
    RoleStudent  ClassMemberRole = "student"
    RoleTA       ClassMemberRole = "ta"
    RoleObserver ClassMemberRole = "observer"
)

type Class struct {
    ID          uuid.UUID  `db:"id"`
    Name        string     `db:"name"`
    Description string     `db:"description"`
    Code        string     `db:"code"`
    CreatedBy   string     `db:"created_by"` // MongoDB User ID
    Archived    bool       `db:"archived"`
    CreatedAt   time.Time  `db:"created_at"`
    UpdatedAt   time.Time  `db:"updated_at"`
    DeletedAt   *time.Time `db:"deleted_at"`
}

type ClassMember struct {
    ID        uuid.UUID       `db:"id"`
    ClassID   uuid.UUID       `db:"class_id"`
    UserID    string          `db:"user_id"` // MongoDB User ID
    Role      ClassMemberRole `db:"role"`
    JoinedAt  time.Time       `db:"joined_at"`
    CreatedAt time.Time       `db:"created_at"`
    DeletedAt *time.Time      `db:"deleted_at"`
}
```

#### **conversation.go**

```go
package models

import (
    "time"

    "github.com/google/uuid"
)

type ConversationType string

const (
    ConversationDirect ConversationType = "direct"
    ConversationGroup  ConversationType = "group"
    ConversationClass  ConversationType = "class"
)

type Conversation struct {
    ID        uuid.UUID        `db:"id"`
    Type      ConversationType `db:"type"`
    Name      *string          `db:"name"`
    ClassID   *uuid.UUID       `db:"class_id"`
    CreatedBy string           `db:"created_by"` // MongoDB User ID
    CreatedAt time.Time        `db:"created_at"`
    UpdatedAt time.Time        `db:"updated_at"`
    DeletedAt *time.Time       `db:"deleted_at"`
}

type ConversationParticipant struct {
    ID             uuid.UUID  `db:"id"`
    ConversationID uuid.UUID  `db:"conversation_id"`
    UserID         string     `db:"user_id"`
    LastReadSeq    int64      `db:"last_read_seq"`
    LeftAt         *time.Time `db:"left_at"`
    JoinedAt       time.Time  `db:"joined_at"`
    CreatedAt      time.Time  `db:"created_at"`
}
```

#### **message.go**

```go
package models

import (
    "time"

    "github.com/google/uuid"
)

type MessageType string

const (
    MessageTypeText   MessageType = "text"
    MessageTypeSystem MessageType = "system"
)

type Message struct {
    ID             uuid.UUID   `db:"id"`
    ConversationID uuid.UUID   `db:"conversation_id"`
    SenderID       string      `db:"sender_id"` // MongoDB User ID
    Seq            int64       `db:"seq"`
    Type           MessageType `db:"type"`
    Content        string      `db:"content"`
    Attachments    *string     `db:"attachments"` // JSON
    ReplyToID      *uuid.UUID  `db:"reply_to_id"`
    EditedAt       *time.Time  `db:"edited_at"`
    CreatedAt      time.Time   `db:"created_at"`
    DeletedAt      *time.Time  `db:"deleted_at"`
}
```

#### **notification.go**

```go
package models

import (
    "time"

    "github.com/google/uuid"
)

type NotificationType string

const (
    NotificationClassInvite  NotificationType = "class_invite"
    NotificationMention      NotificationType = "mention"
    NotificationNewMessage   NotificationType = "new_message"
)

type Notification struct {
    ID         uuid.UUID        `db:"id"`
    UserID     string           `db:"user_id"` // MongoDB User ID
    Type       NotificationType `db:"type"`
    Title      string           `db:"title"`
    Body       string           `db:"body"`
    EntityType *string          `db:"entity_type"`
    EntityID   *uuid.UUID       `db:"entity_id"`
    Data       *string          `db:"data"` // JSON
    ReadAt     *time.Time       `db:"read_at"`
    CreatedAt  time.Time        `db:"created_at"`
    DeletedAt  *time.Time       `db:"deleted_at"`
}
```

#### **outbox.go**

```go
package models

import (
    "time"
    "github.com/google/uuid"
)

type EventStatus string

const (
    EventStatusPending    EventStatus = "pending"
    EventStatusProcessing EventStatus = "processing"
    EventStatusProcessed  EventStatus = "processed"
    EventStatusFailed     EventStatus = "failed"
)

type OutboxEvent struct {
    ID            int64       `db:"id"`
    AggregateType string      `db:"aggregate_type"`
    AggregateID   uuid.UUID   `db:"aggregate_id"`
    EventType     string      `db:"event_type"`
    Payload       string      `db:"payload"` // JSON
    Status        EventStatus `db:"status"`
    Attempts      int         `db:"attempts"`
    LastError     *string     `db:"last_error"`
    CreatedAt     time.Time   `db:"created_at"`
    ProcessedAt   *time.Time  `db:"processed_at"`
}
```

### 5.2 DTOs (Use Case Types)

Tuân theo CODING_STANDARDS.md, mỗi module sẽ có:
- `repo_types.go`: `CreateOptions`, `UpdateOptions`, `Filter`
- `uc_types.go`: `CreateInput`, `GetInput`, `GetOutput`, etc.

---

## 6. Events & Messages

### 6.1 Event Types

#### **Message Events**
```go
const (
    EventMessageCreated = "message.created"
    EventMessageEdited  = "message.edited"
    EventMessageDeleted = "message.deleted"
)
```

#### **Class Events**
```go
const (
    EventClassCreated      = "class.created"
    EventClassMemberAdded  = "class.member.added"
    EventClassMemberRemoved = "class.member.removed"
)
```

#### **Conversation Events**
```go
const (
    EventConversationCreated = "conversation.created"
    EventParticipantJoined   = "conversation.participant.joined"
    EventParticipantLeft     = "conversation.participant.left"
)
```

### 6.2 Event Payloads (JSON)

#### **message.created**
```json
{
  "aggregate_type": "message",
  "aggregate_id": "uuid-of-message",
  "event_type": "message.created",
  "payload": {
    "message": {
      "id": "uuid",
      "conversation_id": "uuid",
      "sender_id": "507f1f77bcf86cd799439011",
      "seq": 123,
      "content": "Hello world",
      "created_at": "2025-01-01T12:00:00Z"
    },
    "participants": ["user-id-1", "user-id-2"],
    "timestamp": "2025-01-01T12:00:00Z"
  }
}
```

### 6.3 Asynq Task Types

```go
const (
    TaskProjectMessage       = "projection:message"
    TaskProjectConversation  = "projection:conversation"
    TaskNotifyNewMessage     = "notify:new_message"
    TaskNotifyClassInvite    = "notify:class_invite"
)
```

---

## 7. API Endpoints

### 7.1 Class Management

```
POST   /api/v1/classes                 - Create class
GET    /api/v1/classes                 - List my classes
GET    /api/v1/classes/:id             - Get class detail
PUT    /api/v1/classes/:id             - Update class
DELETE /api/v1/classes/:id             - Delete class (soft)

POST   /api/v1/classes/:id/members     - Add member (invite)
DELETE /api/v1/classes/:id/members/:userId - Remove member
GET    /api/v1/classes/join/:code      - Join class by code
```

### 7.2 Conversations

```
POST   /api/v1/conversations           - Create conversation (1-1 or group)
GET    /api/v1/conversations           - List my conversations
GET    /api/v1/conversations/:id       - Get conversation detail
DELETE /api/v1/conversations/:id       - Leave conversation
```

### 7.3 Messages

```
POST   /api/v1/conversations/:id/messages        - Send message
GET    /api/v1/conversations/:id/messages        - Get messages (pagination)
PUT    /api/v1/conversations/:id/messages/:msgId - Edit message
DELETE /api/v1/conversations/:id/messages/:msgId - Delete message

POST   /api/v1/conversations/:id/read            - Mark as read
GET    /api/v1/conversations/:id/search?q=...    - Search messages
```

### 7.4 Notifications

```
GET    /api/v1/notifications           - List notifications
PUT    /api/v1/notifications/:id/read  - Mark as read
PUT    /api/v1/notifications/read-all  - Mark all as read
DELETE /api/v1/notifications/:id       - Delete notification
```

---

## 8. WebSocket Protocol

### 8.1 Connection

```
WSS /ws?token=<jwt_token>

Client → Server:
{
  "type": "auth",
  "payload": {
    "token": "jwt_token"
  }
}

Server → Client:
{
  "type": "auth.success",
  "payload": {
    "user_id": "507f1f77bcf86cd799439011",
    "session_id": "uuid"
  }
}
```

### 8.2 Subscribe to Conversations

```
Client → Server:
{
  "type": "subscribe",
  "payload": {
    "conversation_ids": ["uuid-1", "uuid-2"]
  }
}

Server → Client:
{
  "type": "subscribed",
  "payload": {
    "conversation_ids": ["uuid-1", "uuid-2"]
  }
}
```

### 8.3 Events from Server

#### **New Message**
```json
{
  "type": "message.new",
  "payload": {
    "conversation_id": "uuid",
    "message": {
      "id": "uuid",
      "sender_id": "507f1f77bcf86cd799439011",
      "seq": 123,
      "content": "Hello",
      "created_at": "2025-01-01T12:00:00Z"
    }
  }
}
```

#### **Typing Indicator**
```json
{
  "type": "typing.start",
  "payload": {
    "conversation_id": "uuid",
    "user_id": "507f1f77bcf86cd799439011"
  }
}
```

#### **Presence Update**
```json
{
  "type": "presence.update",
  "payload": {
    "user_id": "507f1f77bcf86cd799439011",
    "status": "online"
  }
}
```

### 8.4 Client Actions

#### **Typing Indicator**
```
Client → Server:
{
  "type": "typing",
  "payload": {
    "conversation_id": "uuid"
  }
}
```

#### **Heartbeat (Keep-Alive)**
```
Client → Server (every 30s):
{
  "type": "ping"
}

Server → Client:
{
  "type": "pong"
}
```

---

## 9. Flow Diagrams

### 9.1 UC-M3-01: Send Message (1-1 or Group)

```
┌──────┐                  ┌─────────┐              ┌──────────┐           ┌────────┐
│Client│                  │API Server│              │ Postgres │           │ Redis  │
└───┬──┘                  └────┬────┘              └────┬─────┘           └───┬────┘
    │                          │                        │                     │
    │ POST /messages           │                        │                     │
    │ {content: "Hi"}          │                        │                     │
    ├─────────────────────────>│                        │                     │
    │                          │                        │                     │
    │                          │ BEGIN TX               │                     │
    │                          ├───────────────────────>│                     │
    │                          │                        │                     │
    │                          │ INSERT messages        │                     │
    │                          │ (id, seq, content)     │                     │
    │                          ├───────────────────────>│                     │
    │                          │                        │                     │
    │                          │ INSERT outbox          │                     │
    │                          │ (event: message.created)│                    │
    │                          ├───────────────────────>│                     │
    │                          │                        │                     │
    │                          │ COMMIT                 │                     │
    │                          ├───────────────────────>│                     │
    │                          │                        │                     │
    │<─────────────────────────┤ 200 OK                 │                     │
    │ {message: {...}}         │                        │                     │
    │                          │                        │                     │
    │                          │ [ASYNC]                │                     │
    │                      ┌───┴────┐                   │                     │
    │                      │Outbox  │ Poll every 100ms  │                     │
    │                      │Worker  ├──────────────────>│                     │
    │                      └───┬────┘                   │                     │
    │                          │ SELECT * FROM outbox   │                     │
    │                          │ WHERE status='pending' │                     │
    │                          │<───────────────────────┤                     │
    │                          │                        │                     │
    │                          │ Enqueue Asynq task     │                     │
    │                          ├────────────────────────┼────────────────────>│
    │                          │                        │   (Redis queue)     │
    │                          │                        │                     │
    │                      ┌───┴────────┐               │                     │
    │                      │Projection  │ Consume task  │                     │
    │                      │Worker      │<──────────────┼─────────────────────┤
    │                      └───┬────────┘               │                     │
    │                          │                        │                     │
    │                          │ Update Redis projections│                    │
    │                          │ - conv:{uid}:list      │                     │
    │                          │ - conv:{cid}:meta      │                     │
    │                          │ - conv:{cid}:unread    │                     │
    │                          ├────────────────────────┼────────────────────>│
    │                          │                        │                     │
    │                          │ PUBLISH ws:conv:{cid}  │                     │
    │                          ├────────────────────────┼────────────────────>│
    │                          │                        │                     │
    │<═════════════════════════╪════════════════════════╪═════════════════════╡
    │ WebSocket: message.new   │                        │   (via Redis Pub/Sub)
    │                          │                        │                     │
```

### 9.2 UC-M3-02: Search Chat History

```
┌──────┐              ┌─────────┐            ┌────────┐         ┌──────────┐
│Client│              │API Server│            │ Redis  │         │ Postgres │
└───┬──┘              └────┬────┘            └───┬────┘         └────┬─────┘
    │                      │                     │                   │
    │ GET /search?q=hello  │                     │                   │
    ├─────────────────────>│                     │                   │
    │                      │                     │                   │
    │                      │ Try cache first     │                   │
    │                      ├────────────────────>│                   │
    │                      │ GET search:{hash}   │                   │
    │                      │                     │                   │
    │                      │<────────────────────┤ (miss)            │
    │                      │                     │                   │
    │                      │ SELECT * FROM messages                 │
    │                      │ WHERE search_vector @@ 'hello'          │
    │                      ├──────────────────────────────────────>  │
    │                      │                     │                   │
    │                      │<───────────────────────────────────────┤
    │                      │                     │                   │
    │                      │ Cache result        │                   │
    │                      ├────────────────────>│                   │
    │                      │ SETEX 60s           │                   │
    │                      │                     │                   │
    │<─────────────────────┤ 200 OK              │                   │
    │ {results: [...]}     │                     │                   │
```

### 9.3 UC-M3-03: Create Group Chat

```
┌──────┐              ┌─────────┐              ┌──────────┐
│Client│              │API Server│              │ Postgres │
└───┬──┘              └────┬────┘              └────┬─────┘
    │                      │                        │
    │ POST /conversations  │                        │
    │ {type: "group",      │                        │
    │  name: "Team A",     │                        │
    │  members: [...]}     │                        │
    ├─────────────────────>│                        │
    │                      │                        │
    │                      │ BEGIN TX               │
    │                      ├───────────────────────>│
    │                      │                        │
    │                      │ INSERT conversations   │
    │                      ├───────────────────────>│
    │                      │                        │
    │                      │ INSERT participants    │
    │                      │ (for each member)      │
    │                      ├───────────────────────>│
    │                      │                        │
    │                      │ INSERT system message  │
    │                      │ "Group created"        │
    │                      ├───────────────────────>│
    │                      │                        │
    │                      │ INSERT outbox events   │
    │                      ├───────────────────────>│
    │                      │                        │
    │                      │ COMMIT                 │
    │                      ├───────────────────────>│
    │                      │                        │
    │<─────────────────────┤ 200 OK                 │
    │ {conversation: {...}}│                        │
```

---

## 10. Implementation Plan

### Phase 1: Foundation (Week 1)

- [ ] **Database Setup**
  - Tạo migration scripts (dùng `golang-migrate` hoặc tương tự)
  - Apply schema vào Postgres
  - Setup connection pool trong `internal/appconfig/postgres`

- [ ] **Domain Models**
  - Tạo structs trong `internal/models/`
  - Implement basic validation

- [ ] **Outbox Infrastructure**
  - Implement `OutboxRepository` (Postgres)
  - Implement `OutboxWorker` trong `cmd/consumer`
  - Poll + enqueue Asynq tasks

### Phase 2: Class Management (Week 2)

- [ ] **Module: `internal/class`**
  - Repository (Postgres)
  - Use Case (CRUD classes, manage members)
  - HTTP Handlers + Routes
  - Swagger docs

- [ ] **Events**
  - `class.created`
  - `class.member.added`

### Phase 3: Chat System (Week 3-4)

- [ ] **Module: `internal/conversation`**
  - Repository (Postgres)
  - Use Case (create, list, get)
  - HTTP Handlers

- [ ] **Module: `internal/message`**
  - Repository (Postgres + Redis)
  - Use Case (send, edit, delete, list)
  - HTTP Handlers
  - Full-text search

- [ ] **Projection Workers**
  - Update Redis on message events
  - Handle conversation list, unread, last message

### Phase 4: WebSocket Gateway (Week 5)

- [ ] **WebSocket Server**
  - Connection management
  - Authentication via JWT
  - Subscribe/Unsubscribe to conversations
  - Redis Pub/Sub listener
  - Broadcast events to clients

- [ ] **Presence & Typing**
  - Update Redis on heartbeat
  - Broadcast typing indicators

### Phase 5: Notifications (Week 6)

- [ ] **Module: `internal/notification`**
  - Repository (Postgres hoặc Redis, TBD)
  - Use Case (create, list, mark read)
  - HTTP Handlers

- [ ] **Notification Worker**
  - Generate notifications on events
  - Push qua WebSocket

### Phase 6: Testing & Optimization (Week 7+)

- [ ] Load testing
- [ ] Redis memory optimization
- [ ] Query performance tuning
- [ ] Monitoring & logging

---

## Appendix: Questions & Decisions

### A. Notification Storage: Postgres vs Redis?

**Postgres:**
- ✅ Persistent, không mất data
- ✅ Dễ query (filter, pagination)
- ❌ Slower read

**Redis:**
- ✅ Cực nhanh
- ❌ Cần backup/persistence
- ❌ Giới hạn memory

**Decision:**
- Dùng **Postgres** làm source of truth
- Cache recent notifications (last 100) trong Redis với TTL 7 ngày

### B. User Data Sync: MongoDB → Postgres?

**Problem:** User info (name, avatar) nằm ở MongoDB, nhưng message cần hiển thị sender name.

**Options:**
1. **Denormalize:** Lưu sender name trong message table (snapshot tại thời điểm gửi)
2. **Join at read time:** Query MongoDB khi cần (slower)
3. **Cache in Redis:** User info cache với TTL

**Decision:**
- Dùng **Option 3**: Cache user info trong Redis
- Key: `user:{user_id}` (HASH: name, avatar, role)
- TTL: 1 hour
- Fallback to MongoDB if cache miss

---

## Next Steps

**User, vui lòng review và cho feedback:**

1. ✅ Database schema có đúng không?
2. ✅ Redis data structures có hợp lý không?
3. ✅ Architecture có vấn đề gì không?
4. ✅ Còn gì chưa rõ cần hỏi không?

**Sau khi approve, tôi sẽ bắt đầu implement theo thứ tự:**
1. Database migrations
2. Domain models
3. Outbox pattern
4. Class module (đơn giản nhất)
5. Conversation + Message module (phức tạp nhất)
6. WebSocket gateway
7. Notifications

Hỏi ngay nếu có gì chưa hiểu! 🚀
