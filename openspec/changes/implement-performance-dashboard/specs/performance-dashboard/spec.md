# Performance Dashboard

## ADDED Requirements

### Performance Summary
- **Requirement:** The system MUST provide an endpoint to retrieve a summary of the user's academic performance.
  - **Scenario:** User visits the performance dashboard.
    - **Given** an authenticated user
    - **When** the user requests `/api/v1/performance/summary`
    - **Then** the system returns `overallGpa`, `totalCredits`, `totalAchievements`, and `currentRank` (rank and total students).

### Semester History
- **Requirement:** The system MUST provide an endpoint to retrieve the user's performance history by semester.
  - **Scenario:** User views the semester performance chart.
    - **Given** an authenticated user
    - **When** the user requests `/api/v1/performance/semesters`
    - **Then** the system returns a list of semesters, each containing `semester` name, `gpa`, `totalCredits`, `rank`, `totalStudents`, `achievements` count, and `attendance` percentage.

### User Skills
- **Requirement:** The system MUST provide an endpoint to retrieve the user's skills.
  - **Scenario:** User views the skills section.
    - **Given** an authenticated user
    - **When** the user requests `/api/v1/performance/skills`
    - **Then** the system returns a list of skills, each with `name`, `level` (0-100), and `category`.
