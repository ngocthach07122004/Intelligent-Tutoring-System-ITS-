# Course Service API

REST endpoints implemented in `course-service`. Authentication/authorization is enforced via Spring Security annotations and `SecurityUtils.getUserIdAsLong(...)`.

**Base URL:** `/api/v1`  
**Auth:** JWT required (Gateway-propagated). Role checks noted per endpoint (teacher/admin/student).  
**Content-Type:** `application/json`.

## Courses (`/api/v1/courses`)

| Method | Path | Purpose | Request (body/params) | Response body |
| --- | --- | --- | --- | --- |
| `POST` | `/api/v1/courses` | Create a course as the current instructor. | `CreateCourseRequest` – requires `title`, `visibility`; supports `description`, `code`, `credits`, `semester`, `schedule`, `maxStudents`, `startDate`, `endDate`, `thumbnailUrl`, `objectives`, `tagIds`, `prerequisiteCourseIds`. | `CourseResponse` with course metadata, instructor info, tags, prerequisites, status, timestamps. |
| `GET` | `/api/v1/courses/{id}` | Get course details (enrollment-aware). | Path `id`. | `CourseResponse`. |
| `GET` | `/api/v1/courses` | Paged list with optional filters. | Pageable params, optional `semester`, `enrollmentStatus`. | `Page<CourseResponse>`. |
| `GET` | `/api/v1/courses/instructor/{instructorId}` | Paged list for a specific instructor. | Path `instructorId`, pageable params. | `Page<CourseResponse>`. |
| `GET` | `/api/v1/courses/instructor/my-courses` | Paged list for the current instructor. | Pageable params. | `Page<CourseResponse>`. |
| `GET` | `/api/v1/courses/published` | Paged list of published courses. | Pageable params, optional `semester`. | `Page<CourseResponse>`. |
| `GET` | `/api/v1/courses/search` | Search courses by title keyword. | Query `keyword`, pageable params. | `Page<CourseResponse>`. |
| `PUT` | `/api/v1/courses/{id}` | Update a course (owner only). | Path `id`, `UpdateCourseRequest` (same fields as create, all optional). | Updated `CourseResponse`. |
| `POST` | `/api/v1/courses/{id}/publish` | Publish a course. | Path `id`. | `CourseResponse` with updated status. |
| `POST` | `/api/v1/courses/{id}/archive` | Archive a course. | Path `id`. | `CourseResponse` with updated status. |
| `DELETE` | `/api/v1/courses/{id}` | Delete a course. | Path `id`. | No content. |
| `GET` | `/api/v1/courses/{id}/stats` | Instructor/admin stats for a course. | Path `id`. | `CourseStatsResponse`. |

**Examples**
- `POST /courses` (teacher)  
  ```json
  {
    "title": "Java Fundamentals",
    "description": "Intro to Java",
    "visibility": "PUBLIC",
    "code": "CS101",
    "credits": 3,
    "semester": "2024A",
    "schedule": "Mon-Wed 8:00",
    "maxStudents": 50,
    "startDate": "2024-01-10",
    "endDate": "2024-05-10",
    "thumbnailUrl": "https://cdn/cover.png",
    "objectives": "Learn OOP basics",
    "tagIds": [1,2],
    "prerequisiteCourseIds": [10]
  }
  ```
  Response `201 Created` (partial):  
  ```json
  {
    "id": 1,
    "title": "Java Fundamentals",
    "status": "DRAFT",
    "visibility": "PUBLIC",
    "instructorId": 99,
    "currentStudents": 0,
    "tags": [],
    "prerequisites": [],
    "createdAt": "2024-01-01T00:00:00",
    "updatedAt": "2024-01-01T00:00:00"
  }
  ```
- `GET /courses?semester=2024A&page=0&size=20` → `Page<CourseResponse>` (includes pagination metadata).
- `POST /courses/1/publish` → returns `CourseResponse` with `status: "PUBLISHED"` and `publishedAt`.

## Chapters (`/api/v1/courses/{courseId}/chapters`)

