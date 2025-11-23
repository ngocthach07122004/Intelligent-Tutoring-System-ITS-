# Course Service - Implementation Summary

## 📁 Project Structure

```
course-service/
├── src/main/java/ITS/com/vn/course_service/
│   ├── CourseServiceApplication.java          # Main application class with @EnableDiscoveryClient
│   │
│   ├── config/                                 # Configuration Layer
│   │   └── SecurityConfig.java                # JWT OAuth2 security configuration
│   │
│   ├── controller/                             # REST API Controllers
│   │   ├── CourseController.java              # Course CRUD endpoints
│   │   ├── ChapterController.java             # Chapter CRUD endpoints
│   │   ├── LessonController.java              # Lesson CRUD endpoints
│   │   └── HealthController.java              # Health check endpoints
│   │
│   ├── service/                                # Business Logic Layer (SRP)
│   │   ├── CourseService.java                 # Course business logic
│   │   ├── ChapterService.java                # Chapter business logic
│   │   └── LessonService.java                 # Lesson business logic
│   │
│   ├── repository/                             # Data Access Layer
│   │   ├── CourseRepository.java              # Course data access with custom queries
│   │   ├── ChapterRepository.java             # Chapter data access
│   │   ├── LessonRepository.java              # Lesson data access
│   │   ├── TagRepository.java                 # Tag data access
│   │   └── AssignmentRepository.java          # Assignment data access
│   │
│   ├── domain/                                 # Domain Layer (DDD)
│   │   ├── entity/                            # JPA Entities
│   │   │   ├── Course.java                    # Course aggregate root
│   │   │   ├── CourseVersion.java             # Version management
│   │   │   ├── Chapter.java                   # Chapter entity
│   │   │   ├── Lesson.java                    # Lesson entity
│   │   │   ├── AssetMetadata.java             # Asset storage metadata
│   │   │   ├── Assignment.java                # Assignment entity
│   │   │   ├── AdaptiveRule.java              # Adaptive learning rules
│   │   │   ├── Tag.java                       # Tag entity
│   │   │   ├── CourseTag.java                 # Course-Tag junction
│   │   │   └── Prerequisite.java              # Course prerequisites
│   │   │
│   │   └── enums/                             # Domain Enumerations
│   │       ├── CourseStatus.java              # DRAFT, PUBLISHED, ARCHIVED
│   │       ├── CourseVisibility.java          # PUBLIC, PRIVATE
│   │       ├── VersionStatus.java             # DRAFT, REVIEW, PUBLISHED, ARCHIVED
│   │       ├── LessonType.java                # VIDEO, TEXT, QUIZ
│   │       ├── AssignmentType.java            # PROJECT, UPLOAD
│   │       ├── TagType.java                   # TOPIC, SKILL, DIFFICULTY
│   │       └── PrerequisiteType.java          # HARD, SOFT
│   │
│   ├── dto/                                    # Data Transfer Objects
│   │   ├── request/                           # Request DTOs with validation
│   │   │   ├── CreateCourseRequest.java
│   │   │   ├── UpdateCourseRequest.java
│   │   │   ├── CreateChapterRequest.java
│   │   │   ├── CreateLessonRequest.java
│   │   │   └── ReorderChaptersRequest.java
│   │   │
│   │   └── response/                          # Response DTOs
│   │       ├── CourseResponse.java
│   │       ├── ChapterResponse.java
│   │       ├── LessonResponse.java
│   │       ├── TagResponse.java
│   │       └── PrerequisiteResponse.java
│   │
│   ├── mapper/                                 # MapStruct Mappers
│   │   └── CourseMapper.java                  # Entity-DTO conversions
│   │
│   └── exception/                              # Exception Handling
│       ├── GlobalExceptionHandler.java        # Centralized error handling
│       ├── ResourceNotFoundException.java     # 404 errors
│       ├── UnauthorizedException.java         # 403 errors
│       ├── BadRequestException.java           # 400 errors
│       └── ErrorResponse.java                 # Standardized error response
│
└── src/main/resources/
    ├── application.yaml                        # Application configuration
    └── db/migration/                           # Flyway migrations
        ├── V1__init_course_schema.sql         # Initial schema (legacy)
        └── V2__update_course_schema.sql       # Updated schema matching entities
```

## 🎯 SOLID Principles Applied

### 1. **Single Responsibility Principle (SRP)**
- Each service class handles only one domain concept:
  - `CourseService` → Course management
  - `ChapterService` → Chapter management
  - `LessonService` → Lesson management
- Controllers only handle HTTP concerns
- Repositories only handle data access

### 2. **Open/Closed Principle (OCP)**
- Strategy Pattern ready for content handlers (VideoHandler, QuizHandler, TextHandler)
- Specification Pattern for adaptive rules
- Easy to extend with new lesson types or tag types via enums

### 3. **Liskov Substitution Principle (LSP)**
- All entities properly extend base JPA entity behavior
- DTOs are properly mapped without breaking contracts

### 4. **Interface Segregation Principle (ISP)**
- Repositories expose only needed methods
- DTOs are segregated (Request vs Response)
- Separate interfaces for different concerns

### 5. **Dependency Inversion Principle (DIP)**
- Services depend on repository interfaces (Spring Data JPA)
- Controllers depend on service abstractions
- Configuration is externalized

## 🏗️ Design Patterns

### 1. **Repository Pattern**
- Clean separation between business logic and data access
- Custom queries in repositories for complex operations

