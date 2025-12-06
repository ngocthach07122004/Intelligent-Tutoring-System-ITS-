# Route: /dashboard/student-management

## 1. Overview

This document specifies the comprehensive API required for the Student Management Dashboard. This dashboard is a multi-tab interface that provides detailed views into a student's profile, academic performance, and personal development. The API is designed to be modular, with endpoints corresponding to each tab to ensure efficient data loading.

The main resource path is `/api/v1/students/{id}`.

---

## 2. Data Models

### 2.1. `Student`
The core object representing the student's primary profile information.

| Field             | Type     | Description                                  |
|-------------------|----------|----------------------------------------------|
| `id`              | `string` | Unique student identifier.                   |
| `studentId`       | `string` | The student's official ID number.            |
| `name`            | `string` | Full name.                                   |
| `email`           | `string` | Email address.                               |
| `phone`           | `string` | Phone number.                                |
| `dateOfBirth`     | `string` | Date of birth (ISO 8601).                    |
| `address`         | `string` | Home address.                                |
| `class`           | `string` | Current class name (e.g., "12A1").           |
| `academicYear`    | `string` | Current academic year (e.g., "2023-2024").   |
| `enrollmentDate`  | `string` | Date of enrollment (ISO 8601).               |
| `avatar`          | `string` | URL to the student's avatar image.           |
| `emergencyContact`| `string` | Emergency contact phone number.              |
| `bloodType`       | `string` | Blood type (e.g., "A+").                     |
| `medicalNotes`    | `string` | Any relevant medical notes.                  |
| `parentName`      | `string` | Parent's or guardian's full name.            |
| `parentPhone`     | `string` | Parent's phone number.                       |
| `parentEmail`     | `string` | Parent's email address.                      |

### 2.2. `AcademicRecord`
A detailed record of a student's performance in a past semester. Used for the "Bảng điểm học tập" (Academic Records) tab.

| Field          | Type           | Description                                    |
|----------------|----------------|------------------------------------------------|
| `semester`     | `string`       | Semester identifier (e.g., "Học kỳ 1 - 2023-2024"). |
| `gpa`          | `number`       | GPA for the semester.                          |
| `totalCredits` | `number`       | Total credits taken in the semester.           |
| `rank`         | `number`       | Academic rank in the cohort for the semester.  |
| `totalStudents`| `number`       | Total students in the cohort.                  |
| `subjects`     | `List<SubjectGrade>` | List of subjects and grades for the semester.    |

#### `SubjectGrade` (Sub-model)
| Field       | Type     | Description                  |
|-------------|----------|------------------------------|
| `name`      | `string` | Subject name.                |
| `code`      | `string` | Subject code.                |
| `credits`   | `number` | Subject credits.             |
| `grade`     | `string` | Final letter grade (e.g., "A+"). |
| `score`     | `number` | Final numerical score.         |
| `teacher`   | `string` | Teacher's name.              |

### 2.3. `CurrentSubject`
A highly detailed object for a currently enrolled subject. Used for the "Môn học" (Subjects) tab.

| Field             | Type                 | Description                                    |
|-------------------|----------------------|------------------------------------------------|
| `id`              | `string`             | Unique subject identifier.                     |
| `name`            | `string`             | Subject name.                                  |
| `code`            | `string`             | Subject code.                                  |
| `teacher`         | `string`             | Teacher's name.                                |
| `currentGrade`    | `string`             | The current projected letter grade.            |
| `currentScore`    | `number`             | The current numerical score.                   |
| `credits`         | `number`             | Subject credits.                               |
| `attendance`      | `number`             | Attendance percentage.                         |
| `assignments`     | `object`             | Details about assignments.                     |
| `assignments.total` | `number`           | Total number of assignments.                   |
| `assignments.completed`| `number`        | Number of completed assignments.               |
| `assignments.avgScore` | `number`        | Average score of completed assignments.        |
| `exams`           | `object`             | Details about exams.                           |
| `exams.midterm`   | `number`             | Midterm exam score.                            |
| `exams.final`     | `number` (optional)  | Final exam score.                              |
| `exams.quizzes`   | `List<number>`       | List of quiz scores.                           |
| `progress`        | `object`             | Course completion progress.                    |
| `progress.completed` | `number`          | Number of topics/lessons completed.            |
| `progress.total`  | `number`             | Total number of topics/lessons.                |
| `nextAssignment`  | `object`             | Details of the next upcoming assignment.       |
| `recentActivities`| `List<object>`       | List of recent scored or logged activities.    |

