# Courses Dashboard

## ADDED Requirements

### Course Statistics
- **Requirement:** The system MUST provide an endpoint to retrieve aggregate statistics for the user's enrolled courses.
  - **Scenario:** User views the courses dashboard.
    - **Given** an authenticated user
    - **When** the user requests `/api/v1/courses/my-courses/stats`
    - **Then** the system returns `totalCourses`, `activeCourses`, `totalCredits`, and `averageProgress`.

### Enrolled Courses List
- **Requirement:** The system MUST provide an endpoint to retrieve the user's enrolled courses with filtering and searching.
  - **Scenario:** User filters courses by status.
    - **Given** an authenticated user
    - **When** the user requests `/api/v1/courses/my-courses` with `status='active'`
    - **Then** the system returns a list of active courses.
  - **Scenario:** User searches for a course.
    - **Given** an authenticated user
    - **When** the user requests `/api/v1/courses/my-courses` with `q='Python'`
    - **Then** the system returns courses matching "Python" in name, code, or instructor.

### Course Details
- **Requirement:** The system MUST provide an endpoint to retrieve detailed course information.
  - **Scenario:** User views course details.
    - **Given** an authenticated user
    - **When** the user requests `/api/v1/courses/{id}`
    - **Then** the system returns course details including `syllabus`, `assignments`, and `resources`.

### Enroll Course
- **Requirement:** The system MUST provide an endpoint to enroll in a course.
  - **Scenario:** User enrolls in a course.
    - **Given** an authenticated user and a valid course ID
    - **When** the user requests `POST /api/v1/courses/{id}/enroll`
    - **Then** the system enrolls the user and returns success.
