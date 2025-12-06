# User Profile Service API Design

## 🌐 Overview
The **User Profile Service** manages extended user information, learning preferences, schedules, and class group memberships.

> **🔧 Implementation**: For architecture details, design patterns, and technical implementation, see [User Profile Service README](../backend/java-service/user-profile-service/README.md).

## 🔌 REST API Endpoints

### 1. Profile Management
| Method | Path | Description | Role Required | Validation |
|:-------|:-----|:------------|:--------------|:-----------|
| `GET` | `/api/v1/profiles/me` | Get own profile. | `AUTHENTICATED` | None. |
| `PUT` | `/api/v1/profiles/me` | Update profile. | `AUTHENTICATED` | `timezone`: valid ZoneId, `bio`: max 500 chars. |
| `GET` | `/api/v1/profiles/{userId}` | Get public profile. | `AUTHENTICATED` | `userId`: valid UUID. |

**Get Profile Response** (`200 OK`):
```json
{
  "userId": "uuid-123",
  "bio": "Passionate learner",
  "timezone": "Asia/Ho_Chi_Minh",
  "learningStyle": "VISUAL",
  "avatarUrl": "https://..."
}
```

**Update Profile Request**:
```json
{
  "bio": "Updated bio",
  "timezone": "Asia/Ho_Chi_Minh",
  "learningStyle": "VISUAL"
}
```

### 2. Schedule Management
| Method | Path | Description | Role Required | Validation |
|:-------|:-----|:------------|:--------------|:-----------|
| `GET` | `/api/v1/schedules` | List My Schedule. | `STUDENT` | `from`, `to` (Date Range). |
| `POST` | `/api/v1/schedules` | Create Slot. | `STUDENT` | `recurrenceRule`: RFC 5545 format, `startTime` < `endTime`. |
| `DELETE` | `/api/v1/schedules/{id}` | Delete Slot. | `STUDENT` (Owner) | `id`: valid Long. |

**Create Schedule Request**:
```json
{
  "title": "Study Session",
  "startTime": "2023-11-24T14:00:00Z",
  "endTime": "2023-11-24T16:00:00Z",
  "isRecurring": true,
  "recurrenceRule": "FREQ=WEEKLY;BYDAY=MO,WE,FR"
}
```

**Validation**:
- `timezone`: Must be valid ZoneId (e.g., `Asia/Ho_Chi_Minh`).
- `recurrenceRule`: Must follow RFC 5545 format.

### 3. Group Management
| Method | Path | Description | Min Role Required | Validation |
|:-------|:-----|:------------|:------------------|:-----------|
| `POST` | `/api/v1/groups` | Create Group. | `TEACHER` | `name`: required, `description`: max 255 chars. |
| `POST` | `/api/v1/groups/join` | Join Group. | `STUDENT` | `joinCode`: exact match required. |
| `GET` | `/api/v1/groups` | List My Groups. | `AUTHENTICATED` | `role` (optional filter). |
| `GET` | `/api/v1/groups/{id}/members` | List Members. | `MEMBER` (of Group) | `id`: valid Long. |
| `DELETE` | `/api/v1/groups/{id}/members/{userId}` | Remove Member. | `LEADER` | `id`, `userId`: valid. |
| `PUT` | `/api/v1/groups/{id}/members/{userId}/role` | Promote/Demote. | `LEADER` | `role`: LEADER/MEMBER. |

**Create Group Request**:
```json
{
  "name": "Java Study Group",
  "description": "Weekly Java practice sessions"
}
```

**Join Group Request**:
```json
{ "joinCode": "ABC-123" }
```

**Promote Member Request**:
```json
{ "role": "LEADER" }
```

**Error Responses**:
- `403 Forbidden`: Insufficient Role (e.g., Member trying to promote).
- `404 Not Found`: Group or User not found.

## 📨 Async Events (RabbitMQ)