### 2.4. `LearningAnalytics`
A complex object containing trend data and AI-driven insights. Used for the "Phân tích học tập" (Learning Analytics) tab.

| Field               | Type                  | Description                               |
|---------------------|-----------------------|-------------------------------------------|
| `academicProgress`  | `object`              | GPA trend analysis.                       |
| `subjectPerformance`| `List<object>`        | Performance trends for each subject.      |
| `attendanceRate`    | `number`              | Overall attendance percentage.            |
| `assignmentCompletion`| `number`            | Overall assignment completion rate.       |
| `examScores`        | `List<object>`        | Historical exam scores vs. class average. |
| `learningTime`      | `List<object>`        | Weekly study time analysis.               |
| `strengths`         | `List<string>`        | List of identified academic strengths.    |
| `improvements`      | `List<string>`        | List of suggested areas for improvement.  |

### 2.5. `Achievement`
Represents a badge or award. Used for the "Thành tích" (Achievements) tab.

| Field       | Type     | Description                                               |
|-------------|----------|-----------------------------------------------------------|
| `id`        | `string` | Unique achievement identifier.                            |
| `title`     | `string` | The name of the achievement.                              |
| `description`| `string` | How to earn the achievement.                              |
| `icon`      | `string` | An emoji or icon identifier.                              |
| `category`  | `'academic' \| 'attendance' \| 'participation'` | The category of the achievement. |
| `rarity`    | `'common' \| 'uncommon' \| 'rare' \| 'legendary'` | The rarity of the achievement.   |
| `isEarned`  | `boolean`| Whether the student has earned it.                          |
| `earnedDate`| `string` (optional) | The date it was earned (ISO 8601). |
| `progress`  | `object` (optional) | Current progress towards earning it.          |
| `progress.current`|`number`| Current progress value.                |
| `progress.target`|`number`| Target value to earn.                     |

---

## 3. API Endpoints

### 3.1. Profile Endpoints

#### GET `/api/v1/students/{id}`
- **Description**: Retrieves the core profile information for the specified student.
- **Response Body**: `Student`

#### PUT `/api/v1/students/{id}`
- **Description**: Updates the student's core profile information. Only editable fields should be included.
- **Request Body**: A `Student` object containing the fields to be updated.
- **Response Body**: The updated `Student` object.

#### GET `/api/v1/students/{id}/academic-history`
- **Description**: Retrieves the student's detailed academic history for all past semesters.
- **Response Body**: `List<AcademicRecord>`

### 3.2. Analytics Endpoint

#### GET `/api/v1/students/{id}/analytics`
- **Description**: Retrieves a comprehensive analytics report for the student.
- **Query Parameters**:
  - `timeframe` (optional, string): The time window for the analysis. Accepts `'semester'`, `'year'`, `'all'`. Defaults to `'semester'`.
- **Response Body**: `LearningAnalytics`

### 3.3. Subjects Endpoints

#### GET `/api/v1/students/{id}/subjects`
- **Description**: Retrieves the list of all currently enrolled subjects with detailed metrics.
- **Response Body**: `List<CurrentSubject>`

#### GET `/api/v1/students/{id}/subjects/{subjectId}`
- **Description**: Retrieves even more granular detail for a single subject, potentially including full lists of assignments, grades, etc. (for modal view).
- **Response Body**: A more detailed `CurrentSubject` object.

### 3.4. Achievements Endpoint

#### GET `/api/v1/students/{id}/achievements`
- **Description**: Retrieves the complete list of all possible and earned achievements for the student.
- **Response Body**: `List<Achievement>`