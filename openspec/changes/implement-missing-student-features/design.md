## Architectural Design: Missing Student Features

### 1. Subject Details (`/subjects/{subjectId}`)

**Flow:**
1.  User requests `/api/v1/students/{id}/subjects/{subjectId}`.
2.  `StudentService` calls `AssessmentServiceClient.getCourseGrades(studentId, courseId)`.
3.  `assessment-service` returns detailed grade breakdown (assignments, exams, quizzes).
4.  `StudentService` calls `CourseServiceClient.getCourse(courseId)` (optional, for metadata like teacher, credits if not in gradebook).
5.  `StudentService` aggregates and returns `CurrentSubject`.

**Data Model:**
- Reuse `CurrentSubject` DTO but populate nested fields (`assignments`, `exams`, `recentActivities`) which might be null in the list view.

### 2. Analytics Timeframe (`/analytics?timeframe=...`)

**Flow:**
1.  User requests `/api/v1/students/{id}/analytics?timeframe=semester`.
2.  `StudentService` calls `AssessmentServiceClient.getAnalytics(studentId, timeframe)`.
3.  `assessment-service` filters data based on timeframe (e.g., current semester vs all time).
4.  Returns `LearningAnalytics`.

**Impact:**
- Requires changes in `assessment-service` to handle the filtering logic.
