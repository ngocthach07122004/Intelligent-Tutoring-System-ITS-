# Design: Enhance Performance Dashboard Data

## Architecture
The `user-profile-service` acts as an aggregator/BFF (Backend for Frontend) for the student dashboard. It consumes data from `assessment-service`.

### Data Flow
1.  Frontend requests `/api/v1/performance/summary` or `/api/v1/performance/semesters`.
2.  `user-profile-service` calls `assessment-service` endpoints (`/summary`, `/history`).
3.  `assessment-service` computes/retrieves:
    *   GPA, Credits (Existing)
    *   Rank (Existing)
    *   **Total Students** (New): Count of students in the same intake/cohort.
    *   **Achievements** (New): Count of awards/high grades.
    *   **Attendance** (New): Aggregated attendance percentage.
4.  `user-profile-service` maps this data to the frontend-friendly DTOs.

## API Changes

### `assessment-service`

#### `GET /api/v1/gradebook/student/{studentId}/summary`
Response `GradebookSummaryResponse` adds:
```java
private Integer totalStudents;
private Integer totalAchievements;
```

#### `GET /api/v1/gradebook/student/{studentId}/history`
Response `GradebookHistoryResponse.AcademicRecord` adds:
```java
private Integer totalStudents;
private Integer achievements;
private Double attendance;
```

## Domain Logic

### Cohort Size (`totalStudents`)
*   Defined as the number of students enrolled in the same semester or academic year.
*   For `summary`, it's the total students in the student's current year/major.
*   For `history`, it's the total students in that specific semester's cohort.

### Achievements
*   Count of courses with High Distinction (e.g., > 9.0 or A+).
*   Or specific "Badge" entities if they exist (currently assuming grade-based achievements).

### Attendance
*   Average attendance percentage across all courses in the semester.
