---
id: implement-courses-dashboard
title: Implement Courses Dashboard API
description: >
  This change implements the courses dashboard API as specified in 'docs/specs-dashboard-courses.md'. 
  It provides endpoints for course statistics, enrolled courses list, and course details.
author: Gemini
status: proposal
depends-on: [implement-student-management-api]
---

## Proposal

The `docs/specs-dashboard-courses.md` defines a set of APIs to visualize and manage student courses. This proposal outlines the implementation of these endpoints.

### Goals

1.  Implement `GET /api/v1/courses/my-courses/stats`
2.  Implement `GET /api/v1/courses/my-courses` (with filtering and searching)
3.  Implement `GET /api/v1/courses/{id}`
4.  Implement `POST /api/v1/courses/{id}/enroll`

### Architecture

We will implement this primarily in the `course-service`.
The `course-service` already handles course management and enrollments.
We might need to enhance `EnrollmentController` and `CourseController` to support the specific view requirements (stats, filtering).

**Decision:**
- **Stats**: Add logic to `EnrollmentService` to calculate stats.
- **My Courses**: `EnrollmentController` already has `getMyCourses`. Need to verify if it supports filtering (`status`, `q`).
- **Course Details**: `CourseController` already has `getCourseById`. Need to verify if it includes syllabus/assignments/resources or if we need to fetch them.
- **Enroll**: `EnrollmentController` already has `enrollCourse`.

We will likely need to create a dedicated `CourseDashboardController` or enhance existing ones to match the exact API spec if the existing ones are too generic.
However, sticking to RESTful resources, `EnrollmentController` is the right place for "my courses" and "stats", and `CourseController` for "course details".

### Dependencies

- `course-service`: Main service.
- `user-profile-service`: For user context (already handled via JWT/SecurityUtils).
