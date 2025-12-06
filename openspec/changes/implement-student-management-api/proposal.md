---
id: implement-student-management-api
title: Implement Student Management API
description: >
  This change implements the student management API as specified in 'docs/specs-dashboard-student-management.md'. 
  It introduces a new set of endpoints under '/api/v1/students/{id}' to provide a unified view of student data, 
  including profile, academic history, analytics, subjects, and achievements. The implementation will aggregate 
  data from existing microservices.
author: Gemini
status: proposal
depends-on: []
---

## Proposal

The documentation file `docs/specs-dashboard-student-management.md` defines a comprehensive API for a student management dashboard. A review of the existing backend services (`user-profile-service`, `course-service`, `assessment-service`, `dashboard-service`) reveals that while much of the required data exists, it is distributed across these services and not exposed through the unified API contract specified in the document.

Currently, there are no endpoints matching the `/api/v1/students/{id}` pattern. The existing services expose data for the currently authenticated user or through service-specific paths.

This proposal outlines the work required to bridge this gap by introducing a new, dedicated API for student management, which will act as an aggregation layer.

### Goals

1.  **Implement the API specified in `docs/specs-dashboard-student-management.md`**.
2.  Create a new controller and service within the `user-profile-service` to handle the new API endpoints.
3.  Aggregate data from `user-profile-service`, `course-service`, and `assessment-service` to build the API responses.
4.  Define clear DTOs that match the data models in the specification.

### Non-Goals

1.  This change will not create a new microservice. The new API will be housed in the existing `user-profile-service`.
2.  This change will not implement the frontend for the student management dashboard.
3.  This change will not alter the existing database schemas of the microservices, but will add new Feign client interfaces where necessary.
