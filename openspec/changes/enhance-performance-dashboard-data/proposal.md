# Proposal: Enhance Performance Dashboard Data

## Goal
Update `assessment-service` and `user-profile-service` to provide missing data fields required by the Performance Dashboard UI, specifically `totalStudents`, `achievements`, and `attendance`.

## Context
The current implementation of the Performance Dashboard in `user-profile-service` relies on `assessment-service` for data. However, several key metrics required by the frontend design are missing from the upstream service responses, leading to mocked data in the `user-profile-service`.

## Proposed Solution
1.  **Update `assessment-service`**:
    *   Calculate and return `totalStudents` (cohort size) in `GradebookSummaryResponse` and `GradebookHistoryResponse`.
    *   Calculate and return `achievements` count in `GradebookSummaryResponse` and `GradebookHistoryResponse`.
    *   Calculate and return `attendance` percentage in `GradebookHistoryResponse`.
2.  **Update `user-profile-service`**:
    *   Update `StudentMapper` to map these new fields from the `assessment-service` response to the `PerformanceSummary` and `SemesterPerformance` DTOs.
    *   Remove mocked data.

## Risks
*   **Performance**: Calculating cohort size and ranking for every request might be expensive. Caching strategies in `assessment-service` should be considered.
*   **Data Availability**: Attendance data might not be fully available or standardized across all courses.

## Alternatives
*   **Separate Calls**: Fetching achievements or cohort info via separate API calls. This would increase latency and complexity in the frontend or aggregation layer.
