# API Gateway
 
 ## 🌐 Overview
 The **API Gateway** serves as the single entry point for all client requests in the ITS microservices ecosystem. It handles routing, load balancing, and centralized cross-cutting concerns such as security and monitoring.
 
 ## 🏗 Architecture & Design
This service is built on **Spring Cloud Gateway**, which uses a non-blocking, reactive architecture (Netty + WebFlux).

### Security & Operational Features
- **Authentication**: Validates JWT via Identity Service (JWK Set URI).
- **CORS**: Configured globally to allow requests from frontend domains (e.g., `http://localhost:3000`).
- **Rate Limiting**: Uses Redis Rate Limiter to prevent abuse (e.g., 100 req/min per user).
- **Observability**:
    - **Tracing**: Adds `X-B3-TraceId` headers for distributed tracing (Zipkin).
    - **Metrics**: Exposes `/actuator/prometheus` for monitoring traffic and latency.

### Non-Functional Requirements (Global)
- **Idempotency**:
    - **Scope**: All `POST/PUT` requests and RabbitMQ consumers.
    - **Header**: `X-Idempotency-Key` (UUID).
    - **Storage**: Redis `idempotency:{key}` (TTL: 24h).
- **Rate Limiting (Default)**:
    - **Public**: 10 req/min (IP-based).
    - **Authenticated**: 100 req/min (User-based).

### SOLID Principles Application
- **SRP**: Custom Filters (e.g., `AuthenticationFilter`) have a single responsibility: validating tokens. They do not handle routing logic.
 - **OCP**: New routes can be added via configuration (`application.yaml`) without modifying the Java code.
 
 ## 🔗 Service Dependencies
 - **Discovery Server**: To locate other services.
 - **Identity Service**: To validate JWT tokens (acting as a Resource Server).

## 🛠 Tech Stack
- **Framework**: Spring Cloud Gateway (WebFlux)
- **Discovery**: Netflix Eureka Client
- **Security**: Spring Security (OAuth2 Resource Server)

### Route Configuration Examples (`application.yaml`)
```yaml
spring:
  cloud:
    gateway:
      routes:
        # Identity Service Routes
        - id: auth-public
          uri: lb://IDENTITY-SERVICE
          predicates:
            - Path=/api/v1/auth/**
          filters:
            - name: RequestRateLimiter
              args:
                redis-rate-limiter.replenishRate: 10  # Public: 10 req/min
                redis-rate-limiter.burstCapacity: 20
                key-resolver: "#{@ipKeyResolver}"

        - id: users-admin
          uri: lb://IDENTITY-SERVICE
          predicates:
            - Path=/api/v1/users/**
          filters:
            - AuthenticationFilter
            - RoleFilter(ADMIN)
            - name: RequestRateLimiter
              args:
                redis-rate-limiter.replenishRate: 100  # Authenticated: 100 req/min
                redis-rate-limiter.burstCapacity: 150

        # Course Service Routes
        - id: course-service
          uri: lb://COURSE-SERVICE
          predicates:
            - Path=/api/v1/courses/**, /api/v1/lessons/**, /api/v1/chapters/**
          filters:
            - AuthenticationFilter
            - name: RequestRateLimiter
              args:
                redis-rate-limiter.replenishRate: 100
                redis-rate-limiter.burstCapacity: 150

        # Assessment Service Routes
        - id: assessment-service
          uri: lb://ASSESSMENT-SERVICE
          predicates:
            - Path=/api/v1/exams/**, /api/v1/attempts/**, /api/v1/gradebook/**
          filters:
            - AuthenticationFilter
            - name: RequestRateLimiter
              args:
                redis-rate-limiter.replenishRate: 100
                redis-rate-limiter.burstCapacity: 150

        # User Profile Service Routes
        - id: profile-service
          uri: lb://USER-PROFILE-SERVICE
          predicates:
            - Path=/api/v1/profiles/**, /api/v1/schedules/**, /api/v1/groups/**
          filters:
            - AuthenticationFilter
            - name: RequestRateLimiter
              args:
                redis-rate-limiter.replenishRate: 100
                redis-rate-limiter.burstCapacity: 150

        # Dashboard Service Routes
        - id: dashboard-service
          uri: lb://DASHBOARD-SERVICE
          predicates:
            - Path=/api/v1/dashboard/**
          filters:
            - AuthenticationFilter
            - name: RequestRateLimiter
              args:
                redis-rate-limiter.replenishRate: 50  # Lower for aggregation
                redis-rate-limiter.burstCapacity: 75
```

### Route Matrix & Rate Limiting

