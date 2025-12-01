# Route: /dashboard/courses

## Overview

This document specifies the API endpoints required for the course management page (`/dashboard/courses`). The page allows logged-in users to view their enrolled courses, track their progress, and search for specific courses.

## API Usage

- **Current Status**: Backend endpoints are defined. The frontend needs to be integrated to replace the current mock data.
- **Backend Service**: Course Service

### Endpoints

---

#### 1. Get Course Statistics for User

- **Endpoint**: `GET /api/v1/courses/my-courses/stats`
- **Description**: Retrieves aggregate statistics for the current user's enrolled courses. This is used for the dashboard cards.
- **Response Body**: `CourseStatistics`

##### `CourseStatistics` Object Fields:

| Field             | Type     | Description                                       | Example |
|-------------------|----------|---------------------------------------------------|---------|
| `totalCourses`    | `number` | The total number of courses the user is enrolled in. | `8`       |
| `activeCourses`   | `number` | The number of courses currently in 'active' status. | `5`       |
| `totalCredits`    | `number` | The sum of credits from all enrolled courses.     | `24`      |
| `averageProgress` | `number` | The average progress percentage across all courses. | `72`      |

---

#### 2. Get Enrolled Courses

- **Endpoint**: `GET /api/v1/courses/my-courses`
- **Description**: Retrieves a list of courses the current user is enrolled in. Supports filtering and searching.
- **Query Parameters**:
  - `status` (optional): Filters courses by status. Accepts `'active'`, `'completed'`, or `'upcoming'`.
  - `q` (optional): A search query string to filter courses by name, code, or instructor.
- **Response Body**: `List<Course>`

##### `Course` Object Fields:

| Field          | Type                               | Description                                     | Example                                   |
|----------------|------------------------------------|-------------------------------------------------|-------------------------------------------|
| `id`           | `string`                           | Unique identifier for the course.               | `"CS101"`                                 |
| `name`         | `string`                           | The full name of the course.                    | `"Lập trình căn bản"`                      |
| `code`         | `string`                           | The course code.                                | `"CS101"`                                 |
| `instructor`   | `string`                           | The name of the course instructor.              | `"Nguyễn Văn A"`                          |
| `semester`     | `string`                           | The semester the course is offered in.          | `"HK1 2024-2025"`                         |
| `credits`      | `number`                           | The number of credit hours for the course.      | `4`                                       |
| `schedule`     | `string`                           | The weekly schedule for the course.             | `"Thứ 2, 4 - 7:00-9:00"`                  |
| `status`       | `'active' \| 'completed' \| 'upcoming'` | The current status of the course for the user.  | `'active'`                                |
| `enrollmentDate`| `string` (Date)                    | The date the user enrolled in the course.       | `"2024-08-15"`                            |
| `progress`     | `number`                           | The user's progress in the course (percentage). | `65`                                      |
| `students`     | `number`                           | The number of students currently enrolled.      | `45`                                      |
| `maxStudents`  | `number`                           | The maximum number of students for the course.  | `50`                                      |
| `description`  | `string`                           | A brief description of the course.              | `"Khóa học giới thiệu về lập trình với Python"` |

---

#### 3. Get Course Details by ID

- **Endpoint**: `GET /api/v1/courses/{id}`
- **Description**: Retrieves detailed information for a single course, which could include a syllabus, lesson plans, or other detailed materials not present in the list view.
- **Response Body**: `CourseDetail`

##### `CourseDetail` Object Fields:

*Extends the `Course` object with additional fields.*

| Field          | Type         | Description                                | Example                                            |
|----------------|--------------|--------------------------------------------|----------------------------------------------------|
| `syllabus`     | `List<Topic>` | A detailed list of topics covered.         | `[{ "week": 1, "topic": "Introduction" }, ...]`     |
| `assignments`  | `List<any>`  | A list of assignments for the course.      | `[{ "id": "A1", "title": "Bài tập 1" }, ...]`      |
| `resources`    | `List<any>`  | A list of learning resources or documents. | `[{ "name": "slide_chuong_1.pdf", "url": "..." }]` |

---

#### 4. Enroll in a Course

- **Endpoint**: `POST /api/v1/courses/{id}/enroll`
- **Description**: Enrolls the current user in a specific course.
- **Request Body**: (None)
- **Response**: `200 OK` on success.

## Notes

- The frontend component `CourseManagement.tsx` is the primary consumer of this data.
- The `GET /my-courses` endpoint must handle the `status` and `q` parameters to allow for the filtering and searching functionality seen in the UI.