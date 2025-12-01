# User Profile Service Swagger (OpenAPI 3.0)

- Base URL: `http://localhost:8181`
- Auth: Bearer JWT (`Authorization: Bearer <token>`) with `sub` as UUID; dev mode also accepts `X-User-Id`/`X-Dev-User-Id` headers per `SecurityConfig`.
- Content type: `application/json`

```yaml
openapi: 3.0.3
info:
  title: User Profile Service API
  version: 1.0.0
  description: API surface for profile, skills, groups, schedules, documents, performance, and student analytics.
servers:
  - url: http://localhost:8181
    description: Local/Dev
tags:
  - name: Health
  - name: Profile
  - name: Skills
  - name: Documents
  - name: Groups
  - name: Schedules
  - name: Students
  - name: Performance
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
  /api/v1/profile/me:
    get:
      tags: [Profile]
      summary: Get current user's profile
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Current profile
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserProfileResponse'
        '401': { description: Unauthorized }
        '404': { description: Profile not found }
    put:
      tags: [Profile]
      summary: Update current user's profile
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserProfileRequest'
      responses:
        '200':
          description: Updated profile
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserProfileResponse'
        '400': { description: Validation failed }
        '401': { description: Unauthorized }
        '404': { description: Profile not found }
  /api/v1/profile/{userId}:
    get:
      tags: [Profile]
      summary: Get profile by user ID
      security: []
      parameters:
        - in: path
          name: userId
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Profile found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserProfileResponse'
        '404': { description: Profile not found }
  /api/v1/profile/users:
    get:
      tags: [Profile]
      summary: Bulk fetch profiles
      description: Accepts comma-separated IDs (`ids=uuid1,uuid2`) or repeated params.
      security: []
      parameters:
        - in: query
          name: ids
          required: true
          schema:
            type: array
            items:
              type: string
              format: uuid
          style: form
          explode: false
      responses:
        '200':
          description: Profiles list (existing IDs only)
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/UserProfileResponse'
  /api/v1/profile/skills:
    get:
      tags: [Skills]
      summary: Get skills of current user
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Skills list
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/SkillResponse'
        '401': { description: Unauthorized }
    post:
      tags: [Skills]
      summary: Add skill for current user
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/SkillRequest'
      responses:
        '201':
          description: Skill created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SkillResponse'
        '400': { description: Validation failed }
        '401': { description: Unauthorized }
  /api/v1/profile/skills/{skillId}:
    put:
      tags: [Skills]
      summary: Update a skill of current user
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: skillId
          required: true
          schema:
            type: integer
            format: int64
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/SkillRequest'
      responses:
        '200':
          description: Skill updated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SkillResponse'
        '401': { description: Unauthorized }
        '404': { description: Skill not found }
    delete:
      tags: [Skills]
      summary: Delete a skill of current user
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: skillId
          required: true
          schema:
            type: integer
            format: int64
      responses:
        '204': { description: Deleted }
        '401': { description: Unauthorized }
        '404': { description: Skill not found }
  /api/v1/profile/{userId}/skills:
    get:
      tags: [Skills]
      summary: Get public skills of a user
      security: []
      parameters:
        - in: path
          name: userId
          required: true
          schema:
            type: string
            format: uuid
        - in: query
          name: category
          required: false
          schema:
            type: string
      responses:
        '200':
          description: Skills list
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/SkillResponse'
        '404': { description: Profile not found }
  /api/v1/documents/stats:
    get:
      tags: [Documents]
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
      tags: [Documents]
      summary: List documents of current user
      security:
        - bearerAuth: []
      parameters:
        - in: query
          name: category
          required: false
          schema:
            $ref: '#/components/schemas/DocumentCategory'
        - in: query
          name: isFavorite
          required: false
          schema:
            type: boolean
        - in: query
          name: q
          required: false
          schema:
            type: string
          description: Case-insensitive match on title/content/tags
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
      tags: [Documents]
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
      tags: [Documents]
      summary: Get document by ID (owner only)
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: string
            format: uuid
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
      tags: [Documents]
      summary: Update document (owner only)
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: string
            format: uuid
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
      tags: [Documents]
      summary: Delete document (owner only)
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '204': { description: Deleted }
        '401': { description: Unauthorized }
        '404': { description: Document not found }
  /api/v1/documents/{id}/favorite:
    patch:
      tags: [Documents]
      summary: Toggle favorite flag
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: string
            format: uuid
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
  /api/v1/groups:
    post:
      tags: [Groups]
      summary: Create a group (creator becomes LEADER)
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/GroupRequest'
      responses:
        '200':
          description: Group created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/GroupResponse'
        '400': { description: Validation failed }
        '401': { description: Unauthorized }
    get:
      tags: [Groups]
      summary: List groups of current user
      security:
        - bearerAuth: []
      parameters:
        - in: query
          name: role
          required: false
          schema:
            $ref: '#/components/schemas/GroupRole'
      responses:
        '200':
          description: Groups list
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/GroupResponse'
        '401': { description: Unauthorized }
  /api/v1/groups/join:
    post:
      tags: [Groups]
      summary: Join group by code
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/JoinGroupRequest'
      responses:
        '200': { description: Joined }
        '400': { description: Invalid request or already member }
        '401': { description: Unauthorized }
        '404': { description: Group not found }
  /api/v1/groups/{id}/members:
    get:
      tags: [Groups]
      summary: List members of a group (membership required)
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: integer
            format: int64
      responses:
        '200':
          description: Members list
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/GroupMemberResponse'
        '401': { description: Unauthorized }
        '403': { description: Not a member }
        '404': { description: Group not found }
  /api/v1/groups/{id}/members/{userId}:
    delete:
      tags: [Groups]
      summary: Remove a member (leader only)
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: integer
            format: int64
        - in: path
          name: userId
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '204': { description: Removed }
        '401': { description: Unauthorized }
        '403': { description: Forbidden }
        '404': { description: Member not found }
  /api/v1/groups/{id}/members/{userId}/role:
    put:
      tags: [Groups]
      summary: Change member role (leader only)
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: integer
            format: int64
        - in: path
          name: userId
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PromoteMemberRequest'
      responses:
        '200': { description: Updated }
        '401': { description: Unauthorized }
        '403': { description: Forbidden }
        '404': { description: Member not found }
  /api/v1/schedules:
    get:
      tags: [Schedules]
      summary: Get schedule slots of current user in range
      security:
        - bearerAuth: []
      parameters:
        - in: query
          name: from
          required: true
          schema:
            type: string
            format: date-time
        - in: query
          name: to
          required: true
          schema:
            type: string
            format: date-time
      responses:
        '200':
          description: Schedule slots
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/ScheduleResponse'
        '401': { description: Unauthorized }
    post:
      tags: [Schedules]
      summary: Create schedule slot for current user
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ScheduleRequest'
      responses:
        '200':
          description: Created slot
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ScheduleResponse'
        '400': { description: Validation failed }
        '401': { description: Unauthorized }
  /api/v1/schedules/{id}:
    delete:
      tags: [Schedules]
      summary: Delete schedule slot
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: integer
            format: int64
      responses:
        '204': { description: Deleted }
        '401': { description: Unauthorized }
        '403': { description: Forbidden }
        '404': { description: Slot not found }
  /api/v1/performance/summary:
    get:
      tags: [Performance]
      summary: Performance summary of current user
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Summary
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PerformanceSummary'
        '401': { description: Unauthorized }
  /api/v1/performance/semesters:
    get:
      tags: [Performance]
      summary: Semester performance of current user
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Semester breakdown
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/SemesterPerformance'
        '401': { description: Unauthorized }
  /api/v1/performance/skills:
    get:
      tags: [Performance]
      summary: Skills of current user (performance view)
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Skills
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/PerformanceSkill'
        '401': { description: Unauthorized }
  /api/v1/students/{id}:
    get:
      tags: [Students]
      summary: Get student profile
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Student
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Student'
        '401': { description: Unauthorized }
        '404': { description: Student not found }
    put:
      tags: [Students]
      summary: Update student profile
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Student'
      responses:
        '200':
          description: Updated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Student'
        '401': { description: Unauthorized }
        '404': { description: Student not found }
  /api/v1/students/{id}/academic-history:
    get:
      tags: [Students]
      summary: Academic records of a student
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Academic records
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/AcademicRecord'
        '401': { description: Unauthorized }
        '404': { description: Student not found }
  /api/v1/students/{id}/analytics:
    get:
      tags: [Students]
      summary: Learning analytics of a student
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: string
            format: uuid
        - in: query
          name: timeframe
          required: false
          schema:
            type: string
          description: e.g. semester
      responses:
        '200':
          description: Analytics
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/LearningAnalytics'
        '401': { description: Unauthorized }
        '404': { description: Student not found }
  /api/v1/students/{id}/subjects:
    get:
      tags: [Students]
      summary: Current subjects of a student
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Subjects
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/CurrentSubject'
        '401': { description: Unauthorized }
        '404': { description: Student not found }
  /api/v1/students/{id}/subjects/{subjectId}:
    get:
      tags: [Students]
      summary: Subject detail of a student
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: string
            format: uuid
        - in: path
          name: subjectId
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Subject detail
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CurrentSubject'
        '400': { description: Invalid subjectId }
        '401': { description: Unauthorized }
        '404': { description: Not found }
  /api/v1/students/{id}/achievements:
    get:
      tags: [Students]
      summary: Achievements of a student
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Achievements (may be empty while unimplemented)
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Achievement'
        '401': { description: Unauthorized }
        '404': { description: Student not found }
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
        status:
          type: string
          example: UP
        service:
          type: string
          example: user-profile-service
    UserProfileRequest:
      type: object
      properties:
        bio: { type: string, maxLength: 500 }
        timezone: { type: string, maxLength: 50 }
        learningStyle: { type: string, maxLength: 50 }
        avatarUrl: { type: string, maxLength: 512 }
        studentId: { type: string, maxLength: 50 }
        fullName: { type: string, maxLength: 255 }
        phone: { type: string, maxLength: 20 }
        dateOfBirth: { type: string, format: date }
        address: { type: string, maxLength: 500 }
        gender: { type: string, maxLength: 20 }
        classId: { type: string, maxLength: 50 }
        className: { type: string, maxLength: 100 }
        academicYear: { type: string, maxLength: 20 }
        enrollmentDate: { type: string, format: date }
        parentName: { type: string, maxLength: 255 }
        parentPhone: { type: string, maxLength: 20 }
        parentEmail: { type: string, format: email, maxLength: 255 }
        emergencyContact: { type: string, maxLength: 20 }
        bloodType: { type: string, maxLength: 10 }
        medicalNotes: { type: string, maxLength: 2000 }
    UserProfileResponse:
      type: object
      properties:
        id: { type: integer, format: int64 }
        userId: { type: string, format: uuid }
        bio: { type: string }
        timezone: { type: string }
        learningStyle: { type: string }
        avatarUrl: { type: string }
        studentId: { type: string }
        fullName: { type: string }
        phone: { type: string }
        dateOfBirth: { type: string, format: date }
        address: { type: string }
        gender: { type: string }
        classId: { type: string }
        className: { type: string }
        academicYear: { type: string }
        enrollmentDate: { type: string, format: date }
        parentName: { type: string }
        parentPhone: { type: string }
        parentEmail: { type: string, format: email }
        emergencyContact: { type: string }
        bloodType: { type: string }
        medicalNotes: { type: string }
        skills:
          type: array
          items:
            $ref: '#/components/schemas/SkillResponse'
        createdAt: { type: string, format: date-time }
        updatedAt: { type: string, format: date-time }
    SkillRequest:
      type: object
      required: [skillName, level]
      properties:
        skillName: { type: string }
        category: { type: string, description: "TECHNICAL | SOFT_SKILL | LANGUAGE" }
        level:
          type: integer
          minimum: 0
          maximum: 100
        description: { type: string }
    SkillResponse:
      type: object
      properties:
        id: { type: integer, format: int64 }
        skillName: { type: string }
        category: { type: string }
        level: { type: integer }
        description: { type: string }
        createdAt: { type: string, format: date-time }
        updatedAt: { type: string, format: date-time }
    GroupRequest:
      type: object
      required: [name]
      properties:
        name: { type: string, maxLength: 100 }
        description: { type: string, maxLength: 255 }
    GroupResponse:
      type: object
      properties:
        id: { type: integer, format: int64 }
        name: { type: string }
        description: { type: string }
        joinCode: { type: string }
        role: { $ref: '#/components/schemas/GroupRole' }
        memberCount: { type: integer }
    GroupMemberResponse:
      type: object
      properties:
        studentId: { type: string, format: uuid }
        role: { $ref: '#/components/schemas/GroupRole' }
        joinedAt: { type: string, format: date-time }
    GroupRole:
      type: string
      enum: [LEADER, MEMBER]
    JoinGroupRequest:
      type: object
      required: [joinCode]
      properties:
        joinCode: { type: string }
    PromoteMemberRequest:
      type: object
      required: [role]
      properties:
        role: { $ref: '#/components/schemas/GroupRole' }
    ScheduleRequest:
      type: object
      required: [startTime, endTime]
      properties:
        title: { type: string }
        startTime: { type: string, format: date-time }
        endTime: { type: string, format: date-time }
        isRecurring: { type: boolean }
        recurrenceRule: { type: string, description: RFC 5545 RRULE if recurring }
    ScheduleResponse:
      type: object
      properties:
        id: { type: integer, format: int64 }
        title: { type: string }
        startTime: { type: string, format: date-time }
        endTime: { type: string, format: date-time }
        isRecurring: { type: boolean }
        recurrenceRule: { type: string }
    DocumentCategory:
      type: string
      enum: [note, assignment, reference, project]
    DocumentRequest:
      type: object
      required: [title, content, category]
      properties:
        title: { type: string, maxLength: 255 }
        content: { type: string }
        category: { $ref: '#/components/schemas/DocumentCategory' }
        course: { type: string, maxLength: 100 }
        tags:
          type: array
          items: { type: string }
    DocumentResponse:
      type: object
      properties:
        id: { type: string, format: uuid }
        title: { type: string }
        content: { type: string }
        category: { $ref: '#/components/schemas/DocumentCategory' }
        course: { type: string }
        tags:
          type: array
          items: { type: string }
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
    FavoriteToggleRequest:
      type: object
      required: [isFavorite]
      properties:
        isFavorite: { type: boolean }
    PerformanceSummary:
      type: object
      properties:
        overallGpa: { type: number, format: double }
        totalCredits: { type: integer }
        totalAchievements: { type: integer }
        currentRank:
          $ref: '#/components/schemas/PerformanceRank'
    PerformanceRank:
      type: object
      properties:
        rank: { type: integer }
        totalStudents: { type: integer }
    SemesterPerformance:
      type: object
      properties:
        semester: { type: string }
        gpa: { type: number, format: double }
        totalCredits: { type: integer }
        rank: { type: integer }
        totalStudents: { type: integer }
        achievements: { type: integer }
        attendance: { type: number, format: double }
    PerformanceSkill:
      type: object
      properties:
        name: { type: string }
        level: { type: integer }
        category: { type: string }
    Student:
      type: object
      properties:
        id: { type: string }
        studentId: { type: string }
        name: { type: string }
        email: { type: string, format: email }
        phone: { type: string }
        dateOfBirth: { type: string }
        address: { type: string }
        className: { type: string }
        academicYear: { type: string }
        enrollmentDate: { type: string }
        avatar: { type: string }
        emergencyContact: { type: string }
        bloodType: { type: string }
        medicalNotes: { type: string }
        parentName: { type: string }
        parentPhone: { type: string }
        parentEmail: { type: string, format: email }
    AcademicRecord:
      type: object
      properties:
        semester: { type: string }
        gpa: { type: number, format: double }
        totalCredits: { type: integer }
        rank: { type: integer }
        totalStudents: { type: integer }
        subjects:
          type: array
          items:
            $ref: '#/components/schemas/AcademicRecordSubject'
    AcademicRecordSubject:
      type: object
      properties:
        name: { type: string }
        code: { type: string }
        credits: { type: integer }
        grade: { type: string }
        score: { type: number, format: double }
        teacher: { type: string }
    LearningAnalytics:
      type: object
      properties:
        academicProgress: { type: object }
        subjectPerformance:
          type: array
          items: { type: object }
        attendanceRate: { type: number, format: double }
        assignmentCompletion: { type: number, format: double }
        examScores:
          type: array
          items: { type: object }
        learningTime:
          type: array
          items: { type: object }
        strengths:
          type: array
          items: { type: string }
        improvements:
          type: array
          items: { type: string }
    CurrentSubject:
      type: object
      properties:
        id: { type: string }
        name: { type: string }
        code: { type: string }
        teacher: { type: string }
        currentGrade: { type: string }
        currentScore: { type: number, format: double }
        credits: { type: integer }
        attendance: { type: number, format: double }
        assignments:
          $ref: '#/components/schemas/CurrentSubjectAssignments'
        exams:
          $ref: '#/components/schemas/CurrentSubjectExams'
        progress:
          $ref: '#/components/schemas/CurrentSubjectProgress'
        nextAssignment:
          $ref: '#/components/schemas/CurrentSubjectNextAssignment'
        recentActivities:
          type: array
          items: { type: object }
    CurrentSubjectAssignments:
      type: object
      properties:
        total: { type: integer }
        completed: { type: integer }
        avgScore: { type: number, format: double }
    CurrentSubjectExams:
      type: object
      properties:
        midterm: { type: number, format: double }
        finalExam: { type: number, format: double }
        quizzes:
          type: array
          items: { type: number, format: double }
    CurrentSubjectProgress:
      type: object
      properties:
        completed: { type: integer }
        total: { type: integer }
    CurrentSubjectNextAssignment:
      type: object
      properties:
        title: { type: string }
        dueDate: { type: string }
    Achievement:
      type: object
      properties:
        id: { type: string }
        title: { type: string }
        description: { type: string }
        icon: { type: string }
        category: { type: string, description: "academic | attendance | participation" }
        rarity: { type: string, description: "common | uncommon | rare | legendary" }
        isEarned: { type: boolean }
        earnedDate: { type: string }
        progress:
          $ref: '#/components/schemas/AchievementProgress'
    AchievementProgress:
      type: object
      properties:
        current: { type: integer }
        target: { type: integer }
```