### 2. **DTO Pattern**
- Separate request/response objects
- Validation at DTO level using Jakarta Validation

### 3. **Mapper Pattern**
- MapStruct for clean entity-DTO conversions
- Avoids manual mapping boilerplate

### 4. **Builder Pattern**
- Lombok `@Builder` on entities and DTOs
- Fluent object creation

### 5. **Strategy Pattern (Planned)**
- Ready for content type handlers
- Adaptive rule specifications

## 🔐 Security

- **OAuth2 Resource Server** with JWT authentication
- **Keycloak** integration for identity management
- **Role-based access control** via JWT claims
- **Authorization checks** in service layer (instructor ownership)

## 📊 Database Schema

### Core Tables
- `courses` - Course aggregate root
- `course_versions` - Version management
- `chapters` - Course structure
- `lessons` - Learning content
- `asset_metadata` - File/video storage metadata
- `assignments` - Student assignments
- `adaptive_rules` - Adaptive learning paths
- `tags` - Content categorization
- `course_tags` - Many-to-many relationship
- `prerequisites` - Course dependencies

### Key Features
- **Cascade deletes** for referential integrity
- **Check constraints** for data validation
- **Indexes** for query performance
- **JSONB** for flexible configuration storage

## 🚀 API Endpoints

### Course Management
- `POST /api/v1/courses` - Create course
- `GET /api/v1/courses/{id}` - Get course
- `GET /api/v1/courses` - List courses (paginated)
- `GET /api/v1/courses/my-courses` - Get instructor's courses
- `GET /api/v1/courses/published` - Get published courses
- `GET /api/v1/courses/search?keyword=java` - Search courses
- `PUT /api/v1/courses/{id}` - Update course
- `POST /api/v1/courses/{id}/publish` - Publish course
- `POST /api/v1/courses/{id}/archive` - Archive course
- `DELETE /api/v1/courses/{id}` - Delete course (DRAFT only)

### Chapter Management
- `POST /api/v1/courses/{courseId}/chapters` - Create chapter
- `GET /api/v1/courses/{courseId}/chapters` - List chapters
- `GET /api/v1/courses/{courseId}/chapters/{id}` - Get chapter
- `PUT /api/v1/courses/{courseId}/chapters/{id}` - Update chapter
- `PUT /api/v1/courses/{courseId}/chapters/reorder` - Reorder chapters
- `DELETE /api/v1/courses/{courseId}/chapters/{id}` - Delete chapter

### Lesson Management
- `POST /api/v1/chapters/{chapterId}/lessons` - Create lesson
- `GET /api/v1/chapters/{chapterId}/lessons` - List lessons
- `GET /api/v1/chapters/{chapterId}/lessons/{id}` - Get lesson
- `PUT /api/v1/chapters/{chapterId}/lessons/{id}` - Update lesson
- `DELETE /api/v1/chapters/{chapterId}/lessons/{id}` - Delete lesson

### Health Checks
- `GET /api/v1/health` - Basic health check
- `GET /api/v1/health/ready` - Readiness probe
- `GET /api/v1/health/live` - Liveness probe

## 🔧 Configuration

### Environment Variables
```yaml
# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5436/courseDb
SPRING_DATASOURCE_USERNAME=courseUser
SPRING_DATASOURCE_PASSWORD=12345678

# Security
JWT_ISSUER_URI=http://localhost:8080/realms/ITS
JWT_JWK_SET_URI=http://localhost:8080/realms/ITS/protocol/openid-connect/certs

# RabbitMQ
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USERNAME=guest
RABBITMQ_PASSWORD=guest

# Eureka
EUREKA_SERVER=http://localhost:8761/eureka/

# Server
SERVER_PORT=8084
```

## ✅ Features Implemented

- ✅ **Complete CRUD** for Courses, Chapters, Lessons
- ✅ **Health Check** endpoints (ready, live, health)
- ✅ **JWT Authentication** with OAuth2
- ✅ **Authorization** checks (instructor ownership)
- ✅ **Pagination** support
- ✅ **Search** functionality
- ✅ **Validation** using Jakarta Validation
- ✅ **Exception Handling** with GlobalExceptionHandler
- ✅ **Database Migration** with Flyway
- ✅ **Service Discovery** with Eureka
- ✅ **Logging** with SLF4J
- ✅ **Actuator** endpoints for monitoring
- ✅ **Clean Architecture** with proper layering
- ✅ **SOLID Principles** throughout
- ✅ **MapStruct** for DTO mapping

## 📝 TODO / Future Enhancements

- [ ] RabbitMQ event publishing (COURSE_PUBLISHED, LESSON_COMPLETED, etc.)
- [ ] gRPC service implementation for inter-service communication
- [ ] File upload handling for assets (MinIO/S3 integration)
- [ ] Progress tracking integration
- [ ] Adaptive learning rule engine
- [ ] Unit tests
- [ ] Integration tests
- [ ] API documentation (Swagger/OpenAPI)

## 🧪 Testing

To test the service:

1. **Start dependencies**: PostgreSQL, Eureka, Keycloak
2. **Run migrations**: Flyway will auto-migrate on startup
3. **Start service**: `mvn spring-boot:run`
4. **Health check**: `curl http://localhost:8084/api/v1/health`
5. **Get JWT token** from Keycloak
6. **Test endpoints** with Bearer token

## 📚 References

- [Big Plan](../../../big_plan.md) - Overall MVP implementation plan
- [Course Service README](./README.md) - Detailed service documentation
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [MapStruct Documentation](https://mapstruct.org/)
