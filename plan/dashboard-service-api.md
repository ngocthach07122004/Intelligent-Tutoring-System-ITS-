# Dashboard Service API Design

## 🌐 Overview
The **Dashboard Service** is an **Aggregator**. It does not own primary data but aggregates it from Course, Assessment, and Profile services to provide analytics and "At-Risk" alerts.

> **🔧 Implementation**: For architecture details, design patterns, and technical implementation, see [Dashboard Service README](../backend/java-service/dashboard-service/README.md).

## 🔌 REST API Endpoints

### 1. Student Dashboard
| Method | Path | Description | Role Required | Validation |
|:-------|:-----|:------------|:--------------|:-----------|
| `GET` | `/api/v1/dashboard/student` | Get aggregated view. | `STUDENT` (Owner) | `userId` from Token. |

**Response** (`200 OK`):
```json
{
  "summary": {
    "coursesInProgress": 3,
    "nextAssignmentDue": "2023-11-01T10:00:00Z"
  },
  "riskProfile": { "level": "LOW", "trend": "STABLE" },
  "skillRadar": { "Java": 0.8, "SQL": 0.6 }
}
```

### 2. Instructor Dashboard
| Method | Path | Description | Role Required | Validation |
|:-------|:-----|:------------|:--------------|:-----------|
| `GET` | `/api/v1/dashboard/instructor/courses/{id}` | Class Stats. | `TEACHER` (Owner) | `id`: valid Course ID. |
| `GET` | `/api/v1/dashboard/instructor/at-risk` | At-Risk List. | `TEACHER` | None. |

**Course Stats Response** (`200 OK`):
```json
{ "averageScore": 75.5, "atRiskCount": 5, "completionRate": 0.68 }
```

**At-Risk List Response** (`200 OK`):
```json
{
  "students": [
    {
      "studentId": "u123",
      "studentName": "Alice",
      "riskLevel": "HIGH",
      "reasons": ["MISSED_DEADLINES", "LOW_LOGIN_FREQUENCY"]
    }
  ]
}
```

### 3. Admin Dashboard
| Method | Path | Description | Role Required | Validation |
|:-------|:-----|:------------|:--------------|:-----------|
| `GET` | `/api/v1/dashboard/admin/stats` | System Stats. | `ADMIN` | None. |

**Response** (`200 OK`):
```json
{
  "activeUsers": 1200,
  "revenueThisMonth": 5000.00,
  "totalCourses": 150,
  "systemHealth": "HEALTHY"
}
```

**Error Responses**:
- `403 Forbidden`: Accessing another user's dashboard or non-owned course.

#### KPI Payload Structure (Response)
```json
{
  "kpi": {
    "engagementScore": 85, // 0-100
    "riskLevel": "LOW", // LOW, MEDIUM, HIGH
    "trends": { "weeklyLogin": [5, 6, 7, 5, 0] }
  }
}
```

## 📡 gRPC Clients (Upstream Dependencies)
**Fallback Rules**:
1.  **Course Service Down**: Return `progress: 0` and `status: "Service Unavailable"`.
2.  **Assessment Service Down**: Return empty `skillRadar`.
3.  **Profile Service Down**: Return default `timezone: "UTC"`.

## 📨 Async Events (RabbitMQ Consumers)

### 1. `EXAM_GRADED`
- **Queue**: `q.dashboard.analytics`
- **Reliability**: Retry 3x (Exp Backoff), DLX `its.dlx.exchange`.
- **Headers**: `X-Idempotency-Key`.
- **Idempotency**: Check Redis `processed_event:{eventId}` (TTL 24h).
- **Action**: Update `StudentRiskProfile` (Performance Score).
- **Logic**: If score < 50%, increment `failedExams` counter.

### 2. `LESSON_COMPLETED`
- **Queue**: `q.dashboard.analytics`
- **Reliability**: Retry 3x (Exp Backoff), DLX `its.dlx.exchange`.
- **Headers**: `X-Idempotency-Key`.
- **Idempotency**: Check Redis `processed_event:{eventId}` (TTL 24h).
- **Action**: Update `StudentRiskProfile` (Engagement Score).
- **Logic**: Update `lastActivity` timestamp.

### Acceptance Criteria
1.  **Dashboard Load**:
    - Input: `GET /dashboard/student`.
    - Output: 200 OK (< 500ms).
    - Logic: Aggregates data from 3 gRPC services.
    - Fallback: If 1 service fails, partial data returned (no 500).
2.  **Risk Calculation**:
    - Trigger: `EXAM_GRADED` event (Score < 50).
    - Output: `StudentRiskProfile` updated.
    - Verify: `riskLevel` changes to `MEDIUM` or `HIGH`.

### 4. Common Standards
- **Proto**: `src/main/proto/dashboard.proto`

## 💾 Data Model (Analytics & Cache)

### 1. Database Schema (PostgreSQL / Redis)
*Note: High-velocity data may be cached in Redis.*

```sql
CREATE TABLE student_risk_profiles (
    student_id UUID PRIMARY KEY,
    risk_level VARCHAR(20), -- 'HIGH', 'MEDIUM', 'LOW'
    overall_score DOUBLE PRECISION,
    risk_factors JSONB, -- ["MISSED_DEADLINES", "LOW_LOGIN_FREQUENCY"]
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE kpi_definitions (
    code VARCHAR(50) PRIMARY KEY, -- e.g., 'AVG_COURSE_COMPLETION'
    description TEXT,
    calculation_rule TEXT -- Description of logic
);

CREATE TABLE kpi_aggregates (
    id BIGSERIAL PRIMARY KEY,
    kpi_code VARCHAR(50) REFERENCES kpi_definitions(code),
    entity_id VARCHAR(50), -- CourseID or 'GLOBAL'
    period_type VARCHAR(20), -- 'DAILY', 'WEEKLY'
    period_start DATE,
    value DOUBLE PRECISION,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. gRPC Contracts (Upstream)

#### Course Service (`course.proto`)
```protobuf
message ProgressRequest { string user_id = 1; int64 course_id = 2; }
message ProgressResponse { int32 percent = 1; }
```

#### Assessment Service (`assessment.proto`)
```protobuf
message SkillRequest { string user_id = 1; }
message SkillResponse { map<string, float> mastery = 1; }
```

#### Profile Service (`profile.proto`)
```protobuf
message ProfileRequest { string user_id = 1; }
message ProfileResponse { string timezone = 1; }
```

### 3. Response Examples
**Student Dashboard (`GET /student`)**
```json
{
  "summary": {
    "coursesInProgress": 3,
    "nextAssignmentDue": "2023-11-01T10:00:00Z"
  },
  "riskProfile": { "level": "LOW", "trend": "STABLE" },
  "skillRadar": { "Java": 0.8, "SQL": 0.6 }
}
```