| Method | Path | Purpose | Request | Response body |
| --- | --- | --- | --- | --- |
| `POST` | `/api/v1/courses/{courseId}/chapters` | Create chapter in a course. | Path `courseId`, `CreateChapterRequest` (`title` required, `description` optional). | `ChapterResponse`. |
| `GET` | `/api/v1/courses/{courseId}/chapters` | List chapters for a course. | Path `courseId`. | `ChapterResponse[]`. |
| `GET` | `/api/v1/courses/{courseId}/chapters/{id}` | Get chapter by id. | Path `courseId`, `id`. | `ChapterResponse`. |
| `PUT` | `/api/v1/courses/{courseId}/chapters/{id}` | Update chapter. | Path `courseId`, `id`, `CreateChapterRequest`. | `ChapterResponse`. |
| `PUT` | `/api/v1/courses/{courseId}/chapters/reorder` | Reorder chapters. | Path `courseId`, `ReorderChaptersRequest` (`chapterIds[]` required). | Reordered `ChapterResponse[]`. |
| `DELETE` | `/api/v1/courses/{courseId}/chapters/{id}` | Delete chapter. | Path `courseId`, `id`. | No content. |

**Examples**
- `POST /courses/1/chapters`  
  Request: `{ "title": "Introduction", "description": "Overview" }`  
  Response: `{ "id": 10, "title": "Introduction", "sequence": 1, "lessons": [], "createdAt": "...", "updatedAt": "..." }`
- `PUT /courses/1/chapters/reorder` with body `{ "chapterIds": [10, 11, 12] }` → returns reordered list.

## Lessons (`/api/v1/chapters/{chapterId}/lessons`)

| Method | Path | Purpose | Request | Response body |
| --- | --- | --- | --- | --- |
| `POST` | `/api/v1/chapters/{chapterId}/lessons` | Create lesson under a chapter. | Path `chapterId`, `CreateLessonRequest` (`title`, `type` required; optional `description`, `masteryThreshold` 0–1, `content`, `estimatedDuration`). | `LessonResponse`. |
| `GET` | `/api/v1/chapters/{chapterId}/lessons` | List lessons in a chapter. | Path `chapterId`. | `LessonResponse[]`. |
| `GET` | `/api/v1/chapters/{chapterId}/lessons/{id}` | Get lesson by id. | Path `chapterId`, `id`. | `LessonResponse`. |
| `PUT` | `/api/v1/chapters/{chapterId}/lessons/{id}` | Update lesson. | Path `chapterId`, `id`, `CreateLessonRequest`. | `LessonResponse`. |
| `DELETE` | `/api/v1/chapters/{chapterId}/lessons/{id}` | Delete lesson. | Path `chapterId`, `id`. | No content. |

**Example**
- `POST /chapters/10/lessons`  
  Request:  
  ```json
  {
    "title": "What is Java?",
    "description": "History and basics",
    "type": "VIDEO",
    "masteryThreshold": 0.7,
    "content": "https://cdn/lesson1.mp4",
    "estimatedDuration": 20
  }
  ```
  Response: lesson with `id`, `sequence`, `isCompleted` (for current user), timestamps.

## Enrollments (`/api/v1`)

| Method | Path | Purpose | Request | Response body |
| --- | --- | --- | --- | --- |
| `POST` | `/api/v1/courses/{courseId}/enroll` | Enroll current student. | Path `courseId`. | `EnrollmentResponse` (enrollment info including `status`, `progress`). |
| `GET` | `/api/v1/courses/my-courses` | List courses for current student. | Optional `status` filter. | `EnrollmentResponse[]`. |
| `GET` | `/api/v1/courses/{courseId}/enrollments` | List enrollments for a course (teacher/admin). | Path `courseId`, optional `status`. | `EnrollmentResponse[]`. |
| `PATCH` | `/api/v1/enrollments/{enrollmentId}/progress` | Update progress for an enrollment. | Path `enrollmentId`, body `{ "progress": <int> }`. | `EnrollmentResponse`. |
| `DELETE` | `/api/v1/enrollments/{enrollmentId}` | Drop enrollment (student). | Path `enrollmentId`. | No content. |
| `GET` | `/api/v1/enrollments/{enrollmentId}` | Get a single enrollment. | Path `enrollmentId`. | `EnrollmentResponse`. |
| `GET` | `/api/v1/courses/{courseId}/is-enrolled` | Check if current student is enrolled. | Path `courseId`. | `{ "enrolled": true|false }`. |

