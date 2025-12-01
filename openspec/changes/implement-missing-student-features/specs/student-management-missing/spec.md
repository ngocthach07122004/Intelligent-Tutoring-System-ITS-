# Missing Student Management Features

## ADDED Requirements

### Subject Details
- **Requirement:** The system MUST provide an endpoint to retrieve detailed information for a specific subject enrolled by the student.
  - **Scenario:** User views detailed subject progress.
    - **Given** an authenticated user and a valid student ID and subject ID
    - **When** the user requests `/api/v1/students/{id}/subjects/{subjectId}`
    - **Then** the system returns detailed `CurrentSubject` information including assignments, exams, and recent activities.

### Analytics Timeframe
- **Requirement:** The system MUST allow filtering analytics data by timeframe.
  - **Scenario:** User filters analytics by semester.
    - **Given** an authenticated user
    - **When** the user requests `/api/v1/students/{id}/analytics?timeframe=semester`
    - **Then** the system returns analytics data calculated for the current semester only.
