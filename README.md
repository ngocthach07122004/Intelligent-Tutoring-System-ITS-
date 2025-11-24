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