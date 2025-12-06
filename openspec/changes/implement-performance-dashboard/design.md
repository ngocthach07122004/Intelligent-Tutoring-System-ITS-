## Architectural Design: Performance Dashboard

### 1. Service Responsibility

- **`assessment-service`**: Source of truth for academic performance (Grades, GPA, Credits, Rank).
- **`user-profile-service`**: Source of truth for Skills and Achievements (if stored there, or aggregated).
- **Aggregation**: `user-profile-service` will act as the aggregator for the `/api/v1/performance` endpoints, similar to the Student Management API.

### 2. Data Flow

**`GET /api/v1/performance/summary`**
1. `PerformanceController` (User Profile) calls `AssessmentServiceClient.getPerformanceSummary(studentId)`.
2. `AssessmentService` calculates Overall GPA, Total Credits, Rank.
3. `PerformanceController` counts achievements (if stored locally or fetched).
4. Returns combined `PerformanceSummary`.

**`GET /api/v1/performance/semesters`**
1. `PerformanceController` calls `AssessmentServiceClient.getSemesterPerformance(studentId)`.
2. Returns list of `SemesterPerformance`.

**`GET /api/v1/performance/skills`**
1. `PerformanceController` queries local `UserSkill` repository.
2. Returns list of `Skill`.

### 3. API Contract

We will adhere strictly to `docs/specs-dashboard-performance.md`.