**Examples**
- `POST /courses/1/enroll` (student) → `201 Created` with enrollment:
  ```json
  {
    "id": 500,
    "courseId": 1,
    "courseTitle": "Java Fundamentals",
    "status": "ENROLLED",
    "progress": 0,
    "enrolledAt": "2024-01-02T00:00:00",
    "instructorName": "Teacher A"
  }
  ```
- `PATCH /enrollments/500/progress` with `{ "progress": 45 }` → returns updated enrollment.
- `GET /courses/1/enrollments?status=ENROLLED` → list for teacher/admin.

## Payload reference

**CreateCourseRequest**
- `title` (string, required, <=255)
- `description` (string, optional, <=5000)
- `visibility` (enum `CourseVisibility`, required)
- `code` (string, <=20)
- `credits` (int)
- `semester` (string, <=50)
- `schedule` (string, <=255)
- `maxStudents` (int)
- `startDate`, `endDate` (LocalDate)
- `thumbnailUrl` (string, <=500)
- `objectives` (string, <=5000)
- `tagIds` (list<long>)
- `prerequisiteCourseIds` (list<long>)

**UpdateCourseRequest**
- Same fields as create, all optional.

**CourseResponse**
- Core: `id`, `title`, `description`, `status` (`CourseStatus`), `visibility`, `code`, `credits`, `semester`, `schedule`, `maxStudents`, `thumbnailUrl`, `objectives`, `startDate`, `endDate`.
- Ownership: `instructorId`, `instructorName`, `instructorAvatarUrl`, `instructor` (nested summary).
- Enrollment info: `currentStudents`, `enrolled` (boolean for current user), `progress` (int %).
- Relations: `tags` (`TagResponse[]`), `prerequisites` (`PrerequisiteResponse[]`).
- Timestamps: `createdAt`, `updatedAt`, `publishedAt`.

**CreateChapterRequest**
- `title` (string, required, <=255)
- `description` (string, optional, <=5000)

**ChapterResponse**
- `id`, `title`, `description`, `sequence`, `lessons` (`LessonResponse[]`), `createdAt`, `updatedAt`.

**ReorderChaptersRequest**
- `chapterIds` (list<long>, required, ordered)

**CreateLessonRequest**
- `title` (string, required, <=255)
- `description` (string, optional, <=5000)
- `type` (enum `LessonType`, required)
- `masteryThreshold` (double 0–1)
- `content` (string, optional)
- `estimatedDuration` (int minutes, optional)

**LessonResponse**
- `id`, `title`, `description`, `type`, `sequence`, `masteryThreshold`, `content`, `estimatedDuration`, `isCompleted` (for current user), `nextLessonId`, `createdAt`, `updatedAt`.

**EnrollmentResponse**
- `id`, `courseId`, `courseTitle`, `courseCode`, `courseSemester`, `courseSchedule`, `courseCredits`, `courseMaxStudents`, `courseThumbnailUrl`, `instructorName`, `instructorAvatarUrl`, `studentId`, `status` (`EnrollmentStatus`), `progress`, `enrolledAt`, `completedAt`, `lastAccessAt`, `updatedAt`.

**CourseStatsResponse**
- `courseId`, `totalEnrollments`, `activeEnrollments`, `completedEnrollments`, `averageProgress`.

## Health (`/api/v1/health`)

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/health` | Liveness/basic status. |
| `GET` | `/api/v1/health/ready` | Readiness probe. |
| `GET` | `/api/v1/health/live` | Liveness probe. |
