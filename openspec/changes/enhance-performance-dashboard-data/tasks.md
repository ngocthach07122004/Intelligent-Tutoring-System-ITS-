# Tasks: Enhance Performance Dashboard Data

- [x] Update `assessment-service` DTOs <!-- id: 0 -->
    - [x] Modify `GradebookSummaryResponse` to include `totalStudents` and `totalAchievements`
    - [x] Modify `GradebookHistoryResponse` to include `totalStudents`, `achievements`, and `attendance`
- [x] Implement logic in `assessment-service` <!-- id: 1 -->
    - [x] Implement `totalStudents` calculation (count students in cohort)
    - [x] Implement `achievements` calculation (count high grades)
    - [x] Implement `attendance` calculation (average attendance)
- [x] Update `user-profile-service` <!-- id: 2 -->
    - [x] Update `AssessmentServiceClient` DTOs to match new structure
    - [x] Update `StudentMapper` to map new fields
    - [x] Verify `PerformanceController` returns correct data
- [x] Verification <!-- id: 3 -->
    - [x] Verify `/api/v1/performance/summary` returns non-zero `totalStudents` and `totalAchievements`
    - [x] Verify `/api/v1/performance/semesters` returns non-zero `totalStudents`, `achievements`, and `attendance`