| Route Pattern | Target Service | Auth Required | Rate Limit (req/min) | Key Resolver |
|:--------------|:---------------|:--------------|:---------------------|:-------------|
| `/api/v1/auth/**` | Identity | No | 10 | IP-based |
| `/api/v1/users/**` | Identity | Yes (ADMIN) | 100 | User-based |
| `/api/v1/courses/**` | Course | Yes | 100 | User-based |
| `/api/v1/lessons/**` | Course | Yes | 100 | User-based |
| `/api/v1/chapters/**` | Course | Yes | 100 | User-based |
| `/api/v1/exams/**` | Assessment | Yes | 100 | User-based |
| `/api/v1/attempts/**` | Assessment | Yes | 100 | User-based |
| `/api/v1/gradebook/**` | Assessment | Yes | 100 | User-based |
| `/api/v1/profiles/**` | User Profile | Yes | 100 | User-based |
| `/api/v1/schedules/**` | User Profile | Yes | 100 | User-based |
| `/api/v1/groups/**` | User Profile | Yes | 100 | User-based |
| `/api/v1/dashboard/**` | Dashboard | Yes | 50 | User-based |

### Complete CRUD Endpoint Mapping

This table maps all CRUD endpoints to their target services, required roles, and operations:

#### Identity Service
| Method | Endpoint | Target Service | Operation | Min Role | Rate Limit |
|:-------|:---------|:---------------|:----------|:---------|:-----------|
| POST | `/api/v1/auth/register` | Identity | Create User | PUBLIC | 10/min |
| POST | `/api/v1/auth/login` | Identity | Authenticate | PUBLIC | 10/min |
| POST | `/api/v1/auth/refresh` | Identity | Refresh Token | PUBLIC | 10/min |
| POST | `/api/v1/auth/logout` | Identity | Logout | AUTHENTICATED | 10/min |
| POST | `/api/v1/auth/forgot-password` | Identity | Request Reset | PUBLIC | 10/min |
| POST | `/api/v1/auth/reset-password` | Identity | Reset Password | PUBLIC | 10/min |
| POST | `/api/v1/auth/verify-email` | Identity | Verify Email | PUBLIC | 10/min |
| GET | `/api/v1/users` | Identity | List Users | ADMIN | 100/min |
| PUT | `/api/v1/users/{id}/lock` | Identity | Lock Account | ADMIN | 100/min |
| PUT | `/api/v1/users/{id}/unlock` | Identity | Unlock Account | ADMIN | 100/min |

#### Course Service
| Method | Endpoint | Target Service | Operation | Min Role | Rate Limit |
|:-------|:---------|:---------------|:----------|:---------|:-----------|
| GET | `/api/v1/courses` | Course | List Courses | PUBLIC | 100/min |
| GET | `/api/v1/courses/{id}` | Course | Get Course | PUBLIC | 100/min |
| POST | `/api/v1/courses` | Course | Create Draft | TEACHER | 100/min |
| PUT | `/api/v1/courses/{id}/status` | Course | Publish/Archive | TEACHER (Owner) | 100/min |
| POST | `/api/v1/courses/{id}/enroll` | Course | Enroll | STUDENT | 100/min |
| DELETE | `/api/v1/courses/{id}/enroll` | Course | Unenroll | STUDENT | 100/min |
| GET | `/api/v1/courses/{id}/enrollments` | Course | List Enrollments | TEACHER (Owner) | 100/min |
| POST | `/api/v1/courses/{id}/chapters` | Course | Create Chapter | TEACHER (Owner) | 100/min |
| PUT | `/api/v1/courses/{id}/chapters/reorder` | Course | Reorder Chapters | TEACHER (Owner) | 100/min |
| GET | `/api/v1/lessons/{id}` | Course | Get Lesson | ENROLLED | 100/min |
| POST | `/api/v1/lessons` | Course | Create Lesson | TEACHER | 100/min |
| POST | `/api/v1/lessons/{id}/complete` | Course | Complete Lesson | ENROLLED | 100/min |
| PUT | `/api/v1/lessons/{id}/prerequisites` | Course | Set Prerequisites | TEACHER (Owner) | 100/min |
| POST | `/api/v1/assignments` | Course | Create Assignment | TEACHER | 100/min |

