Identity (backend/java-service/identity-service/README.md): Finish lock/unlock user endpoints with RBAC, return JWT with sub UUID + roles; emit USER_REGISTERED with idempotency key; add failed-login lockout policy.
User Profile (backend/java-service/user-profile-service/README.md): Fix auth context (parse JWT sub, roles), add idempotent USER_REGISTERED consumer + GROUP_JOINED publisher, implement group leader/teacher role checks, and update schedule model to timestamptz + recurrence per plan.
Course (backend/java-service/course-service/README.md): Add enrollment CRUD + teacher enrollment list, lesson completion endpoint with prerequisite check and LESSON_COMPLETED event, publish flow emitting COURSE_PUBLISHED, and store progress per student; switch userId parsing to UUID.
Assessment (backend/java-service/assessment-service/README.md): Implement attempt lifecycle (start/submit/result), MCQ auto-grade + manual grade endpoint, emit EXAM_GRADED, enforce one quiz per lesson (examConfig.lessonId) and course/lesson ownership checks for teachers.
Dashboard (backend/java-service/dashboard-service/README.md): Build minimal student dashboard aggregator (course progress, last score, upcoming lesson) with gRPC clients + fallbacks; add instructor at-risk list stub using mock data until real signals are ready.
API Gateway (backend/java-service/api-gateway/README.md): Wire the routes above with auth filter + basic rate limits; ensure propagation of X-User-Id/roles headers.
Cross-cutting (backend/java-service/README.md + plan docs in plan/): Add idempotency middleware for consumers, unify JWT parsing helper, and align Flyway schemas (enrollment/progress, schedule timestamptz, exam lesson mapping) with the plan.
If you want a tight vertical slice first: code Identity register/login + Profile auto-create, Course list/enroll/lesson GET+complete, Assessment start/submit MCQ with score return, Dashboard student summary, and route them via Gateway.

dashboard-service:

Cấu hình issuer-uri, parse userId từ JWT sub (UUID), bỏ random fallback.
Feign clients: chỉnh path khớp API thật (hoặc stub rõ ràng) và thêm timeout/fallback; nếu chưa có upstream, tạm trả dữ liệu rỗng thay vì mock hardcode.
DashboardConsumer: kiểm tra idempotency key/headers, phân biệt rõ EXAM_GRADED vs LESSON_COMPLETED, tránh NPE riskFactors.
Có thể giữ health /health + /actuator/health, role check tối thiểu cho instructor/admin endpoint.
user-profile-service:

Lấy userId từ claim sub (UUID), bỏ random fallback.
Thêm issuer-uri; enforce role cơ bản: Teacher tạo group, Leader promote/remove.
Đồng bộ schedule: schema/API dùng start/end (timestamptz) + recurrenceRule hoặc đổi API cho đúng schema hiện tại.
Emit event profile.group.joined khi join group; validate joinCode.
(Tùy) CRUD learning attributes key/value nếu muốn sát plan.
Health giữ /health + /actuator/health.
///////////////////////////////////////////////////////////////////////////
Chi tiết kế hoạch triển khai course-service

Security & user context

Thêm JWT filter/resolver để lấy sub (UUID/String) -> convert Long khi lưu DB; bỏ @RequestAttribute("userId") và extractUserIdFromAuth kiểu Long.
Cập nhật mọi controller dùng Authentication/Jwt để lấy userId, chuẩn hóa kiểu (UUID/String in code, Long for DB fields).
DB & migration

Tạo Flyway V3__create_enrollments.sql: bảng enrollments theo docs (unique course_id+student_id, progress 0–100, status enum, timestamps, indexes).
Thêm constraint unique code, indexes max_students-related nếu cần; align column types (instructor_id BIGINT).
Verify ddl-auto none; adjust entity if needed for new columns.
DTOs & mapper

