## Architectural Design: Courses Dashboard

### 1. Service Responsibility

- **`course-service`**: Sole responsibility for all course-related data.
- **`user-profile-service`**: Not directly involved, except for providing the user context (via JWT).

### 2. Data Flow

**`GET /api/v1/courses/my-courses/stats`**
1. `EnrollmentController` calls `EnrollmentService.getStatistics(userId)`.
2. `EnrollmentService` aggregates data from `Enrollment` table (count, credits, progress).
3. Returns `CourseStatistics`.

**`GET /api/v1/courses/my-courses`**
1. `EnrollmentController` calls `EnrollmentService.getMyCourses(userId, status, search)`.
2. `EnrollmentService` queries `Enrollment` repository with filters.
3. Returns `List<CourseResponse>`.

**`GET /api/v1/courses/{id}`**
1. `CourseController` calls `CourseService.getCourseDetail(id)`.
2. Returns `CourseDetailResponse`.

### 3. API Contract

We will adhere strictly to `docs/specs-dashboard-courses.md`.
Note: The spec uses `/api/v1/courses/my-courses` which implies it might be under `CourseController` or `EnrollmentController`.
Existing `EnrollmentController` uses `/api/v1/enrollments`.
We should probably map `/api/v1/courses/my-courses` in `CourseController` or `EnrollmentController` to match the spec, or update the spec if we want to stick to `/api/v1/enrollments`.
**Decision**: We will add the endpoints to `CourseController` (or a new `CourseDashboardController`) to match the spec exactly: `/api/v1/courses/...`.
Currently `CourseController` likely maps `/api/v1/courses`.
