# Assessment Service API

REST endpoints implemented in `assessment-service` for exams, attempts, question banks, gradebook, and analytics.

**Base URL:** `/api/v1` (unless otherwise noted)  
**Auth:** Expects JWT propagated by gateway (controllers assume authenticated user context).  
**Content-Type:** `application/json`.

## Attempts & Exam Taking (`/api/v1`)

| Method | Path                             | Purpose                                | Request (body/params)                                                          | Response body                                                         |
| ------ | -------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| `POST` | `/api/v1/exams/{configId}/start` | Start an attempt for an exam config.   | Path `configId` (Long).                                                        | `AttemptStartResponse` (new `attemptId`, question list, timing info). |
| `POST` | `/api/v1/attempts/{id}/submit`   | Submit answers for an attempt.         | Path `id`, `AttemptSubmitRequest` (`answers[]` of `{ questionId, response }`). | `AttemptSubmitResponse`.                                              |
| `GET`  | `/api/v1/attempts/{id}/result`   | Retrieve graded result for an attempt. | Path `id`.                                                                     | `AttemptResultResponse` (score, feedback, per-question detail).       |

**Details**

- `POST /exams/{configId}/start`
  - Path: `configId` (long, required).
  - Response `200 OK`: `{ "attemptId": 505, "examConfigId": 12, "startedAt": "2024-01-01T10:00:00Z", "timeLimit": 60 }`.
- `POST /attempts/{id}/submit`
  - Path: `id` (long, required).
  - Body: `{ "answers": [{ "questionId": 1, "response": "A" }, { "questionId": 2, "response": { "code": "print('hi')" } }] }`.
  - Response `200 OK`: `{ "message": "Submitted successfully", "submittedAt": "2024-01-01T11:00:00Z" }`.
- `GET /attempts/{id}/result`
  - Path: `id` (long, required).
  - Response `200 OK`:
    ```json
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
    ```

## Exam Configs (`/api/v1/exams`)

| Method   | Path                 | Purpose                       | Request                                                                                                                                                                                                                                    | Response body         |
| -------- | -------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------- |
| `POST`   | `/api/v1/exams`      | Create exam configuration.    | `ExamConfigRequest` – requires `title`, `courseId`; supports `lessonId`, `policy`, `browserLockEnabled`, `timeLimitMinutes`, `windowStart`, `windowEnd`, `policyConfig`, `sections[]` (each `{ poolId, countToPull, pointsPerQuestion }`). | `ExamConfigResponse`. |
| `PUT`    | `/api/v1/exams/{id}` | Update exam configuration.    | Path `id`, `ExamConfigRequest`.                                                                                                                                                                                                            | `ExamConfigResponse`. |
| `GET`    | `/api/v1/exams/{id}` | Get exam configuration by id. | Path `id`.                                                                                                                                                                                                                                 | `ExamConfigResponse`. |
| `DELETE` | `/api/v1/exams/{id}` | Delete exam configuration.    | Path `id`.                                                                                                                                                                                                                                 | No content.           |

**Request example**

```json
{
  "title": "Midterm Exam",
  "courseId": 101,
  "lessonId": 1001,
  "timeLimitMinutes": 90,
  "browserLockEnabled": true,
  "policyConfig": { "shuffleQuestions": true },
  "sections": [{ "poolId": 1, "countToPull": 20, "pointsPerQuestion": 2 }]
}
```

## Question Pools (`/api/v1/pools`)

| Method   | Path                 | Purpose                           | Request                                                                     | Response body             |
| -------- | -------------------- | --------------------------------- | --------------------------------------------------------------------------- | ------------------------- |
| `POST`   | `/api/v1/pools`      | Create a question pool.           | `QuestionPoolRequest` (`name` required, optional `difficulty`, `isPublic`). | `QuestionPoolResponse`.   |
| `PUT`    | `/api/v1/pools/{id}` | Update a pool.                    | Path `id`, `QuestionPoolRequest`.                                           | `QuestionPoolResponse`.   |
| `DELETE` | `/api/v1/pools/{id}` | Delete a pool.                    | Path `id`.                                                                  | No content.               |
| `GET`    | `/api/v1/pools/{id}` | Get pool by id.                   | Path `id`.                                                                  | `QuestionPoolResponse`.   |
| `GET`    | `/api/v1/pools/my`   | List pools owned by current user. | —                                                                           | `QuestionPoolResponse[]`. |

**QuestionPoolRequest example**

```json
{ "name": "Java Basics", "difficulty": "EASY", "isPublic": false }
```

