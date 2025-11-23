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
        - id: course-service
          uri: lb://COURSE-SERVICE
          predicates:
            - Path=/api/v1/courses/**
          filters:
            - AuthenticationFilter
            - name: RequestRateLimiter
              args:
                redis-rate-limiter.replenishRate: 10
                redis-rate-limiter.burstCapacity: 20

        - id: assessment-service
          uri: lb://ASSESSMENT-SERVICE
          predicates:
            - Path=/api/v1/assessments/**
          filters:
            - AuthenticationFilter
```

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
- **`ROLE_STUDENT`**: Read Courses, Submit Exams, View Own Profile.
- **`ROLE_INSTRUCTOR`**: Create Courses, Grade Exams, View Class Analytics.
- **`ROLE_ADMIN`**: Manage Users, System Config.

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
