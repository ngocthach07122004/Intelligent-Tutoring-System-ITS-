# Dashboard Service Swagger (OpenAPI 3.0)

- Base URL: `http://localhost:8085`
- Auth: Bearer JWT (`Authorization: Bearer <token>`) with `sub` as UUID; dev mode also accepts `X-User-Id`/`X-Dev-User-Id` headers.
- Content type: `application/json`

```yaml
openapi: 3.0.3
info:
  title: Dashboard Service API
  version: 1.0.0
  description: API for retrieving various dashboard statistics and analytics for students, instructors, and admins.
servers:
  - url: http://localhost:8085
    description: Local/Dev
tags:
  - name: Health
  - name: Dashboard
paths:
  /health:
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
  /api/v1/dashboard/student:
    get:
      tags: [Dashboard]
      summary: Get student dashboard data
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Student dashboard data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/StudentDashboardResponse'
        '401': { description: Unauthorized }
        '403': { description: Forbidden }
  /api/v1/dashboard/student/summary:
    get:
      tags: [Dashboard]
      summary: Get student dashboard summary
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Student summary data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/DashboardSummaryResponse'
        '401': { description: Unauthorized }
        '403': { description: Forbidden }
  /api/v1/dashboard/student/analytics:
    get:
      tags: [Dashboard]
      summary: Get student analytics data
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Student analytics data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/StudentAnalyticsResponse'
        '401': { description: Unauthorized }
        '403': { description: Forbidden }
  /api/v1/dashboard/instructor/courses/{id}:
    get:
      tags: [Dashboard]
      summary: Get instructor course statistics
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: integer, format: int64 }
      responses:
        '200':
          description: Instructor course statistics
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/InstructorCourseStatsResponse'
        '401': { description: Unauthorized }
        '403': { description: Forbidden }
        '404': { description: Course not found }
  /api/v1/dashboard/instructor/at-risk:
    get:
      tags: [Dashboard]
      summary: Get list of at-risk students for instructors
      security:
        - bearerAuth: []
      responses:
        '200':
          description: List of at-risk students
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AtRiskListResponse'
        '401': { description: Unauthorized }
        '403': { description: Forbidden }
  /api/v1/dashboard/admin/stats:
    get:
      tags: [Dashboard]
      summary: Get admin statistics
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Admin statistics
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AdminStatsResponse'
        '401': { description: Unauthorized }
        '403': { description: Forbidden }
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
        service: { type: string, example: dashboard-service }
    RiskLevel:
      type: string
      enum: [LOW, MEDIUM, HIGH]
    AdminStatsResponse:
      type: object
      properties:
        activeUsers: { type: integer }
        revenueThisMonth: { type: number, format: double }
        totalCourses: { type: integer }
        systemHealth: { type: string }
    AtRiskListResponse:
      type: object
      properties:
        students: { type: array, items: { $ref: '#/components/schemas/AtRiskStudentDTO' } }
    AtRiskStudentDTO:
      type: object
      properties:
        studentId: { type: string, format: uuid }
        studentName: { type: string }
        riskLevel: { $ref: '#/components/schemas/RiskLevel' }
        reasons: { type: array, items: { type: string } }
    DashboardSummaryResponse:
      type: object
      properties:
        profile: { type: object } # External UserProfileResponse
        courses: { type: array, items: { type: object } } # External EnrollmentResponse
        courseStats: { $ref: '#/components/schemas/CourseStats' }
        performance: { type: object } # External GradebookSummaryResponse
        achievements: { type: array, items: { type: object } } # External AchievementResponse
        achievementsCount: { type: integer }
        totalLearningHours: { type: integer }
        upcomingAssignments: { type: integer }
    CourseStats:
      type: object
      properties:
        totalCourses: { type: integer }
        inProgressCourses: { type: integer }
        completedCourses: { type: integer }
        averageProgress: { type: number, format: double }
    InstructorCourseStatsResponse:
      type: object
      properties:
        averageScore: { type: number, format: double }
        atRiskCount: { type: integer }
        completionRate: { type: number, format: double }
    StudentAnalyticsResponse:
      type: object
      properties:
        academicProgress: { $ref: '#/components/schemas/AcademicProgress' }
        subjectPerformance: { type: array, items: { $ref: '#/components/schemas/SubjectPerformance' } }
        attendanceRate: { type: number, format: double }
        assignmentCompletion: { type: number, format: double }
        examScores: { type: array, items: { $ref: '#/components/schemas/ExamScore' } }
        learningTime: { type: array, items: { $ref: '#/components/schemas/LearningTime' } }
        strengths: { type: array, items: { type: string } }
        improvements: { type: array, items: { type: string } }
    AcademicProgress:
      type: object
      properties:
        currentGPA: { type: number, format: double }
        previousGPA: { type: number, format: double }
        trend: { type: string, enum: [up, down, stable] }
        percentChange: { type: number, format: double }
    SubjectPerformance:
      type: object
      properties:
        name: { type: string }
        currentScore: { type: number, format: double }
        previousScore: { type: number, format: double }
        trend: { type: string, enum: [up, down, stable] }
        percentChange: { type: number, format: double }
        color: { type: string }
    ExamScore:
      type: object
      properties:
        month: { type: string }
        score: { type: number, format: double }
        average: { type: number, format: double }
    LearningTime:
      type: object
      properties:
        week: { type: string }
        hours: { type: number, format: double }
    StudentDashboardResponse:
      type: object
      properties:
        summary: { $ref: '#/components/schemas/DashboardSummary' }
        riskProfile: { $ref: '#/components/schemas/RiskProfileDTO_nested' }
        skillRadar: { type: object, additionalProperties: { type: number, format: double } }
    DashboardSummary:
      type: object
      properties:
        coursesInProgress: { type: integer }
        nextAssignmentDue: { type: string, format: date-time }
    RiskProfileDTO_nested:
      type: object
      properties:
        level: { $ref: '#/components/schemas/RiskLevel' }
        trend: { type: string, enum: [STABLE, INCREASING, DECREASING] }
```
