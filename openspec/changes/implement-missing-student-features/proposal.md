---
id: implement-missing-student-features
title: Implement Missing Student Management Features
description: >
  This change implements the missing endpoints and query parameters identified in 'docs-v1/user-profile-service-missing.md'.
  It adds detailed subject view and analytics filtering.
author: Gemini
status: proposal
depends-on: [implement-student-management-api]
---

## Proposal

The verification of `user-profile-service` revealed gaps against the `docs/specs-dashboard-student-management.md` spec. This proposal aims to fill those gaps.

### Goals

1.  Implement `GET /api/v1/students/{id}/subjects/{subjectId}` to return detailed `CurrentSubject` info.
2.  Update `GET /api/v1/students/{id}/analytics` to support `timeframe` query parameter.

### Architecture

**Subject Details:**
- `StudentController` will expose the new endpoint.
- `StudentService` will need to fetch detailed data.
- **Data Source**: Detailed subject info (assignments, exams) likely resides in `assessment-service` (grades) and `course-service` (syllabus/structure).
- We might need to extend `AssessmentServiceClient` to fetch detailed gradebook for a specific course, or `CourseServiceClient` for course details.
- *Assumption*: `assessment-service` has the granular grade data.

**Analytics Timeframe:**
- `StudentController` will accept `timeframe`.
- `StudentService` will pass this to `AssessmentServiceClient`.
- `assessment-service`'s `GradebookController` needs to support this parameter in `getStudentAnalytics`.

### Dependencies

- `user-profile-service`
- `assessment-service` (needs updates to support new queries)
- `course-service` (potentially for subject metadata)
