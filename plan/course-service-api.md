|:-------|:-----|:------------|:--------------|:-----------|
| `GET` | `/api/v1/courses` | List courses. | `PUBLIC` | Filters: `tag`, `level`, `search`. |
| `GET` | `/api/v1/courses/{id}` | Get course details. | `PUBLIC` | `id`: valid course ID. |
| `POST` | `/api/v1/courses/{id}/enroll` | Enroll. | `STUDENT` | `id`: valid course ID. |
| `DELETE` | `/api/v1/courses/{id}/enroll` | Un-enroll. | `STUDENT` | Must be enrolled. |

**Enroll Response** (`200 OK`):
```json
{ "enrollmentId": 123, "enrolledAt": "2023-11-24T10:00:00Z" }
```

### 2. Content Management (Instructor)
| Method | Path | Description | Role Required | Validation |
|:-------|:-----|:------------|:--------------|:-----------|
| `POST` | `/api/v1/courses` | Create Draft. | `TEACHER` | `title`: required, `level`: BEGINNER/INTERMEDIATE/ADVANCED. |
| `PUT` | `/api/v1/courses/{id}/status` | Update Status. | `TEACHER` (Owner) | `status`: DRAFT/REVIEW/PUBLISHED/ARCHIVED. |
| `POST` | `/api/v1/courses/{id}/chapters` | Create Chapter. | `TEACHER` (Owner) | `title`: required, `sequence`: int. |
| `PUT` | `/api/v1/courses/{id}/chapters/reorder` | Reorder Chapters. | `TEACHER` (Owner) | `chapterIds`: array of IDs. |
| `POST` | `/api/v1/lessons` | Add Lesson. | `TEACHER` | `type`: VIDEO/TEXT, `chapterId`: required. |
| `PUT` | `/api/v1/lessons/{id}/prerequisites` | Set Prereqs. | `TEACHER` (Owner) | `prereqIds`: list of LessonIDs. |
| `POST` | `/api/v1/assignments` | Create Assignment. | `TEACHER` | `dueDate`: future date, `config`: valid JSON. |
| `GET` | `/api/v1/courses/{id}/enrollments` | List Enrollments. | `TEACHER` (Owner), `ADMIN` | Pagination params. |

**Create Course Draft** (`POST /courses`):
```json
// Request
{ "title": "Java Fundamentals", "description": "...", "level": "BEGINNER" }
// Response (201 Created)
{ "id": 1, "title": "Java Fundamentals", "status": "DRAFT", "createdAt": "..." }
```

**Publish Course** (`PUT /courses/{id}/status`):
```json
// Request
{ "status": "PUBLISHED" }
// Response (200 OK)
{ "id": 1, "status": "PUBLISHED", "publishedAt": "..." }
// Error (400 BAD_REQUEST - Code: INSUFFICIENT_CONTENT)
{ "code": "INSUFFICIENT_CONTENT", "message": "Course must have at least 1 chapter and 1 lesson" }
```

**Reorder Chapters** (`PUT /courses/{id}/chapters/reorder`):
```json
// Request
{ "chapterIds": [3, 1, 2] }
// Response (200 OK)
{ "message": "Chapters reordered successfully" }
```

**Error Responses**:
- `400 INSUFFICIENT_CONTENT`: Cannot publish without content.
- `403 Forbidden`: User is not the Owner of the course.
- `400 Bad Request`: Circular dependency in prerequisites.

### 3. Learning (Student)
| Method | Path | Description | Role Required | Validation |
|:-------|:-----|:------------|:--------------|:-----------|
| `GET` | `/api/v1/lessons/{id}` | Get lesson details. | `ENROLLED` | `id`: valid lesson ID. |
| `POST` | `/api/v1/lessons/{id}/complete` | Complete Lesson. | `ENROLLED` | Must meet prerequisites. |

**Complete Lesson** (`POST /lessons/{id}/complete`):
```json
// Request (optional score for quiz-type lessons)
{ "score": 85.0 }
// Response (200 OK)
{ "lessonId": 101, "status": "COMPLETED", "nextLessonId": 102 }
// Error (422 UNPROCESSABLE_ENTITY - Code: PREREQ_NOT_MET)
{ "code": "PREREQ_NOT_MET", "message": "Prerequisites not completed", "missingPrereqs": [99, 100] }
```

## 📨 Async Events (RabbitMQ)

### 1. `COURSE_PUBLISHED`
- **Exchange**: `its.topic.exchange`
- **Routing Key**: `course.content.published`
- **Reliability**: Retry 3x (Exp Backoff), DLX `its.dlx.exchange`.
- **Headers**: `X-Correlation-Id`, `X-Idempotency-Key`.
- **Idempotency**: Consumer checks Redis `processed_event:{eventId}`.
- **Payload**: `{ "courseId": "101", "title": "Java Basics", "instructorId": "uuid" }`
- **Consumers**: Notification Service (`q.notification.course`).

