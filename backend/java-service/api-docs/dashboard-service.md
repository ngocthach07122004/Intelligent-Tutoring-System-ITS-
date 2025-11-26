# Dashboard Service API

Aggregator endpoints implemented in `dashboard-service`. The service reads from course/assessment/profile services and returns aggregates for students, instructors, and admins.

**Base URL:** `/api/v1/dashboard`  
**Auth:** JWT required (Gateway-propagated). Student/instructor/admin roles enforced upstream.  
**Content-Type:** `application/json`.

## Endpoints

| Method | Path | Purpose | Request params/body | Response |
| --- | --- | --- | --- | --- |
| `GET` | `/student` | Student dashboard aggregate for current user. | — (user inferred from JWT). | `StudentDashboardResponse` (progress summary, risk profile, skill radar). |
| `GET` | `/student/summary` | Lightweight summary for current user. | — | `DashboardSummaryResponse` (profile, courses, stats, performance, achievements). |
| `GET` | `/student/analytics` | Analytics chart data for current user. | — | `StudentAnalyticsResponse` (engagement metrics, score trends). |
| `GET` | `/instructor/courses/{id}` | Course analytics for an instructor's course. | Path `id` (Long). | `InstructorCourseStatsResponse` (avg score, at-risk count, completion rate). |
| `GET` | `/instructor/at-risk` | List at-risk students for instructor. | — | `AtRiskListResponse`. |
| `GET` | `/admin/stats` | System-level stats for admins. | — | `AdminStatsResponse`. |

## Payload reference

**StudentDashboardResponse**
- `summary` (`DashboardSummary`): `coursesInProgress` (int), `nextAssignmentDue` (Instant).
- `riskProfile` (`RiskProfileDTO`): `level` (`RiskLevel`), `trend` (string).
- `skillRadar` (map<string,double>) – skill name to mastery score.

**DashboardSummaryResponse**
- `profile` (`UserProfileResponse` from profile service)
- `courses` (`EnrollmentResponse[]` from course service)
- `courseStats` (`CourseStats`): `totalCourses`, `inProgressCourses`, `completedCourses`, `averageProgress`.
- `performance` (`GradebookSummaryResponse` from assessment service)
- `achievements` (`AchievementResponse[]`), `achievementsCount` (int)
- `totalLearningHours` (int), `upcomingAssignments` (int)

**StudentAnalyticsResponse**
- `academicProgress` (`AcademicProgress`): `currentGPA`, `previousGPA`, `trend`, `percentChange`.
- `subjectPerformance` (list of `{ name, currentScore, previousScore, trend, percentChange, color }`)
- `attendanceRate` (double), `assignmentCompletion` (double)
- `examScores` (list of `{ month, score, average }`)
- `learningTime` (list of `{ week, hours }`)
- `strengths`, `improvements` (string lists)

**InstructorCourseStatsResponse**
- `averageScore` (double), `atRiskCount` (int), `completionRate` (double).

**AtRiskListResponse**
- `students` (list of `{ studentId (UUID), studentName, riskLevel, reasons[] }`)

**AdminStatsResponse**
- `activeUsers` (int), `revenueThisMonth` (double), `totalCourses` (int), `systemHealth` (string).

## Examples

- `GET /api/v1/dashboard/student` →  
  ```json
  {
    "summary": { "coursesInProgress": 3, "nextAssignmentDue": "2024-01-05T10:00:00Z" },
    "riskProfile": { "level": "LOW", "trend": "STABLE" },
    "skillRadar": { "Java": 0.8, "SQL": 0.6 }
  }
  ```

- `GET /api/v1/dashboard/student/summary` → returns `DashboardSummaryResponse` containing:
  - `profile` (basic user profile)
  - `courses` (enrollments)
  - `courseStats` (counts, avg progress)
  - `performance` (gradebook summary)
  - `achievements`, `achievementsCount`
  - `totalLearningHours`, `upcomingAssignments`

- `GET /api/v1/dashboard/instructor/courses/10` →  
  ```json
  { "averageScore": 75.5, "atRiskCount": 5, "completionRate": 0.68 }
  ```

## Health

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Basic health check, returns `{ "status": "UP", "service": "dashboard-service" }`. |