## Questions (`/api/v1/questions`)

| Method   | Path                              | Purpose                   | Request                                                                                                  | Response body         |
| -------- | --------------------------------- | ------------------------- | -------------------------------------------------------------------------------------------------------- | --------------------- |
| `POST`   | `/api/v1/questions`               | Create a question.        | `QuestionRequest` (`poolId`, `type` required; `content`, optional `metadata` map, `weight`, `skillTag`). | `QuestionResponse`.   |
| `PUT`    | `/api/v1/questions/{id}`          | Update a question.        | Path `id`, `QuestionRequest`.                                                                            | `QuestionResponse`.   |
| `DELETE` | `/api/v1/questions/{id}`          | Delete a question.        | Path `id`.                                                                                               | No content.           |
| `GET`    | `/api/v1/questions/{id}`          | Get question by id.       | Path `id`.                                                                                               | `QuestionResponse`.   |
| `GET`    | `/api/v1/questions/pool/{poolId}` | List questions in a pool. | Path `poolId`.                                                                                           | `QuestionResponse[]`. |

**QuestionRequest example**

```json
{
  "poolId": 1,
  "type": "MCQ",
  "content": "What is polymorphism?",
  "metadata": { "options": ["A", "B", "C"], "correct": 1 },
  "weight": 1.0,
  "skillTag": "oop"
}
```

## Gradebook (`/api/v1/gradebook`)

| Method | Path                                      | Purpose                                      | Request                           | Response body              |
| ------ | ----------------------------------------- | -------------------------------------------- | --------------------------------- | -------------------------- |
| `GET`  | `/api/v1/gradebook/courses/{courseId}`    | Paged gradebook for a course (teacher view). | Path `courseId`, pageable params. | `Page<GradebookResponse>`. |
| `GET`  | `/api/v1/gradebook/my/courses/{courseId}` | Paged gradebook for the current student.     | Path `courseId`, pageable params. | `Page<GradebookResponse>`. |

**Pagination**: standard Spring pageable query params (`page`, `size`, `sort`).  
**GradebookResponse example**:

```json
{
  "studentId": "u123",
  "studentName": "Alice",
  "examId": 101,
  "examTitle": "Midterm",
  "score": 85.0,
  "status": "GRADED",
  "gradedAt": "2024-01-01T12:00:00Z"
}
```

## Analytics, Achievements, Summaries (`/api/v1/assessment`)

| Method | Path                                               | Purpose                                                     | Request                                  | Response body                 |
| ------ | -------------------------------------------------- | ----------------------------------------------------------- | ---------------------------------------- | ----------------------------- |
| `GET`  | `/api/v1/assessment/gradebook/summary`             | Summary grades for current user (optional semester filter). | Optional `semester`.                     | `GradebookSummaryResponse`.   |
| `GET`  | `/api/v1/assessment/gradebook/summary/v2`          | Summary grades (optionally for a specific `studentId`).     | Optional `semester`, `studentId` (UUID). | `GradebookSummaryV2Response`. |
| `GET`  | `/api/v1/assessment/gradebook/history/{studentId}` | Grade history for a student.                                | Path `studentId` (UUID).                 | `GradebookHistoryResponse`.   |
| `GET`  | `/api/v1/assessment/analytics`                     | Analytics for current or specified student.                 | Optional `studentId` (UUID).             | `AnalyticsResponse`.          |
| `GET`  | `/api/v1/assessment/achievements`                  | List achievements for current user.                         | —                                        | `AchievementResponse[]`.      |
| `POST` | `/api/v1/assessment/achievements/{code}/award`     | Award an achievement to current user.                       | Path `code`.                             | Empty body, HTTP 200.         |

**Examples**

- `GET /assessment/gradebook/summary?semester=2024A` → `GradebookSummaryResponse` with GPA and per-course grades.
- `GET /assessment/analytics?studentId=<uuid>` → `AnalyticsResponse`:
  ```json
  {
    "examScores": [{ "month": "Jan", "score": 80, "average": 75 }],
    "learningTime": [{ "week": "W01", "hours": 5 }],
    "strengths": ["Algorithms"],
    "improvements": ["Database"]
  }
  ```
- `POST /assessment/achievements/ON_TIME/award` → `200 OK`, empty body.

## Skills (`/api/v1/assessment/skills`)

