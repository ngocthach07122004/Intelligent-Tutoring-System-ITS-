# Assessment Service API Design

## 🌐 Overview
The **Assessment Service** handles question banks, exam creation, attempts, and auto-grading.

> **🔧 Implementation**: For architecture details, design patterns, and technical implementation, see [Assessment Service README](../backend/java-service/assessment-service/README.md).

## 🔌 REST API Endpoints

### 1. Exam Taking (Student)
| Method | Path | Description | Role Required | Validation |
|:-------|:-----|:------------|:--------------|:-----------|
| `POST` | `/api/v1/exams/{configId}/start` | Start Attempt. | `STUDENT` | `configId`: valid, `time`: within window. |
| `POST` | `/api/v1/attempts/{id}/submit` | Submit Attempt. | `STUDENT` (Owner) | `answers`: list not empty. |
| `GET` | `/api/v1/attempts/{id}/result` | Get Result. | `STUDENT` (Owner) | Status must be `GRADED`. |

**Start Exam** (`POST /exams/{configId}/start`):
```json
// Response (200 OK)
{
  "attemptId": 505,
  "questions": [
    { "id": 1, "content": "What is polymorphism?", "type": "MCQ", "metadata": { "options": ["A", "B", "C"] } }
  ],
  "timeLimit": 60,
  "startedAt": "2023-11-24T10:00:00Z"
}
```

**Submit Attempt** (`POST /attempts/{id}/submit`):
```json
// Request
{
  "answers": [
    { "questionId": 1, "response": "A" },
    { "questionId": 2, "response": "public class Test {}" }
  ]
}
// Response (200 OK)
{ "message": "Submitted successfully", "submittedAt": "2023-11-24T11:00:00Z" }
// Error (400 BAD_REQUEST - Code: EXAM_TIMEOUT)
{ "code": "EXAM_TIMEOUT", "message": "Submission after deadline" }
// Error (409 CONFLICT - Code: ALREADY_SUBMITTED)
{ "code": "ALREADY_SUBMITTED", "message": "This attempt has already been submitted" }
```

**Get Result** (`GET /attempts/{id}/result`):
```json
// Response (200 OK)
{
  "attemptId": 505,
  "score": 85.0,
  "maxScore": 100.0,
  "passed": true,
  "feedback": "Great job!",
  "answers": [
    { "questionId": 1, "yourAnswer": "A", "correct": true, "score": 10 }
  ]
}
// Error (422 UNPROCESSABLE_ENTITY - Code: PREREQ_NOT_MET)
{ "code": "PREREQ_NOT_MET", "message": "Prerequisite exam not completed" }
```

### 2. Question Bank & Exam Config (Instructor)
| Method | Path | Description | Role Required | Validation |
|:-------|:-----|:------------|:--------------|:-----------|
| `POST` | `/api/v1/pools` | Create Pool. | `TEACHER` | `name`: required. |
| `POST` | `/api/v1/questions` | Add Question. | `TEACHER` | `type`: MCQ/CODING/ESSAY, `metadata`: schema check. |
| `POST` | `/api/v1/exams` | Config Exam. | `TEACHER` | `timeLimit`: >0, `windowStart` < `windowEnd`. |
| `PUT` | `/api/v1/attempts/{id}/grade` | Manual Grade. | `TEACHER` (Owner) | `score`: 0-100, `feedback`: optional. |
| `POST` | `/api/v1/attempts/{id}/cancel` | Force Cancel. | `TEACHER` (Owner) | Reason required. |
| `GET` | `/api/v1/gradebook/courses/{courseId}` | View Gradebook. | `TEACHER` (Owner) | Pagination params. |

**Gradebook View** (`GET /gradebook/courses/{courseId}`):
```json
// Query Params: ?lessonId=101&studentId=u1&page=0&size=10
// Response (200 OK)
{
  "content": [
    {
      "studentId": "u1",
      "studentName": "Alice",
      "examId": 101,
      "examTitle": "Midterm Exam",
      "score": 85.0,
      "status": "GRADED",
      "gradedAt": "2023-11-24T12:00:00Z"
    }
  ],
  "pageable": { "pageNumber": 0, "pageSize": 10, "totalElements": 25 }
}
```

**Lesson-Quiz Mapping**:
- **Relation**: 1:1 mapping via `exam_configs.lesson_id` (Nullable FK).
- **Constraint**: For MVP, one lesson can have at most one quiz (UNIQUE constraint on `lesson_id`).
- **Future**: Remove UNIQUE constraint to support multiple quizzes per lesson.

**Error Responses**:
- `400 Bad Request`: Invalid Metadata Schema.
- `403 Forbidden`: Student trying to grade or access config.

