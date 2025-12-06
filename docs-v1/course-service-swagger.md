# Course Service Swagger (OpenAPI 3.0)

- Base URL: `http://localhost:8084`
- Auth: Bearer JWT (`Authorization: Bearer <token>`) with `sub` as UUID; dev mode also accepts `X-User-Id`/`X-Dev-User-Id` headers per `SecurityConfig`.
- Content type: `application/json`

```yaml
openapi: 3.0.3
info:
  title: Course Service API
  version: 1.0.0
  description: API for managing courses, chapters, lessons, and enrollments.
servers:
  - url: http://localhost:8084
    description: Local/Dev
tags:
  - name: Health
  - name: Course
  - name: Chapter
  - name: Enrollment
  - name: Lesson
paths:
  /api/v1/health:
    get:
      tags: [Health]
      summary: Health check
      security: []
      responses:
        '200':
          description: Service is up
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/HealthStatus'
  /api/v1/health/ready:
    get:
      tags: [Health]
      summary: Readiness probe
      security: []
      responses:
        '200':
          description: Service is ready
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/HealthStatus'
  /api/v1/health/live:
    get:
      tags: [Health]
      summary: Liveness probe
      security: []
      responses:
        '200':
          description: Service is alive
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/HealthStatus'
  /api/v1/courses:
    post:
      tags: [Course]
      summary: Create a new course
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateCourseRequest'
      responses:
        '201':
          description: Course created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CourseResponse'
        '400': { description: Bad Request }
        '401': { description: Unauthorized }
    get:
      tags: [Course]
      summary: Get all courses with pagination
      security:
        - bearerAuth: []
      parameters:
        - in: query
          name: page
          schema: { type: integer, default: 0 }
        - in: query
          name: size
          schema: { type: integer, default: 20 }
        - in: query
          name: sort
          schema: { type: string, default: "createdAt,desc" }
        - in: query
          name: semester
          schema: { type: string }
        - in: query
          name: enrollmentStatus
          schema: { type: string }
      responses:
        '200':
          description: List of courses
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/CourseResponse'
        '401': { description: Unauthorized }
  /api/v1/courses/{id}:
    get:
      tags: [Course]
      summary: Get course by ID
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: integer, format: int64 }
      responses:
        '200':
          description: Course found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CourseResponse'
        '401': { description: Unauthorized }
        '404': { description: Course not found }
    put:
      tags: [Course]
      summary: Update course
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: integer, format: int64 }
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateCourseRequest'
      responses:
        '200':
          description: Course updated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CourseResponse'
        '400': { description: Bad Request }
        '401': { description: Unauthorized }
        '404': { description: Course not found }
    delete:
      tags: [Course]
      summary: Delete course
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: integer, format: int64 }
      responses:
        '204': { description: No Content }
        '401': { description: Unauthorized }
        '403': { description: Forbidden }
        '404': { description: Course not found }
  /api/v1/courses/instructor/{instructorId}:
    get:
      tags: [Course]
      summary: Get courses by instructor
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: instructorId
          required: true
          schema: { type: integer, format: int64 }
        - in: query
          name: page
          schema: { type: integer, default: 0 }
        - in: query
          name: size
          schema: { type: integer, default: 20 }
        - in: query
          name: sort
          schema: { type: string, default: "createdAt,desc" }
      responses:
        '200':
          description: List of courses by instructor
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/CourseResponse'
        '401': { description: Unauthorized }
  /api/v1/courses/my-courses:
    get:
      tags: [Course]
      summary: Get my courses (current instructor)
      security:
        - bearerAuth: []
      parameters:
        - in: query
          name: page
          schema: { type: integer, default: 0 }
        - in: query
          name: size
          schema: { type: integer, default: 20 }
        - in: query
          name: sort
          schema: { type: string, default: "createdAt,desc" }
      responses:
        '200':
          description: List of my courses
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/CourseResponse'
        '401': { description: Unauthorized }
  /api/v1/courses/published:
    get:
      tags: [Course]
      summary: Get published courses
      security:
        - bearerAuth: []
      parameters:
        - in: query
          name: page
          schema: { type: integer, default: 0 }
        - in: query
          name: size
          schema: { type: integer, default: 20 }
        - in: query
          name: sort
          schema: { type: string, default: "publishedAt,desc" }
        - in: query
          name: semester
          schema: { type: string }
      responses:
        '200':
          description: List of published courses
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/CourseResponse'
        '401': { description: Unauthorized }
  /api/v1/courses/search:
    get:
      tags: [Course]
      summary: Search courses by title
      security:
        - bearerAuth: []
      parameters:
        - in: query
          name: keyword
          required: true
          schema: { type: string }
        - in: query
          name: page
          schema: { type: integer, default: 0 }
        - in: query
          name: size
          schema: { type: integer, default: 20 }
        - in: query
          name: sort
          schema: { type: string, default: "createdAt,desc" }
      responses:
        '200':
          description: List of matching courses
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/CourseResponse'
        '401': { description: Unauthorized }
  /api/v1/courses/{id}/publish:
    post:
      tags: [Course]
      summary: Publish course
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: integer, format: int64 }
      responses:
        '200':
          description: Course published
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CourseResponse'
        '401': { description: Unauthorized }
        '403': { description: Forbidden }
        '404': { description: Course not found }
  /api/v1/courses/{id}/archive:
    post:
      tags: [Course]
      summary: Archive course
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: integer, format: int64 }
      responses:
        '200':
          description: Course archived
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CourseResponse'
        '401': { description: Unauthorized }
        '403': { description: Forbidden }
        '404': { description: Course not found }
  /api/v1/courses/{id}/stats:
    get:
      tags: [Course]
      summary: Get course statistics
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: integer, format: int64 }
      responses:
        '200':
          description: Course statistics
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CourseStatsResponse'
        '401': { description: Unauthorized }
        '403': { description: Forbidden }
        '404': { description: Course not found }
  /api/v1/courses/{courseId}/chapters:
    post:
      tags: [Chapter]
      summary: Create a new chapter
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: courseId
          required: true
          schema: { type: integer, format: int64 }
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateChapterRequest'
      responses:
        '201':
          description: Chapter created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ChapterResponse'
        '400': { description: Bad Request }
        '401': { description: Unauthorized }
        '403': { description: Forbidden }
        '404': { description: Course not found }
    get:
      tags: [Chapter]
      summary: Get all chapters for a course
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: courseId
          required: true
          schema: { type: integer, format: int64 }
      responses:
        '200':
          description: List of chapters
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/ChapterResponse'
        '401': { description: Unauthorized }
        '404': { description: Course not found }
  /api/v1/chapters/{id}:
    get:
      tags: [Chapter]
      summary: Get chapter by ID
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: integer, format: int64 }
      responses:
        '200':
          description: Chapter found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ChapterResponse'
        '401': { description: Unauthorized }
        '404': { description: Chapter not found }
    put:
      tags: [Chapter]
      summary: Update chapter
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: integer, format: int64 }
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateChapterRequest'
      responses:
        '200':
          description: Chapter updated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ChapterResponse'
        '400': { description: Bad Request }
        '401': { description: Unauthorized }
        '403': { description: Forbidden }
        '404': { description: Chapter not found }
    delete:
      tags: [Chapter]
      summary: Delete chapter
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: integer, format: int64 }
      responses:
        '204': { description: No Content }
        '401': { description: Unauthorized }
        '403': { description: Forbidden }
        '404': { description: Chapter not found }
  /api/v1/courses/{courseId}/chapters/reorder:
    put:
      tags: [Chapter]
      summary: Reorder chapters
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: courseId
          required: true
          schema: { type: integer, format: int64 }
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ReorderChaptersRequest'
      responses:
        '200':
          description: Chapters reordered
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/ChapterResponse'
        '400': { description: Bad Request }
        '401': { description: Unauthorized }
        '403': { description: Forbidden }
        '404': { description: Course not found }
  /api/v1/courses/{courseId}/enroll:
    post:
      tags: [Enrollment]
      summary: Enroll in a course
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: courseId
          required: true
          schema: { type: integer, format: int64 }
      responses:
        '201':
          description: Successfully enrolled
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/EnrollmentResponse'
        '400': { description: Bad Request }
        '401': { description: Unauthorized }
        '403': { description: Forbidden }
        '404': { description: Course not found }
        '409': { description: Conflict (already enrolled) }
  /api/v1/courses/my-courses:
    get:
      tags: [Enrollment]
      summary: Get current student's enrolled courses
      security:
        - bearerAuth: []
      parameters:
        - in: query
          name: status
          schema: { type: string }
          description: Filter by enrollment status (e.g., ACTIVE, COMPLETED, DROPPED)
        - in: query
          name: q
          schema: { type: string }
          description: Search by course title or code
      responses:
        '200':
          description: List of enrolled courses
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/EnrollmentResponse'
        '401': { description: Unauthorized }
  /api/v1/courses/my-courses/stats:
    get:
      tags: [Enrollment]
      summary: Get course statistics for current student
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Course statistics
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CourseStatistics'
        '401': { description: Unauthorized }
  /api/v1/courses/{courseId}/enrollments:
    get:
      tags: [Enrollment]
      summary: Get enrollments for a specific course (Teacher/Admin only)
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: courseId
          required: true
          schema: { type: integer, format: int64 }
        - in: query
          name: status
          schema: { type: string }
          description: Filter by enrollment status (e.g., ACTIVE, COMPLETED, DROPPED)
      responses:
        '200':
          description: List of course enrollments
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/EnrollmentResponse'
        '401': { description: Unauthorized }
        '403': { description: Forbidden }
        '404': { description: Course not found }
  /api/v1/enrollments/{enrollmentId}/progress:
    patch:
      tags: [Enrollment]
      summary: Update learning progress for an enrollment (Student only)
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: enrollmentId
          required: true
          schema: { type: integer, format: int64 }
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                progress: { type: integer, minimum: 0, maximum: 100 }
              required: [progress]
      responses:
        '200':
          description: Enrollment progress updated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/EnrollmentResponse'
        '400': { description: Bad Request }
        '401': { description: Unauthorized }
        '403': { description: Forbidden }
        '404': { description: Enrollment not found }
  /api/v1/enrollments/{enrollmentId}:
    get:
      tags: [Enrollment]
      summary: Get specific enrollment details
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: enrollmentId
          required: true
          schema: { type: integer, format: int64 }
      responses:
        '200':
          description: Enrollment details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/EnrollmentResponse'
        '401': { description: Unauthorized }
        '404': { description: Enrollment not found }
    delete:
      tags: [Enrollment]
      summary: Drop enrollment (Student only)
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: enrollmentId
          required: true
          schema: { type: integer, format: int64 }
      responses:
        '204': { description: No Content }
        '401': { description: Unauthorized }
        '403': { description: Forbidden }
        '404': { description: Enrollment not found }
  /api/v1/courses/{courseId}/is-enrolled:
    get:
      tags: [Enrollment]
      summary: Check if student is enrolled in a course (Student only)
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: courseId
          required: true
          schema: { type: integer, format: int64 }
      responses:
        '200':
          description: Enrollment status
          content:
            application/json:
              schema:
                type: object
                properties:
                  enrolled: { type: boolean }
                required: [enrolled]
        '401': { description: Unauthorized }
        '404': { description: Course not found }
  /api/v1/enrollments/student/{studentId}:
    get:
      tags: [Enrollment]
      summary: Get all enrollments for a specific student (Teacher/Admin only)
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: studentId
          required: true
          schema: { type: integer, format: int64 }
      responses:
        '200':
          description: List of student's enrollments
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/EnrollmentResponse'
        '401': { description: Unauthorized }
        '403': { description: Forbidden }
        '404': { description: Student not found }
  /api/v1/chapters/{chapterId}/lessons:
    post:
      tags: [Lesson]
      summary: Create a new lesson
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: chapterId
          required: true
          schema: { type: integer, format: int64 }
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateLessonRequest'
      responses:
        '201':
          description: Lesson created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/LessonResponse'
        '400': { description: Bad Request }
        '401': { description: Unauthorized }
        '403': { description: Forbidden }
        '404': { description: Chapter not found }
    get:
      tags: [Lesson]
      summary: Get all lessons for a chapter
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: chapterId
          required: true
          schema: { type: integer, format: int64 }
      responses:
        '200':
          description: List of lessons
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/LessonResponse'
        '401': { description: Unauthorized }
        '404': { description: Chapter not found }
  /api/v1/lessons/{id}:
    get:
      tags: [Lesson]
      summary: Get lesson by ID
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: integer, format: int64 }
      responses:
        '200':
          description: Lesson found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/LessonResponse'
        '401': { description: Unauthorized }
        '404': { description: Lesson not found }
    put:
      tags: [Lesson]
      summary: Update lesson
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: integer, format: int64 }
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateLessonRequest'
      responses:
        '200':
          description: Lesson updated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/LessonResponse'
        '400': { description: Bad Request }
        '401': { description: Unauthorized }
        '403': { description: Forbidden }
        '404': { description: Lesson not found }
    delete:
      tags: [Lesson]
      summary: Delete lesson
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: integer, format: int64 }
      responses:
        '204': { description: No Content }
        '401': { description: Unauthorized }
        '403': { description: Forbidden }
        '404': { description: Lesson not found }
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
  schemas:
    HealthStatus:
      type: object
      properties:
        status: { type: string, example: UP }
        service: { type: string, example: course-service }
        timestamp: { type: string, format: date-time }
    CourseVisibility:
      type: string
      enum: [PUBLIC, PRIVATE]
    LessonType:
      type: string
      enum: [VIDEO, TEXT, QUIZ]
    CourseStatus:
      type: string
      enum: [DRAFT, PUBLISHED, ARCHIVED]
    EnrollmentStatus:
      type: string
      enum: [ACTIVE, COMPLETED, DROPPED]
    PrerequisiteType:
      type: string
      enum: [HARD, SOFT]
    TagType:
      type: string
      enum: [TOPIC, SKILL, DIFFICULTY]
    CreateChapterRequest:
      type: object
      required: [title]
      properties:
        title: { type: string, maxLength: 255 }
        description: { type: string, maxLength: 5000 }
    CreateCourseRequest:
      type: object
      required: [title, visibility]
      properties:
        title: { type: string, maxLength: 255 }
        description: { type: string, maxLength: 5000 }
        visibility: { $ref: '#/components/schemas/CourseVisibility' }
        code: { type: string, maxLength: 20 }
        credits: { type: integer }
        semester: { type: string, maxLength: 50 }
        schedule: { type: string, maxLength: 255 }
        maxStudents: { type: integer }
        startDate: { type: string, format: date }
        endDate: { type: string, format: date }
        thumbnailUrl: { type: string, maxLength: 500 }
        objectives: { type: string, maxLength: 5000 }
        tagIds: { type: array, items: { type: integer, format: int64 } }
        prerequisiteCourseIds: { type: array, items: { type: integer, format: int64 } }
    UpdateCourseRequest:
      type: object
      properties:
        title: { type: string, maxLength: 255 }
        description: { type: string, maxLength: 5000 }
        visibility: { $ref: '#/components/schemas/CourseVisibility' }
        code: { type: string, maxLength: 20 }
        credits: { type: integer }
        semester: { type: string, maxLength: 50 }
        schedule: { type: string, maxLength: 255 }
        maxStudents: { type: integer }
        startDate: { type: string, format: date }
        endDate: { type: string, format: date }
        thumbnailUrl: { type: string, maxLength: 500 }
        objectives: { type: string, maxLength: 5000 }
        tagIds: { type: array, items: { type: integer, format: int64 } }
        prerequisiteCourseIds: { type: array, items: { type: integer, format: int64 } }
    ReorderChaptersRequest:
      type: object
      required: [chapterIds]
      properties:
        chapterIds: { type: array, items: { type: integer, format: int64 } }
    CreateLessonRequest:
      type: object
      required: [title, type]
      properties:
        title: { type: string, maxLength: 255 }
        description: { type: string, maxLength: 5000 }
        type: { $ref: '#/components/schemas/LessonType' }
        masteryThreshold: { type: number, format: double, minimum: 0.0, maximum: 1.0 }
        content: { type: string }
        estimatedDuration: { type: integer }
    ChapterResponse:
      type: object
      properties:
        id: { type: integer, format: int64 }
        title: { type: string }
        description: { type: string }
        sequence: { type: integer }
        lessons: { type: array, items: { $ref: '#/components/schemas/LessonResponse' } }
        createdAt: { type: string, format: date-time }
        updatedAt: { type: string, format: date-time }
    CourseProgressResponse:
      type: object
      properties:
        courseId: { type: integer, format: int64 }
        progressPercent: { type: integer }
    CourseResponse:
      type: object
      properties:
        id: { type: integer, format: int64 }
        title: { type: string }
        description: { type: string }
        status: { $ref: '#/components/schemas/CourseStatus' }
        visibility: { $ref: '#/components/schemas/CourseVisibility' }
        instructorId: { type: integer, format: int64 }
        instructorName: { type: string }
        instructorAvatarUrl: { type: string }
        thumbnailUrl: { type: string }
        objectives: { type: string }
        code: { type: string }
        credits: { type: integer }
        semester: { type: string }
        schedule: { type: string }
        maxStudents: { type: integer }
        startDate: { type: string, format: date }
        endDate: { type: string, format: date }
        currentStudents: { type: integer }
        enrolled: { type: boolean }
        progress: { type: integer }
        instructor: { $ref: '#/components/schemas/InstructorSummaryResponse' }
        tags: { type: array, items: { $ref: '#/components/schemas/TagResponse' } }
        prerequisites: { type: array, items: { $ref: '#/components/schemas/PrerequisiteResponse' } }
        createdAt: { type: string, format: date-time }
        updatedAt: { type: string, format: date-time }
        publishedAt: { type: string, format: date-time }
        syllabus: { type: array, items: { type: object } }
        assignments: { type: array, items: { type: object } }
        resources: { type: array, items: { type: object } }
    CourseStatistics:
      type: object
      properties:
        totalCourses: { type: integer }
        activeCourses: { type: integer }
        totalCredits: { type: integer }
        averageProgress: { type: number, format: double }
    CourseStatsResponse:
      type: object
      properties:
        courseId: { type: integer, format: int64 }
        totalEnrollments: { type: integer, format: int64 }
        activeEnrollments: { type: integer, format: int64 }
        completedEnrollments: { type: integer, format: int64 }
        averageProgress: { type: number, format: double }
    EnrollmentResponse:
      type: object
      properties:
        id: { type: integer, format: int64 }
        courseId: { type: integer, format: int64 }
        courseTitle: { type: string }
        courseCode: { type: string }
        courseSemester: { type: string }
        courseSchedule: { type: string }
        courseCredits: { type: integer }
        courseMaxStudents: { type: integer }
        courseThumbnailUrl: { type: string }
        instructorName: { type: string }
        instructorAvatarUrl: { type: string }
        studentId: { type: integer, format: int64 }
        status: { $ref: '#/components/schemas/EnrollmentStatus' }
        progress: { type: integer }
        enrolledAt: { type: string, format: date-time }
        completedAt: { type: string, format: date-time }
        lastAccessAt: { type: string, format: date-time }
        updatedAt: { type: string, format: date-time }
    InstructorSummaryResponse:
      type: object
      properties:
        id: { type: integer, format: int64 }
        fullName: { type: string }
        avatarUrl: { type: string }
    LessonResponse:
      type: object
      properties:
        id: { type: integer, format: int64 }
        title: { type: string }
        description: { type: string }
        type: { $ref: '#/components/schemas/LessonType' }
        sequence: { type: integer }
        masteryThreshold: { type: number, format: double }
        content: { type: string }
        estimatedDuration: { type: integer }
        isCompleted: { type: boolean }
        nextLessonId: { type: integer, format: int64 }
        createdAt: { type: string, format: date-time }
        updatedAt: { type: string, format: date-time }
    PrerequisiteResponse:
      type: object
      properties:
        id: { type: integer, format: int64 }
        requiredCourseId: { type: integer, format: int64 }
        requiredCourseTitle: { type: string }
        type: { $ref: '#/components/schemas/PrerequisiteType' }
        description: { type: string }
    TagResponse:
      type: object
      properties:
        id: { type: integer, format: int64 }
        name: { type: string }
        type: { $ref: '#/components/schemas/TagType' }
        description: { type: string }
```
