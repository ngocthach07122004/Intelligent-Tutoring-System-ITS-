# Route: /dashboard/performance

## Overview

This document specifies the API endpoints for the user's performance summary page (`/dashboard/performance`). This page provides a comprehensive overview of the user's academic achievements, GPA trends, and personal skills.

## API Usage

- **Current Status**: Backend not implemented. The API defined here is based on the frontend UI requirements.
- **Proposed Backend Service**: A dedicated `performance-service` or could be part of the `user-profile-service`.

---

### Data Models

#### 1. `PerformanceSummary`

Provides the aggregate data for the main statistic cards at the top of the page.

| Field              | Type     | Description                                               | Example    |
|--------------------|----------|-----------------------------------------------------------|------------|
| `overallGpa`       | `number` | The user's cumulative Grade Point Average.                | `8.47`     |
| `totalCredits`     | `number` | The total number of credits accumulated across all semesters. | `56`       |
| `totalAchievements`| `number` | The total count of achievements or awards earned.         | `10`       |
| `currentRank`      | `object` | The user's most recent academic rank.                     | `{ "rank": 3, "totalStudents": 120 }` |
| `currentRank.rank` | `number` | The user's position.                                      | `3`        |
| `currentRank.totalStudents` | `number` | The total number of students in the cohort.      | `120`      |


#### 2. `SemesterPerformance`

Defines the academic performance metrics for a single semester. A list of these objects represents the user's academic history.

| Field          | Type     | Description                                      | Example         |
|----------------|----------|--------------------------------------------------|-----------------|
| `semester`     | `string` | The academic semester identifier.                | `"HK1 2024-2025"` |
| `gpa`          | `number` | The GPA for this specific semester.              | `8.75`          |
| `totalCredits` | `number` | The number of credits taken in this semester.    | `18`            |
| `rank`         | `number` | The user's rank within their cohort this semester. | `3`             |
| `totalStudents`| `number` | The total number of students in the cohort.      | `120`           |
| `achievements` | `number` | The number of achievements earned this semester. | `5`             |
| `attendance`   | `number` | The attendance percentage for the semester.      | `96.5`          |

#### 3. `Skill`

Represents a single skill or competency of the user.

| Field      | Type                                     | Description                               | Example          |
|------------|------------------------------------------|-------------------------------------------|------------------|
| `name`     | `string`                                 | The name of the skill.                    | `"Python"`       |
| `level`    | `number`                                 | The user's proficiency level (0-100).     | `85`             |
| `category` | `'technical' \| 'soft' \| 'language'`    | The category the skill belongs to.        | `'technical'`    |

---

### Endpoints

#### 1. Get Performance Summary

- **Endpoint**: `GET /api/v1/performance/summary`
- **Description**: Retrieves the aggregate statistics for the main dashboard cards.
- **Response Body**: `PerformanceSummary`

---

#### 2. Get Semester Performance History

- **Endpoint**: `GET /api/v1/performance/semesters`
- **Description**: Retrieves a list of the user's academic performance for all past and current semesters. This data is used for the semester-specific view and the GPA trend chart.
- **Response Body**: `List<SemesterPerformance>`

---

#### 3. Get User Skills

- **Endpoint**: `GET /api/v1/performance/skills`
- **Description**: Retrieves a list of all skills and competencies for the user.
- **Response Body**: `List<Skill>`