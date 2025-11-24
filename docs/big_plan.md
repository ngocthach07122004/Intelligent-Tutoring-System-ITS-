# ITS Backend Implementation Plan (MVP)

## 1) Foundation & Infrastructure
- Standardize local env: Docker Compose for Postgres, Redis, RabbitMQ, MinIO, Keycloak; shared `.env` templates per service.
- Observability baseline: enable Actuator, Prometheus, Zipkin headers; health/readiness endpoints; log correlation IDs from Gateway.
- CI sanity: run unit tests + lint per service; build images for core services.

## 2) Identity Service
- Implement register/login/refresh; integrate Keycloak adapter; expose JWT with roles/permissions.
- Password reset + email verify flows using Redis token store; emit `identity.user.registered`, `identity.password.reset`.
- Enforce lockout/brute-force (Keycloak settings); audit logging for auth events.

## 3) Profile Service
- Auto-create profile on `identity.user.registered`; CRUD profile + learning attributes.
- Schedule with timezone + RRULE; group/class join via code; emit `profile.group.joined`.
- Enforce group permissions (leader/member) on actions; expose gRPC for goals/profile basics.

## 4) Course Service
- CRUD course/chapter/lesson with version lifecycle (draft/review/published/archived).
- Manage tags/prerequisites, asset metadata (MinIO/S3), assignments (upload/project) with due dates.
- Adaptive rules/mastery thresholds (80/95) to gate remediation/challenge; emit `course.content.published`, `course.lesson.completed`, `course.assignment.created`.
- Expose gRPC for course structure/progress.

## 5) Assessment Service
- Question pools + exam config (section rules, randomization, time limit).
- Grading engine: chain for MCQ/coding (Judge0 placeholder), rubric/manual flag for essay; partial credit by test-case/rubric.
- Attempt lifecycle (IN_PROGRESS → SUBMITTED → UNDER_REVIEW? → GRADED); persist gradebook; emit `assessment.exam.graded`.
- Expose gRPC for skill mastery and scores.

## 6) Notification/Gamification (Go integration)
- Ensure RabbitMQ bindings match catalog; Go consumers handle welcome/OTP/course published/assignment due/lesson completed/exam graded.
- Idempotency (Redis key), retries/DLX, per-entity ordering via routing keys.

## 7) Dashboard Service
- Aggregate via gRPC (course progress, skill mastery, goals); cache as needed.
- Compute KPI/at-risk per acceptance criteria; expose REST to frontend.

## 8) API Gateway
- Configure routes + auth filter, RBAC policies, rate limit, circuit breaker/fallback; propagate trace/user headers.

## 9) Testing & Rollout
- Unit tests for service layers; contract tests for gRPC/proto; mock RabbitMQ in integration tests where feasible.
- E2E smoke via docker-compose: start infra + core services, run key flows (register → profile init → publish course → enroll → complete lesson → exam graded → notifications).*** End Patch with apply_patch tool code uuid 213dac81-2e27-4f9c-9f07-53fc245a33fc ***!
