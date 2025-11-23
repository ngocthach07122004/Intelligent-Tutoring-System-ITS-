# User Profile Service
Chưa xong CRUD theo use case MVP. user-profile-service có skeleton controller/service/entity cho profile/schedule/group và consumer USER_REGISTERED, nhưng còn thiếu nhiều phần quan trọng:

Profile: Có GET/PUT me và GET by userId; không có các trường học/attr nâng cao (learning attributes) CRUD, không có avatar upload, không có validation timezone/learningStyle ngoài basic, và createProfile chỉ dùng khi event tới, không có idempotency via Redis hoặc event header check.
Schedule: Chỉ có create/list/delete, nhưng model/migration dùng day_of_week + start_time kiểu TIME (không theo plan dùng Instant range + recurrence RFC 5545). Không có update slot, không validate timezone từ JWT, không hỗ trợ recurrence rule đúng chuẩn. Param list schedule yêu cầu from/to nhưng repo truy vấn start_time TIME -> sai với Instant.
Group: Có create/join/list/members/remove/promote, nhưng:
Không kiểm tra role Teacher/Leader qua security/annotations; chỉ comment “should be done”.
Không phát sự kiện profile.group.joined tới course-service (TODO comment).
Không kiểm tra owner/leader khi đọc members ngoài membership check; không có phân quyền Leader vs Member ở controller.
Không có join code expiry/format, join code 8 char random không lưu TTL.
Security/User context: Lấy userId từ Authentication.getName() parse UUID với fallback random (UserProfileServiceImpl, ScheduleServiceImpl, GroupServiceImpl) → sai user context, không parse từ JWT sub, không validate role. Không có GlobalException mapping cho 401/403 theo spec.
DB schema: Migration V1 dùng day_of_week + TIME, khác plan (start/end timestamptz, recurrence_rule RFC5545). Không có bảng audit_logs, không có group permissions min role logic (chỉ table group_permission không dùng). Learning_attribute schema khác plan (chỉ weak/strengths, thiếu key/value). Không có indices cho user_id in schedule/group_member, cũng không có constraints for role values.
Event consumption: consumer nhận Map, không kiểm tra idempotency, không handle correlation headers.
Health/actuator: /health controller có, actuator config chưa kiểm tra; Security cho phép /api/v1/** authenticated nhưng không cấu hình issuer-uri.
Kết luận: user-profile-service chưa hoàn thiện CRUD/flow theo MVP; cần bổ sung/điều chỉnh schedule schema/logic, group permission + event emit, chuẩn hóa userId từ JWT, xử lý learning attributes, và align migration/validation với plan.

## 👤 Overview
The **User Profile Service** manages extended user information, learning preferences, and educational background. It serves as the central repository for student and teacher profiles.

> **📋 API Specification**: For detailed endpoint specifications, request/response examples, and validation rules, see [User Profile Service API Plan](../../../plan/user-profile-service-api.md).

## 🏗 Architecture & Design
This service follows a **Layered Architecture** (Controller -> Service -> Repository).

### Design Patterns & SOLID

#### 1. Builder Pattern (Profile Creation)
*Problem*: User profiles have many optional fields (social links, preferences, attributes).
*Solution*: Use Lombok's `@Builder` or a custom Builder to construct objects cleanly.
```java
UserProfile profile = UserProfile.builder()
    .userId("123")
    .educationLevel("Undergraduate")
    .addInterest("Java")
    .addInterest("AI")
    .notificationSetting(email, true)
    .build();
```

#### 2. DTO Projection (Repository Pattern)
*Problem*: We often need only a subset of data (e.g., "Student Name + Avatar") for lists, not the full profile.
*Solution*: Use Spring Data Projections or DTOs to fetch only necessary fields.

### Entity Relationship Diagram (ERD)
Reflecting **Schedules**, **Diagnostics**, and **Group Permissions**.

```mermaid
erDiagram
    USER_PROFILE {
        Long id PK
        String userId FK
        String bio
        String timezone "Asia/Ho_Chi_Minh"
        String avatarUrl
    }
    LEARNING_ATTRIBUTE {
        Long id PK
        Long profileId FK
        String learningStyle "VISUAL, AUDITORY"
        String weakTopics "Recursion, DP"
    }
    USER_SCHEDULE {
        Long id PK
        Long profileId FK
        String dayOfWeek "MONDAY"
        Time startTime
        Time endTime
        Boolean isRecurring
        String recurrenceRule "RRULE:FREQ=WEEKLY;BYDAY=MO,WE,FR"
        String timezone "Asia/Ho_Chi_Minh"
    }
    CLASS_GROUP {
        Long id PK
        String name
        String description
        Long creatorId
        String joinCode
    }
    GROUP_MEMBER {
        Long id PK
        Long groupId FK
        Long studentId
        String role "LEADER, MEMBER"
        DateTime joinedAt
    }
    GROUP_PERMISSION {
        Long id PK
        Long groupId FK
        String permission "VIEW_ANALYTICS, EDIT_SETTINGS"
        String minRole "LEADER"
    }
    
    USER_PROFILE ||--o{ LEARNING_ATTRIBUTE : has
    USER_PROFILE ||--o{ USER_SCHEDULE : defines
    CLASS_GROUP ||--o{ GROUP_MEMBER : contains
    CLASS_GROUP ||--o{ GROUP_PERMISSION : enforces
```

### RabbitMQ Bindings & Events
| Event | Exchange | Routing Key | Queue (Consumer) | DLX/DLQ |
|-------|----------|-------------|------------------|---------|
| `GROUP_JOINED` | `its.topic.exchange` | `profile.group.joined` | `q.course.enrollment` (Java) | `its.dlx.exchange` -> `q.dlx.all` |
| `USER_REGISTERED` (Consume) | `its.topic.exchange` | `identity.user.registered` | `q.profile.create` (Java) | `its.dlx.exchange` -> `q.dlx.all` |

### Acceptance Criteria & Flows
- **Profile Creation**:
    - Trigger: `USER_REGISTERED` event.
    - **Success**: `UserProfile` entity exists in DB with matching `userId`.
- **Group Joining**:
    - User enters `joinCode` -> `GROUP_MEMBER` created -> `GROUP_JOINED` event published.
    - **Success**: User appears in Group Member list; Course Service auto-enrolls user.
- **Schedule Management**:
    - User saves schedule in `Asia/Ho_Chi_Minh`.
    - **Verify**: API returns times correctly converted from UTC storage.

### Group Permissions (MinRole)
- `VIEW_ANALYTICS`: Requires `LEADER` or `TEACHER`.
- `EDIT_SETTINGS`: Requires `LEADER`.
- `POST_ANNOUNCEMENT`: Requires `MEMBER` (if allowed) or `LEADER`.

### API Specifications & Rules

#### 1. Profile Management
- **Endpoint**: `GET /api/v1/profiles/me`
- **Endpoint**: `PUT /api/v1/profiles/me`
    - **Payload**: `{ "bio": "...", "timezone": "Asia/Ho_Chi_Minh", "learningStyle": "VISUAL" }`
    - **Validation**: `timezone` must be valid ZoneId.

#### 2. Schedule Management
- **Endpoint**: `GET /api/v1/schedules`
- **Endpoint**: `POST /api/v1/schedules`
    - **Payload**: `{ "startTime": "...", "endTime": "...", "recurrenceRule": "FREQ=WEEKLY;..." }`
    - **Validation**: `recurrenceRule` must follow RFC 5545.

#### 3. Group Management
- **Endpoints**:
    - `POST /api/v1/groups`: Create Group (Teacher).
    - `POST /api/v1/groups/join`: Join via Code (Student).
    - `DELETE /api/v1/groups/{id}/members/{userId}`: Remove Member (Leader).
    - `PUT /api/v1/groups/{id}/members/{userId}/role`: Promote/Demote (Leader).
- **Error Codes**:
    - `403 FORBIDDEN`: Insufficient permissions (e.g., Member trying to promote).
    - `404 NOT_FOUND`: Invalid Group ID or User ID.

## 🔗 Service Dependencies
- **Identity Service**: Receives user creation events to initialize profiles.
- **Course Service**: May be queried to update learning goals based on course availability.
- **Dashboard Service**: Provides data for the user dashboard.

## 🔑 Key Features
- **Profile Management**: Store and update name, age, education level, interests.
- **Learning Settings**: Manage learning goals, preferred languages, and schedule.
- **Diagnostic Info**: Store results of initial diagnostic tests.

## ⚙️ Configuration
| Property | Description | Example |
|----------|-------------|---------|
| `server.port` | Service Port | `8081` |
| `spring.datasource.url` | Database URL | `jdbc:postgresql://localhost:5432/profile_db` |

## 🚀 How to Run
1. Ensure PostgreSQL is running.
2. Run the service:
```bash
mvn spring-boot:run
```