#### Question Metadata Schema
- **MCQ**: `{ "options": ["A", "B"], "correct": 0 }`
- **CODING**: `{ "testCases": [{ "input": "1", "output": "1" }] }`
- **ESSAY**: `{ "rubricId": 101, "minWords": 100 }`

## 📨 Async Events (RabbitMQ)

### 1. `EXAM_GRADED`
- **Exchange**: `its.topic.exchange`
- **Routing Key**: `assessment.exam.graded`
- **Reliability**: Retry 3x (Exp Backoff), DLX `its.dlx.exchange`.
- **Headers**: `X-Correlation-Id`, `X-Idempotency-Key`.
- **Idempotency**: Consumer checks Redis `processed_event:{eventId}`.
- **Payload**:
  ```json
  {
    "attemptId": "505",
    "userId": "uuid",
    "examId": "101",
    "score": 85.5,
    "passed": true,
    "gradedAt": "2023-10-27T10:00:00Z"
  }
  ```
- **Consumers**:
  - `Gamification Service` (`q.gamification.xp`): Awards XP.
  - `Profile Service` (`q.profile.skill`): Updates skill mastery.

### Acceptance Criteria
1.  **Submit Exam**:
    - Input: Answers List.
    - Output: 200 OK.
    - DB: Attempt Status `IN_PROGRESS` -> `SUBMITTED`.
2.  **Auto-Grade (Partial Credit)**:
    - Trigger: Submission (MCQ/Coding).
    - Logic: If Coding test cases pass 50%, award 50% points.
    - Output: Score calculated.
    - DB: Attempt Status -> `GRADED`.
    - Event: `EXAM_GRADED` emitted.
3.  **Manual Review**:
    - Trigger: Submission (Essay).
    - DB: Attempt Status -> `UNDER_REVIEW`.
    - Action: Instructor POST `/grade` -> Status `GRADED` -> Event emitted.
4.  **Exam Timeout**:
    - Trigger: Scheduled Job checks `startedAt + timeLimit`.
    - Action: Auto-submit Attempt.
    - DB: Status `IN_PROGRESS` -> `SUBMITTED`.

### 4. Common Standards
- **Proto**: `src/main/proto/assessment.proto`

## 💾 Data Model (CRUD)

### 1. Database Schema (PostgreSQL)
```sql
CREATE TYPE question_type AS ENUM ('MCQ', 'CODING', 'ESSAY');
CREATE TYPE attempt_status AS ENUM ('IN_PROGRESS', 'SUBMITTED', 'UNDER_REVIEW', 'GRADED');

CREATE TABLE question_pools (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    instructor_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE questions (
    id BIGSERIAL PRIMARY KEY,
    pool_id BIGINT REFERENCES question_pools(id),
    type question_type NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB NOT NULL, -- { "options": [...], "testCases": [...] }
    difficulty_level INT DEFAULT 1
);

CREATE TABLE exam_configs (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255),
    course_id BIGINT NOT NULL,
    time_limit_minutes INT,
    window_start TIMESTAMP WITH TIME ZONE,
    window_end TIMESTAMP WITH TIME ZONE,
    policy JSONB -- { "browserLock": true, "shuffleQuestions": true }
);

CREATE TABLE exam_sections (
    id BIGSERIAL PRIMARY KEY,
    exam_id BIGINT REFERENCES exam_configs(id),
    pool_id BIGINT REFERENCES question_pools(id),
    question_count INT NOT NULL,
    points_per_question INT DEFAULT 1
);

CREATE TABLE attempts (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    exam_id BIGINT REFERENCES exam_configs(id),
    status attempt_status DEFAULT 'IN_PROGRESS',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    submitted_at TIMESTAMP WITH TIME ZONE,
    total_score DOUBLE PRECISION
);

CREATE TABLE answers (
    id BIGSERIAL PRIMARY KEY,
    attempt_id BIGINT REFERENCES attempts(id),
    question_id BIGINT REFERENCES questions(id),
    student_response TEXT, -- JSON or String
    score DOUBLE PRECISION,
    feedback TEXT,
    is_manual_review_needed BOOLEAN DEFAULT FALSE
);

CREATE TABLE gradebook (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    course_id BIGINT NOT NULL,
    exam_id BIGINT REFERENCES exam_configs(id),
    final_grade DOUBLE PRECISION,
    graded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Additional Endpoints
| Method | Path | Description | Role |
|:-------|:-----|:------------|:-----|
| `GET` | `/api/v1/gradebook/courses/{courseId}` | Get My Grades. | `STUDENT` |
| `GET` | `/api/v1/attempts/review` | List Pending Reviews. | `TEACHER` |

### 3. Validation Rules
- **MCQ**: Must have at least 2 options, exactly 1 correct.
- **Coding**: Must have at least 1 public test case.
- **Essay**: Must have a linked Rubric ID.
