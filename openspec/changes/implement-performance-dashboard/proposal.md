---
id: implement-performance-dashboard
title: Implement Performance Dashboard API
description: >
  This change implements the performance dashboard API as specified in 'docs/specs-dashboard-performance.md'. 
  It provides endpoints for performance summary, semester history, and user skills.
author: Gemini
status: proposal
depends-on: [implement-student-management-api]
---

## Proposal

The `docs/specs-dashboard-performance.md` defines a set of APIs to visualize student performance. This proposal outlines the implementation of these endpoints.

### Goals

1.  Implement `GET /api/v1/performance/summary`
2.  Implement `GET /api/v1/performance/semesters`
3.  Implement `GET /api/v1/performance/skills`

### Architecture

We will implement this in the `assessment-service` (for grades/performance) and `user-profile-service` (for skills).
However, the spec suggests a dedicated `performance-service` or `user-profile-service`. 
Given the data sources:
- Grades/GPA come from `assessment-service`.
- Skills come from `user-profile-service`.

To provide a unified API as requested (`/api/v1/performance/**`), we can either:
1.  Create a new `performance-service` (Overkill).
2.  Add to `user-profile-service` and aggregate (Consistent with previous student-management-api).
3.  Add to `assessment-service` (Logical for performance data, but skills are in profile).

**Decision:** We will implement the aggregation in `user-profile-service` (or a new `performance` controller within it) to maintain consistency with the `student-management-api` pattern where `user-profile-service` acts as the gateway for student-centric views.

### Dependencies

- `assessment-service`: Needs to provide GPA, credits, rank, achievements.
- `user-profile-service`: Already has skills.