Mở rộng CreateCourseRequest/UpdateCourseRequest để nhận code, credits, semester, schedule, maxStudents, startDate, endDate.
Mở rộng CourseResponse để trả các field trên + progress (per current user) + enrolled flag + optional instructor summary (id,name,avatar) + semester, schedule.
Update CourseMapper mapping; add CourseStatsResponse DTO.
Repositories

CourseRepository: filter by semester (findBySemester) and combined filters; ensure search methods support new fields.
EnrollmentRepository: stats queries (count active/completed, avg progress), filter by status, by student/course; maybe findByStudentIdAndCourseId.
Services

CourseService:
Enhance list (GET /courses) to accept semester + enrollmentStatus filter (via enroll repo) and inject per-user progress/enrolled when authenticated student.
getCourseById: include progress/enrolled for current user, attach instructor info via Profile client.
Add getCourseStats using enrollment stats (and placeholder Assessment avg score if needed).
EnrollmentService: ensure business rules (duplicate enroll, maxStudents, drop constraints); getMyEnrollments returns course summary; progress update auto-complete; emit event already wired.
Controllers & routes

Resolve /courses/my-courses conflict: keep STUDENT version in EnrollmentController, move instructor version to /courses/instructor/my-courses or remove.
Update controllers to use new security resolution (no RequestAttribute).
Add endpoint /api/v1/courses/{id}/stats (teacher/admin) and enrich /api/v1/courses/{id} response.
Replace stub CourseProgressController with real data or remove.
Integration clients

Add Profile client (instructor info) and, if required, Assessment client stub for stats; handle failures gracefully (fallback null).
Build validation

Run mvn clean package in backend/java-service/course-service to ensure build passes after changes.

<!-- / -->
Dựa trên việc so sánh giữa docs/specs và code thực tế trong backend/java-service, hiện tại CHƯA ĐỦ API và các trường dữ liệu cần thiết cho MVP.

Dưới đây là danh sách các hạng mục còn thiếu (Gaps) cần bổ sung:

1. Identity Service
Thiếu thông tin trong Login Response:
Spec: API POST /login cần trả về thêm user_id và role để Frontend điều hướng và lưu context.
Thực tế: TokenResponse hiện chỉ có accessToken, refreshToken, expiresIn.
Action: Cần update TokenResponse và logic AuthService.
2. Course Service (Thiếu nhiều nhất)
Thiếu trường dữ liệu (Entity & DTO):
Spec: Course cần có code (Mã môn), credits (Tín chỉ), semester, schedule, maxStudents, startDate, endDate.
Thực tế: CourseResponse hiện tại thiếu toàn bộ các trường này.
Thiếu API Endpoint:
Spec: GET /api/v1/courses/{id}/stats (Thống kê lớp học).
Thực tế: Chưa implement.
3. Dashboard Service
Thiếu dữ liệu cho biểu đồ (Analytics):
Spec: Cần API trả về Exam Scores (Lịch sử điểm theo tháng) và Learning Time.
Thực tế: StudentDashboardResponse mới chỉ có riskProfile và skillRadar, thiếu dữ liệu lịch sử để vẽ biểu đồ line/bar chart.
4. Assessment Service
Skill Controller là Dummy:
Thực tế: SkillController đang trả về dữ liệu cứng (hardcoded map), chưa có logic tính toán thực tế từ bài làm hoặc Profile.
Gradebook Entity:
Cần đảm bảo Gradebook entity đã có các trường gpa, status để map sang GradebookSummaryResponse (DTO này đã có, nhưng cần check logic service).
Đề xuất kế hoạch tiếp theo:
Bạn có muốn tôi thực hiện fix theo thứ tự ưu tiên nào không?

Identity Service: Update TokenResponse (Nhanh, impact cao cho FE).
Course Service: Bổ sung fields và migration DB (Cần thiết để hiển thị đúng thông tin khóa học).
Dashboard/Assessment: Implement logic Analytics và Skill thật.