#### Assessment Service
| Method | Endpoint | Target Service | Operation | Min Role | Rate Limit |
|:-------|:---------|:---------------|:----------|:---------|:-----------|
| POST | `/api/v1/pools` | Assessment | Create Pool | TEACHER | 100/min |
| POST | `/api/v1/questions` | Assessment | Add Question | TEACHER | 100/min |
| POST | `/api/v1/exams` | Assessment | Create Exam | TEACHER | 100/min |
| POST | `/api/v1/exams/{id}/start` | Assessment | Start Attempt | STUDENT | 100/min |
| POST | `/api/v1/attempts/{id}/submit` | Assessment | Submit Attempt | STUDENT (Owner) | 100/min |
| GET | `/api/v1/attempts/{id}/result` | Assessment | Get Result | STUDENT (Owner) | 100/min |
| PUT | `/api/v1/attempts/{id}/grade` | Assessment | Manual Grade | TEACHER (Owner) | 100/min |
| POST | `/api/v1/attempts/{id}/cancel` | Assessment | Cancel Attempt | TEACHER (Owner) | 100/min |
| GET | `/api/v1/gradebook/courses/{courseId}` | Assessment | View Gradebook | TEACHER (Owner) | 100/min |

#### User Profile Service
| Method | Endpoint | Target Service | Operation | Min Role | Rate Limit |
|:-------|:---------|:---------------|:----------|:---------|:-----------|
| GET | `/api/v1/profiles/me` | User Profile | Get Own Profile | AUTHENTICATED | 100/min |
| PUT | `/api/v1/profiles/me` | User Profile | Update Profile | AUTHENTICATED | 100/min |
| GET | `/api/v1/profiles/{userId}` | User Profile | Get Public Profile | AUTHENTICATED | 100/min |
| GET | `/api/v1/schedules` | User Profile | List Schedules | STUDENT | 100/min |
| POST | `/api/v1/schedules` | User Profile | Create Schedule | STUDENT | 100/min |
| DELETE | `/api/v1/schedules/{id}` | User Profile | Delete Schedule | STUDENT (Owner) | 100/min |
| POST | `/api/v1/groups` | User Profile | Create Group | TEACHER | 100/min |
| POST | `/api/v1/groups/join` | User Profile | Join Group | STUDENT | 100/min |
| GET | `/api/v1/groups` | User Profile | List My Groups | AUTHENTICATED | 100/min |
| GET | `/api/v1/groups/{id}/members` | User Profile | List Members | MEMBER | 100/min |
| DELETE | `/api/v1/groups/{id}/members/{userId}` | User Profile | Remove Member | LEADER | 100/min |
| PUT | `/api/v1/groups/{id}/members/{userId}/role` | User Profile | Promote/Demote | LEADER | 100/min |

#### Dashboard Service
| Method | Endpoint | Target Service | Operation | Min Role | Rate Limit |
|:-------|:---------|:---------------|:----------|:---------|:-----------|
| GET | `/api/v1/dashboard/student` | Dashboard | Student Dashboard | STUDENT | 50/min |
| GET | `/api/v1/dashboard/instructor/courses/{id}` | Dashboard | Course Stats | TEACHER (Owner) | 50/min |
| GET | `/api/v1/dashboard/instructor/at-risk` | Dashboard | At-Risk List | TEACHER | 50/min |
| GET | `/api/v1/dashboard/admin/stats` | Dashboard | System Stats | ADMIN | 50/min |

### Circuit Breaker & Fallback (Resilience4j)
- **Configuration**:
    - **Failure Rate Threshold**: 50%
    - **Wait Duration**: 5s (Open State)
    - **Fallback URI**: `forward:/fallback/service-unavailable`
- **Example**: If `course-service` is down, the Gateway returns a cached or default response instead of 503.

### Header Propagation (Observability & Context)
The Gateway **MUST** inject/forward these headers:
- `X-Correlation-Id`: Unique Request ID (Zipkin/Sleuth).
- `X-User-Id`: From JWT `sub`.
- `X-User-Roles`: From JWT `realm_access.roles`.
- `Authorization`: Bearer Token.

### RBAC Enforcement Policies
- **`ROLE_STUDENT`**:
    - Read Courses, Lessons, Assignments.
    - Submit Exams, View Own Grades.
    - Manage Own Profile/Schedule.
- **`ROLE_INSTRUCTOR`**:
    - Create/Edit/Publish Courses (Own).
    - Create Exams, Grade Submissions.
    - View Course Enrollments & Analytics.
- **`ROLE_ADMIN`**:
    - Manage Users (Lock/Unlock).
    - View System Logs.
    - Global Content Access.

## ⚙️ Configuration
| Property | Description | Default |
|----------|-------------|---------|
| `server.port` | Port for the gateway | `8888` |
| `spring.cloud.gateway.routes` | Route definitions | Configured in `application.yaml` |
| `eureka.client.service-url.defaultZone` | Eureka Server URL | `http://localhost:8761/eureka` |

## 🚀 How to Run
```bash
mvn spring-boot:run
```
