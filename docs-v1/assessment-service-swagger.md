# Assessment Service Swagger (OpenAPI 3.0)

- Base URL: `http://localhost:8086`
- Auth: Bearer JWT (`Authorization: Bearer <token>`) with `sub` as UUID; dev mode also accepts `X-User-Id`/`X-Dev-User-Id` headers.
- Content type: `application/json`

```yaml
openapi: 3.0.3
info:
  title: Assessment Service API
  version: 1.0.0
  description: API for managing assessments, exams, questions, submissions, and gradebook.
servers:
  - url: http://localhost:8086
    description: Local/Dev
tags:
  - name: Health
  - name: Assessment
  - name: Attempt
  - name: Document
  - name: ExamConfig
  - name: Gradebook
  - name: Question
  - name: QuestionPool
  - name: Skill
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
  /api/v1/assessment/gradebook/summary:
    get:
      tags: [Assessment]
      summary: Get gradebook summary for current user
      security:
        - bearerAuth: []
      parameters:
        - in: query
          name: semester
          schema: { type: string }
          description: Filter by semester
      responses:
        '200':
          description: Gradebook summary
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/GradebookSummaryResponse'
        '401': { description: Unauthorized }
  /api/v1/assessment/gradebook/summary/v2:
    get:
      tags: [Assessment]
      summary: Get gradebook summary V2 (with studentId filter)
      security:
        - bearerAuth: []
      parameters:
        - in: query
          name: semester
          schema: { type: string }
          description: Filter by semester
        - in: query
          name: studentId
          schema: { type: string, format: uuid }
          description: Filter by student ID
      responses:
        '200':
          description: Gradebook summary V2
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/GradebookSummaryV2Response'
        '401': { description: Unauthorized }
  /api/v1/assessment/gradebook/history/{studentId}:
    get:
      tags: [Assessment]
      summary: Get gradebook history for a student
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: studentId
          required: true
          schema: { type: string, format: uuid }
      responses:
        '200':
          description: Gradebook history
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/GradebookHistoryResponse'
        '401': { description: Unauthorized }
        '404': { description: Student not found }
  /api/v1/assessment/analytics:
    get:
      tags: [Assessment]
      summary: Get analytics for current user or a specific student
      security:
        - bearerAuth: []
      parameters:
        - in: query
          name: studentId
          schema: { type: string, format: uuid }
          description: Filter by student ID
      responses:
        '200':
          description: Analytics data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AnalyticsResponse'
        '401': { description: Unauthorized }
  /api/v1/assessment/achievements:
    get:
      tags: [Assessment]
      summary: Get current user's achievements
      security:
        - bearerAuth: []
      responses:
        '200':
          description: List of achievements
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/AchievementResponse'
        '401': { description: Unauthorized }
  /api/v1/assessment/achievements/{code}/award:
    post:
      tags: [Assessment]
      summary: Award an achievement to current user
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: code
          required: true
          schema: { type: string }
      responses:
        '200': { description: Achievement awarded successfully }
        '401': { description: Unauthorized }
        '404': { description: Achievement not found }
  /api/v1/exams/{configId}/start:
    post:
      tags: [Attempt]
      summary: Start an exam attempt
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: configId
          required: true
          schema: { type: integer, format: int64 }
      responses:
        '200':
          description: Exam attempt started
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AttemptStartResponse'
        '401': { description: Unauthorized }
        '404': { description: Exam configuration not found }
  /api/v1/attempts/{id}/submit:
    post:
      tags: [Attempt]
      summary: Submit an exam attempt
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
              $ref: '#/components/schemas/AttemptSubmitRequest'
      responses:
        '200':
          description: Exam attempt submitted
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AttemptSubmitResponse'
        '400': { description: Bad Request }
        '401': { description: Unauthorized }
        '404': { description: Attempt not found }
  /api/v1/attempts/{id}/result:
    get:
      tags: [Attempt]
      summary: Get results of an exam attempt
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: integer, format: int64 }
      responses:
        '200':
          description: Attempt results
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AttemptResultResponse'
        '401': { description: Unauthorized }
        '404': { description: Attempt not found }
  /api/v1/documents/stats:
    get:
      tags: [Document]
      summary: Document statistics of current user
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Stats
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/DocumentStatisticsResponse'
        '401': { description: Unauthorized }
  /api/v1/documents:
    get:
      tags: [Document]
      summary: List documents of current user
      security:
        - bearerAuth: []
      parameters:
        - in: query
          name: category
          schema: { type: string }
          description: Filter by document category (NOTE, ASSIGNMENT, REFERENCE, PROJECT)
        - in: query
          name: isFavorite
          schema: { type: boolean }
          description: Filter by favorite status
        - in: query
          name: q
          schema: { type: string }
          description: Case-insensitive search on title/content/tags
      responses:
        '200':
          description: Documents
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/DocumentResponse'
        '401': { description: Unauthorized }
    post:
      tags: [Document]
      summary: Create document
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/DocumentRequest'
      responses:
        '201':
          description: Created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/DocumentResponse'
        '400': { description: Validation failed }
        '401': { description: Unauthorized }
  /api/v1/documents/{id}:
    get:
      tags: [Document]
      summary: Get document by ID (owner only)
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string, format: uuid }
      responses:
        '200':
          description: Document
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/DocumentResponse'
        '401': { description: Unauthorized }
        '404': { description: Document not found }
    put:
      tags: [Document]
      summary: Update document (owner only)
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string, format: uuid }
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/DocumentRequest'
      responses:
        '200':
          description: Updated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/DocumentResponse'
        '401': { description: Unauthorized }
        '404': { description: Document not found }
    delete:
      tags: [Document]
      summary: Delete document (owner only)
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string, format: uuid }
      responses:
        '204': { description: Deleted }
        '401': { description: Unauthorized }
        '404': { description: Document not found }
  /api/v1/documents/{id}/favorite:
    patch:
      tags: [Document]
      summary: Toggle favorite flag
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string, format: uuid }
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/FavoriteToggleRequest'
      responses:
        '200':
          description: Updated document
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/DocumentResponse'
        '401': { description: Unauthorized }
        '404': { description: Document not found }
  /api/v1/exams:
    post:
      tags: [ExamConfig]
      summary: Create exam configuration
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ExamConfigRequest'
      responses:
        '200':
          description: Exam configuration created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ExamConfigResponse'
        '400': { description: Bad Request }
        '401': { description: Unauthorized }
    put:
      tags: [ExamConfig]
      summary: Update exam configuration
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
              $ref: '#/components/schemas/ExamConfigRequest'
      responses:
        '200':
          description: Exam configuration updated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ExamConfigResponse'
        '400': { description: Bad Request }
        '401': { description: Unauthorized }
        '404': { description: Exam configuration not found }
  /api/v1/exams/{id}:
    get:
      tags: [ExamConfig]
      summary: Get exam configuration by ID
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: integer, format: int64 }
      responses:
        '200':
          description: Exam configuration
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ExamConfigResponse'
        '401': { description: Unauthorized }
        '404': { description: Exam configuration not found }
    delete:
      tags: [ExamConfig]
      summary: Delete exam configuration
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
        '404': { description: Exam configuration not found }
  /api/v1/gradebook/courses/{courseId}:
    get:
      tags: [Gradebook]
      summary: Get course grades
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: courseId
          required: true
          schema: { type: integer, format: int64 }
        - in: query
          name: page
          schema: { type: integer, default: 0 }
        - in: query
          name: size
          schema: { type: integer, default: 20 }
      responses:
        '200':
          description: List of course grades
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/GradebookResponse'
        '401': { description: Unauthorized }
  /api/v1/gradebook/my/courses/{courseId}:
    get:
      tags: [Gradebook]
      summary: Get current user's course grades
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: courseId
          required: true
          schema: { type: integer, format: int64 }
        - in: query
          name: page
          schema: { type: integer, default: 0 }
        - in: query
          name: size
          schema: { type: integer, default: 20 }
      responses:
        '200':
          description: List of current user's course grades
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/GradebookResponse'
        '401': { description: Unauthorized }
  /api/v1/gradebook/student/{studentId}/course/{courseId}:
    get:
      tags: [Gradebook]
      summary: Get a student's grades for a specific course
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: studentId
          required: true
          schema: { type: string, format: uuid }
        - in: path
          name: courseId
          required: true
          schema: { type: integer, format: int64 }
        - in: query
          name: page
          schema: { type: integer, default: 0 }
        - in: query
          name: size
          schema: { type: integer, default: 20 }
      responses:
        '200':
          description: List of student's course grades
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/GradebookResponse'
        '401': { description: Unauthorized }
        '404': { description: Student or Course not found }
  /api/v1/gradebook/student/{studentId}/history:
    get:
      tags: [Gradebook]
      summary: Get a student's gradebook history
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: studentId
          required: true
          schema: { type: string, format: uuid }
      responses:
        '200':
          description: Student's gradebook history
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/GradebookHistoryResponse'
        '401': { description: Unauthorized }
        '404': { description: Student not found }
  /api/v1/gradebook/student/{studentId}/analytics:
    get:
      tags: [Gradebook]
      summary: Get a student's gradebook analytics
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: studentId
          required: true
          schema: { type: string, format: uuid }
        - in: query
          name: timeframe
          schema: { type: string, default: "semester" }
          description: Timeframe for analytics (e.g., semester, year)
      responses:
        '200':
          description: Student's gradebook analytics
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AnalyticsResponse'
        '401': { description: Unauthorized }
        '404': { description: Student not found }
  /api/v1/gradebook/student/{studentId}/summary:
    get:
      tags: [Gradebook]
      summary: Get a student's gradebook summary
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: studentId
          required: true
          schema: { type: string, format: uuid }
      responses:
        '200':
          description: Student's gradebook summary
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/GradebookSummaryResponse'
        '401': { description: Unauthorized }
        '404': { description: Student not found }
  /api/v1/questions:
    post:
      tags: [Question]
      summary: Create a new question
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/QuestionRequest'
      responses:
        '200':
          description: Question created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/QuestionResponse'
        '400': { description: Bad Request }
        '401': { description: Unauthorized }
  /api/v1/questions/{id}:
    get:
      tags: [Question]
      summary: Get question by ID
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: integer, format: int64 }
      responses:
        '200':
          description: Question found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/QuestionResponse'
        '401': { description: Unauthorized }
        '404': { description: Question not found }
    put:
      tags: [Question]
      summary: Update question
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
              $ref: '#/components/schemas/QuestionRequest'
      responses:
        '200':
          description: Question updated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/QuestionResponse'
        '400': { description: Bad Request }
        '401': { description: Unauthorized }
        '404': { description: Question not found }
    delete:
      tags: [Question]
      summary: Delete question
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
        '404': { description: Question not found }
  /api/v1/questions/pool/{poolId}:
    get:
      tags: [Question]
      summary: Get questions by pool ID
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: poolId
          required: true
          schema: { type: integer, format: int64 }
      responses:
        '200':
          description: List of questions in the pool
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/QuestionResponse'
        '401': { description: Unauthorized }
        '404': { description: Question pool not found }
  /api/v1/pools:
    post:
      tags: [QuestionPool]
      summary: Create a new question pool
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/QuestionPoolRequest'
      responses:
        '200':
          description: Question pool created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/QuestionPoolResponse'
        '400': { description: Bad Request }
        '401': { description: Unauthorized }
    put:
      tags: [QuestionPool]
      summary: Update question pool
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
              $ref: '#/components/schemas/QuestionPoolRequest'
      responses:
        '200':
          description: Question pool updated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/QuestionPoolResponse'
        '400': { description: Bad Request }
        '401': { description: Unauthorized }
        '404': { description: Question pool not found }
  /api/v1/pools/{id}:
    get:
      tags: [QuestionPool]
      summary: Get question pool by ID
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: integer, format: int64 }
      responses:
        '200':
          description: Question pool found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/QuestionPoolResponse'
        '401': { description: Unauthorized }
        '404': { description: Question pool not found }
    delete:
      tags: [QuestionPool]
      summary: Delete question pool
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
        '404': { description: Question pool not found }
  /api/v1/pools/my:
    get:
      tags: [QuestionPool]
      summary: Get current user's question pools
      security:
        - bearerAuth: []
      responses:
        '200':
          description: List of question pools
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/QuestionPoolResponse'
        '401': { description: Unauthorized }
  /api/v1/assessment/skills:
    get:
      tags: [Skill]
      summary: Get skill radar data
      security:
        - bearerAuth: []
      parameters:
        - in: query
          name: studentId
          schema: { type: string, format: uuid }
          description: Optional student ID to get skill radar for
      responses:
        '200':
          description: Skill radar data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SkillRadarResponse'
        '401': { description: Unauthorized }
  /api/v1/assessment/skills/{userId}:
    get:
      tags: [Skill]
      summary: Get skills for a specific user
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: userId
          required: true
          schema: { type: string, format: uuid }
      responses:
        '200':
          description: User's skills
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AssessmentSkillResponse'
        '401': { description: Unauthorized }
        '404': { description: User not found }
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
        service: { type: string, example: assessment-service }
    AttemptStatus:
      type: string
      enum: [IN_PROGRESS, SUBMITTED, UNDER_REVIEW, GRADED]
    DocumentCategory:
      type: string
      enum: [NOTE, ASSIGNMENT, REFERENCE, PROJECT]
    QuestionType:
      type: string
      enum: [MCQ, CODING, ESSAY]
    AnswerRequest:
      type: object
      required: [questionId]
      properties:
        questionId: { type: integer, format: int64 }
        response: { type: object, additionalProperties: true }
    AttemptSubmitRequest:
      type: object
      required: [answers]
      properties:
        answers: { type: array, items: { $ref: '#/components/schemas/AnswerRequest' } }
    ExamConfigRequest:
      type: object
      required: [title, courseId]
      properties:
        title: { type: string }
        courseId: { type: integer, format: int64 }
        lessonId: { type: integer, format: int64 }
        policy: { type: string }
        browserLockEnabled: { type: boolean }
        timeLimitMinutes: { type: integer }
        windowStart: { type: string, format: date-time }
        windowEnd: { type: string, format: date-time }
        policyConfig: { type: object, additionalProperties: true }
        sections: { type: array, items: { $ref: '#/components/schemas/ExamSectionRuleRequest' } }
    ExamSectionRuleRequest:
      type: object
      required: [poolId, countToPull]
      properties:
        poolId: { type: integer, format: int64 }
        countToPull: { type: integer }
        pointsPerQuestion: { type: integer }
    QuestionPoolRequest:
      type: object
      required: [name]
      properties:
        name: { type: string }
        difficulty: { type: string }
        isPublic: { type: boolean }
    QuestionRequest:
      type: object
      required: [poolId, type, content]
      properties:
        poolId: { type: integer, format: int64 }
        type: { $ref: '#/components/schemas/QuestionType' }
        content: { type: string }
        metadata: { type: object, additionalProperties: true }
        weight: { type: number, format: double }
        skillTag: { type: string }
    DocumentRequest:
      type: object
      required: [title, content, category]
      properties:
        title: { type: string, maxLength: 255 }
        content: { type: string }
        category: { $ref: '#/components/schemas/DocumentCategory' }
        course: { type: string, maxLength: 100 }
        tags: { type: array, items: { type: string } }
    FavoriteToggleRequest:
      type: object
      required: [isFavorite]
      properties:
        isFavorite: { type: boolean }
    AchievementResponse:
      type: object
      properties:
        id: { type: integer, format: int64 }
        code: { type: string }
        name: { type: string }
        description: { type: string }
        iconUrl: { type: string }
        icon: { type: string }
        points: { type: integer }
        category: { type: string }
        rarity: { type: string }
        earned: { type: boolean }
        isEarned: { type: boolean }
        earnedAt: { type: string, format: date-time }
        progress: { type: integer }
        progressDetail: { $ref: '#/components/schemas/AchievementProgress' }
    AchievementProgress:
      type: object
      properties:
        current: { type: integer }
        target: { type: integer }
    AnalyticsResponse:
      type: object
      properties:
        examScores: { type: array, items: { $ref: '#/components/schemas/ExamScorePoint' } }
        learningTime: { type: array, items: { $ref: '#/components/schemas/LearningTimePoint' } }
        strengths: { type: array, items: { type: string } }
        improvements: { type: array, items: { type: string } }
    ExamScorePoint:
      type: object
      properties:
        month: { type: string }
        score: { type: number, format: double }
        average: { type: number, format: double }
    LearningTimePoint:
      type: object
      properties:
        week: { type: string }
        hours: { type: integer }
    AnswerResultResponse:
      type: object
      properties:
        questionId: { type: integer, format: int64 }
        yourAnswer: { type: object, additionalProperties: true }
        correct: { type: boolean }
        score: { type: number, format: double }
    AssessmentSkillResponse:
      type: object
      properties:
        mastery: { type: object, additionalProperties: { type: number, format: double } }
    AttemptResultResponse:
      type: object
      properties:
        attemptId: { type: integer, format: int64 }
        score: { type: number, format: double }
        maxScore: { type: number, format: double }
        passed: { type: boolean }
        feedback: { type: string }
        answers: { type: array, items: { $ref: '#/components/schemas/AnswerResultResponse' } }
    AttemptStartResponse:
      type: object
      properties:
        attemptId: { type: integer, format: int64 }
        examConfigId: { type: integer, format: int64 }
        startedAt: { type: string, format: date-time }
        timeLimit: { type: integer }
    AttemptSubmitResponse:
      type: object
      properties:
        message: { type: string }
        submittedAt: { type: string, format: date-time }
    ExamConfigResponse:
      type: object
      properties:
        id: { type: integer, format: int64 }
        title: { type: string }
        courseId: { type: integer, format: int64 }
        lessonId: { type: integer, format: int64 }
        policy: { type: string }
        browserLockEnabled: { type: boolean }
        timeLimitMinutes: { type: integer }
        windowStart: { type: string, format: date-time }
        windowEnd: { type: string, format: date-time }
        policyConfig: { type: object, additionalProperties: true }
        instructorId: { type: string }
        createdAt: { type: string, format: date-time }
        sections: { type: array, items: { $ref: '#/components/schemas/ExamSectionRuleResponse' } }
    ExamSectionRuleResponse:
      type: object
      properties:
        id: { type: integer, format: int64 }
        poolId: { type: integer, format: int64 }
        poolName: { type: string }
        countToPull: { type: integer }
        pointsPerQuestion: { type: integer }
    GradebookHistoryResponse:
      type: object
      properties:
        studentId: { type: string, format: uuid }
        records: { type: array, items: { $ref: '#/components/schemas/AcademicRecord' } }
    AcademicRecord:
      type: object
      properties:
        semester: { type: string }
        gpa: { type: number, format: double }
        totalCredits: { type: integer }
        rank: { type: integer }
        totalStudents: { type: integer }
        achievements: { type: integer }
        attendance: { type: number, format: double }
        subjects: { type: array, items: { $ref: '#/components/schemas/SubjectRecord' } }
    SubjectRecord:
      type: object
      properties:
        name: { type: string }
        code: { type: string }
        credits: { type: integer }
        grade: { type: string }
        score: { type: number, format: double }
        teacher: { type: string }
    GradebookResponse:
      type: object
      properties:
        studentId: { type: string }
        studentName: { type: string }
        examId: { type: integer, format: int64 }
        examTitle: { type: string }
        score: { type: number, format: double }
        status: { type: string }
        gradedAt: { type: string, format: date-time }
    GradebookSummaryResponse:
      type: object
      properties:
        overallGpa: { type: number, format: double }
        totalCredits: { type: integer }
        completedCourses: { type: integer }
        inProgressCourses: { type: integer }
        rank: { type: integer }
        totalStudents: { type: integer }
        totalAchievements: { type: integer }
        semester: { type: string }
        courseGrades: { type: array, items: { $ref: '#/components/schemas/CourseGradeDetail' } }
    CourseGradeDetail:
      type: object
      properties:
        courseId: { type: integer, format: int64 }
        courseName: { type: string }
        courseCode: { type: string }
        finalScore: { type: number, format: double }
        grade: { type: string }
        gpa: { type: number, format: double }
        status: { type: string }
    GradebookSummaryV2Response:
      type: object
      properties:
        studentId: { type: string, format: uuid }
        semesters: { type: array, items: { $ref: '#/components/schemas/SemesterSummary' } }
        overall: { $ref: '#/components/schemas/OverallStats' }
    SemesterSummary:
      type: object
      properties:
        semester: { type: string }
        gpa: { type: number, format: double }
        totalCredits: { type: integer }
        rank: { type: integer }
        totalStudents: { type: integer }
        achievements: { type: integer }
        attendance: { type: number, format: double }
    OverallStats:
      type: object
      properties:
        gpa: { type: number, format: double }
        totalCredits: { type: integer }
    QuestionPoolResponse:
      type: object
      properties:
        id: { type: integer, format: int64 }
        name: { type: string }
        difficulty: { type: string }
        isPublic: { type: boolean }
        instructorId: { type: string }
        createdAt: { type: string, format: date-time }
    QuestionResponse:
      type: object
      properties:
        id: { type: integer, format: int64 }
        poolId: { type: integer, format: int64 }
        type: { $ref: '#/components/schemas/QuestionType' }
        content: { type: string }
        metadata: { type: object, additionalProperties: true }
        weight: { type: number, format: double }
        skillTag: { type: string }
    SkillRadarResponse:
      type: object
      properties:
        studentId: { type: string, format: uuid }
        skills: { type: array, items: { $ref: '#/components/schemas/SkillEntry' } }
    SkillEntry:
      type: object
      properties:
        name: { type: string }
        level: { type: integer }
        category: { type: string }
    DocumentResponse:
      type: object
      properties:
        id: { type: string, format: uuid }
        title: { type: string }
        content: { type: string }
        category: { $ref: '#/components/schemas/DocumentCategory' }
        course: { type: string }
        tags: { type: array, items: { type: string } }
        isFavorite: { type: boolean }
        createdAt: { type: string, format: date-time }
        updatedAt: { type: string, format: date-time }
    DocumentStatisticsResponse:
      type: object
      properties:
        totalDocuments: { type: integer, format: int64 }
        notesCount: { type: integer, format: int64 }
        assignmentsCount: { type: integer, format: int64 }
        referencesCount: { type: integer, format: int64 }
        projectsCount: { type: integer, format: int64 }
        favoritesCount: { type: integer, format: int64 }
```