### 1. `GROUP_JOINED`
- **Exchange**: `its.topic.exchange`
- **Routing Key**: `profile.group.joined`
- **Reliability**: Retry 3x (Exp Backoff), DLX `its.dlx.exchange`.
- **Headers**: `X-Correlation-Id`, `X-Idempotency-Key`.
- **Idempotency**: Consumer checks Redis `processed_event:{eventId}` (TTL 24h).
- **Payload**:
  ```json
  {
    "studentId": "uuid",
    "groupId": "101",
    "joinCode": "ABC-123",
    "timestamp": "2023-10-27T10:00:00Z"
  }
  ```
- **Consumers**:
  - `Course Service` (`q.course.enrollment`): Auto-enrolls student in courses linked to the group.

### 2. `USER_REGISTERED` (Consume)
- **Queue**: `q.profile.create`
- **Binding**: `identity.user.registered`
- **Reliability**: Idempotent check (Redis `processed_event:{eventId}`), Retry 3x.
- **Action**: Create `UserProfile` entity with default settings.

### Acceptance Criteria
1.  **Auto-Create Profile**:
    - Trigger: Consume `identity.user.registered`.
    - Output: DB row in `user_profile` created.
    - Idempotency: Duplicate event ignored.
2.  **Join Group**:
    - Input: Valid `joinCode`.
    - Output: 200 OK.
    - DB: Row in `group_member` created.
    - Event: `GROUP_JOINED` emitted.
3.  **Group Role Update**:
    - Input: Promote Member -> Leader.
    - Check: Caller must be Leader.
    - Output: 200 OK.
    - Error: 403 if Caller is Member.

### 4. Common Standards
- **Pagination**: `?page=0&size=10&sort=createdAt,desc`
- **Auth/Role Matrix**:
    - `GET /profiles/me`: Any Authenticated User
    - `PUT /profiles/me`: Any Authenticated User
    - `POST /groups`: Teacher Only
    - `DELETE /groups`: Leader Only
- **Proto**: `src/main/proto/profile.proto`

## 💾 Data Model (CRUD)

### 1. Database Schema (PostgreSQL)
```sql
CREATE TABLE user_profiles (
    user_id UUID PRIMARY KEY, -- FK to Identity Service User
    bio TEXT,
    timezone VARCHAR(50) DEFAULT 'UTC',
    avatar_url VARCHAR(255),
    education_level VARCHAR(50), -- e.g., 'HIGH_SCHOOL', 'UNDERGRAD'
    learning_style VARCHAR(20), -- e.g., 'VISUAL', 'AUDITORY'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE learning_attributes (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(user_id),
    attribute_key VARCHAR(50), -- e.g., 'INTEREST_TAG'
    attribute_value VARCHAR(100)
);

CREATE TABLE user_schedules (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(user_id),
    title VARCHAR(100),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_rule VARCHAR(255), -- RFC 5545 (e.g., "FREQ=WEEKLY;BYDAY=MO")
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE class_groups (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    join_code VARCHAR(20) UNIQUE NOT NULL,
    creator_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE group_members (
    group_id BIGINT REFERENCES class_groups(id),
    student_id UUID NOT NULL,
    role VARCHAR(20) DEFAULT 'MEMBER', -- 'LEADER', 'MEMBER'
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (group_id, student_id)
);

CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    entity_name VARCHAR(50),
    entity_id VARCHAR(50),
    action VARCHAR(50),
    performed_by UUID,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Additional Endpoints
| Method | Path | Description | Role | Query Params |
|:-------|:-----|:------------|:-----|:-------------|
| `GET` | `/api/v1/profiles` | List Profiles. | `ADMIN` | `page`, `size`, `educationLevel` |
| `GET` | `/api/v1/schedules` | List My Schedule. | `STUDENT` | `from`, `to` (Date Range) |
| `GET` | `/api/v1/groups` | List My Groups. | `AUTHENTICATED` | `role` (optional) |

#### Response Example (List Groups)
```json
{
  "content": [
    {
      "id": 101,
      "name": "Java 101",
      "role": "MEMBER",
      "memberCount": 25
    }
  ],
  "pageable": { "pageNumber": 0, "pageSize": 10 }
}
```