| Method | Path                                 | Purpose                                                  | Request                      | Response body                                                                |
| ------ | ------------------------------------ | -------------------------------------------------------- | ---------------------------- | ---------------------------------------------------------------------------- |
| `GET`  | `/api/v1/assessment/skills`          | Get sample skill radar for current or specified student. | Optional `studentId` (UUID). | `SkillRadarResponse` (`studentId`, `skills[]` with `name`, `score`, `type`). |
| `GET`  | `/api/v1/assessment/skills/{userId}` | Get skill mastery map for a user.                        | Path `userId` (UUID).        | `AssessmentSkillResponse` (`skills` map).                                    |

**Notes**: Current implementation returns static/sample data for dashboard/demo purposes.

## Payload reference

**AttemptSubmitRequest**

- `answers` (array, required) – each answer object:
  - `questionId` (long, required)
  - `response` (any/json, optional)

**AttemptStartResponse**

- `attemptId` (long), `examConfigId` (long), `startedAt` (Instant), `timeLimit` (minutes).

**AttemptSubmitResponse**

- `message` (string), `submittedAt` (Instant).

**AttemptResultResponse**

- `attemptId`, `score`, `maxScore`, `passed` (boolean), `feedback` (string), `answers` (`AnswerResultResponse[]` with `questionId`, `yourAnswer`, `correct`, `score`).

**ExamConfigRequest**

- `title` (string, required)
- `courseId` (long, required)
- `lessonId` (long, optional)
- `policy` (string, optional)
- `browserLockEnabled` (boolean, optional)
- `timeLimitMinutes` (int, optional)
- `windowStart`, `windowEnd` (Instant, optional)
- `policyConfig` (map<string, object>, optional)
- `sections` (array of `ExamSectionRuleRequest`):
  - `poolId` (long, required)
  - `countToPull` (int, required)
  - `pointsPerQuestion` (int, optional)

**ExamConfigResponse**

- `id`, `title`, `courseId`, `lessonId`, `policy`, `browserLockEnabled`, `timeLimitMinutes`, `windowStart`, `windowEnd`, `policyConfig` (map), `instructorId`, `createdAt`, `sections` (`ExamSectionRuleResponse[]` with `id`, `poolId`, `poolName`, `countToPull`, `pointsPerQuestion`).

**QuestionPoolRequest**

- `name` (string, required)
- `difficulty` (string, optional)
- `isPublic` (boolean, optional)

**QuestionPoolResponse**

- `id`, `name`, `difficulty`, `isPublic`, `instructorId`, `createdAt`.

**QuestionRequest**

- `poolId` (long, required)
- `type` (enum `QuestionType`, required)
- `content` (string, required)
- `metadata` (map, optional)
- `weight` (double, optional)
- `skillTag` (string, optional)

**QuestionResponse**

- `id`, `poolId`, `type`, `content`, `metadata`, `weight`, `skillTag`.

**GradebookResponse**

- `studentId`, `studentName`, `examId`, `examTitle`, `score`, `status`, `gradedAt`.

**GradebookSummaryResponse**

- Top-level: `overallGpa`, `totalCredits`, `completedCourses`, `inProgressCourses`, `rank`, `semester`, `courseGrades` (array).
- `courseGrades` items: `courseId`, `courseName`, `courseCode`, `finalScore`, `grade`, `gpa`, `status`.

**GradebookSummaryV2Response**

- `studentId`, `semesters` (list of `SemesterSummary` with `semester`, `gpa`, `totalCredits`, `rank`, `totalStudents`, `achievements`, `attendance`), `overall` (`gpa`, `totalCredits`).

**GradebookHistoryResponse**

- `studentId`, `records` (list of `AcademicRecord`: `semester`, `gpa`, `totalCredits`, `rank`, `totalStudents`, `subjects`).
- `subjects` items: `name`, `code`, `credits`, `grade`, `score`, `teacher`.

**AnalyticsResponse**

- `examScores` (list of `{ month, score, average }`)
- `learningTime` (list of `{ week, hours }`)
- `strengths` (string list), `improvements` (string list)

**AchievementResponse**

- `id`, `code`, `name`, `description`, `iconUrl`, `icon`, `points`, `category`, `rarity`, `earned`/`isEarned` (boolean), `earnedAt` (Instant), `progress` (0-100), `progressDetail` (`current`, `target`).

**SkillRadarResponse**

- `studentId` (UUID), `skills` (list of `{ name, level, category }`).

## Health

| Method | Path      | Purpose                                                                            |
| ------ | --------- | ---------------------------------------------------------------------------------- |
| `GET`  | `/health` | Basic health check, returns `{ "status": "UP", "service": "assessment-service" }`. |