### 2. `LESSON_COMPLETED`
- **Exchange**: `its.topic.exchange`
- **Routing Key**: `course.lesson.completed`
- **Reliability**: Retry 3x (Exp Backoff), DLX `its.dlx.exchange`.
- **Headers**: `X-Correlation-Id`, `X-Idempotency-Key`.
- **Ordering**: Per-User (`course.lesson.completed.{userId}`).
- **Payload**: `{ "userId": "uuid", "courseId": "101", "lessonId": "202", "score": 100 }`
- **Consumers**: Gamification Service (`q.gamification.progress`).

### 3. `ASSIGNMENT_CREATED`
- **Exchange**: `its.topic.exchange`
- **Routing Key**: `course.assignment.created`
- **Reliability**: Retry 3x (Exp Backoff), DLX `its.dlx.exchange`.
- **Headers**: `X-Correlation-Id`, `X-Idempotency-Key`.
- **Payload**: `{ "courseId": "101", "assignmentId": "303", "dueDate": "..." }`
- **Consumers**: Notification Service (`q.notification.assignment`).

### Acceptance Criteria
1.  **Version Lifecycle**:
    - Input: `PUT /status` (DRAFT -> PUBLISHED).
    - Check: Must have >0 lessons.
    - Output: 200 OK.
    - Event: `COURSE_PUBLISHED` emitted.
2.  **Enroll/Un-enroll**:
    - Input: Course ID.
    - Output: 200 OK.
    - DB: `UserCourseEnrollment` created/deleted.
3.  **Complete Lesson (Prereq Check)**:
    - Input: Lesson ID.
    - Check: All `prerequisiteLessonIds` must be `COMPLETED` in `UserLessonProgress`.
    - Output: 200 OK.
    - Error: 400 if prereqs missing.
    - Event: `LESSON_COMPLETED` emitted.

### 4. Common Standards
- **Pagination**: `?page=0&size=10&sort=title,asc`
- **Proto**: `src/main/proto/course.proto`

## 💾 Data Model (CRUD)

### 1. Database Schema (PostgreSQL)
```sql
CREATE TYPE course_status AS ENUM ('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED');
CREATE TYPE lesson_type AS ENUM ('VIDEO', 'TEXT', 'QUIZ');

CREATE TABLE courses (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructor_id UUID NOT NULL,
    status course_status DEFAULT 'DRAFT',
    level VARCHAR(20), -- BEGINNER, INTERMEDIATE, ADVANCED
    tags TEXT[], -- Array of strings
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE course_versions (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT REFERENCES courses(id),
    version_number INT NOT NULL,
    snapshot_data JSONB, -- Full course structure snapshot
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE chapters (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT REFERENCES courses(id),
    title VARCHAR(100),
    sequence_order INT NOT NULL
);

CREATE TABLE lessons (
    id BIGSERIAL PRIMARY KEY,
    chapter_id BIGINT REFERENCES chapters(id),
    title VARCHAR(255),
    type lesson_type NOT NULL,
    content_url VARCHAR(500), -- For Video/Text
    mastery_threshold DOUBLE PRECISION DEFAULT 0.7,
    sequence_order INT NOT NULL
);

CREATE TABLE asset_metadata (
    id BIGSERIAL PRIMARY KEY,
    lesson_id BIGINT REFERENCES lessons(id),
    storage_url VARCHAR(500) NOT NULL,
    mime_type VARCHAR(50),
    checksum VARCHAR(64), -- SHA-256
    file_size_bytes BIGINT
);

CREATE TABLE prerequisites (
    lesson_id BIGINT REFERENCES lessons(id),
    prerequisite_lesson_id BIGINT REFERENCES lessons(id),
    PRIMARY KEY (lesson_id, prerequisite_lesson_id)
);

CREATE TABLE assignments (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT REFERENCES courses(id),
    title VARCHAR(255),
    due_date TIMESTAMP WITH TIME ZONE,
    max_score INT DEFAULT 100,
    config JSONB -- { "allowedExtensions": [...], "maxSize": ... }
);
```

### 2. Additional Endpoints
| Method | Path | Description | Role | Query Params |
|:-------|:-----|:------------|:-----|:-------------|
| `GET` | `/api/v1/courses` | List Courses. | `PUBLIC` | `tag`, `level`, `search` |
| `GET` | `/api/v1/courses/{id}/lessons` | List Lessons. | `ENROLLED` | None |
| `GET` | `/api/v1/assignments` | List Assignments. | `ENROLLED` | `courseId`, `status` |

### 3. gRPC Contracts (`course.proto`)
```protobuf
service CourseService {
  rpc GetCourseProgress (ProgressRequest) returns (ProgressResponse);
  rpc GetCourseStructure (StructureRequest) returns (StructureResponse);
}

message ProgressResponse {
  int32 progress_percent = 1;
  int64 last_lesson_id = 2;
  repeated int64 completed_lesson_ids = 3;
}
```
