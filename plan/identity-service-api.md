# Identity Service API Design

## 🌐 Overview
The **Identity Service** handles user registration, authentication, and security policies. It acts as a wrapper around **Keycloak** and manages the local user state for quick lookups.

> **🔧 Implementation**: For architecture details, design patterns, and technical implementation, see [Identity Service README](../backend/java-service/identity-service/README.md).

## 🔌 REST API Endpoints

### 1. Authentication
| Method | Path | Description | Role Required | Validation |
|:-------|:-----|:------------|:--------------|:-----------|
| `POST` | `/api/v1/auth/register` | Register new user. | `PUBLIC` | `email`: valid format, `password`: min 8 chars, 1 upper, 1 special. |
| `POST` | `/api/v1/auth/login` | Login. | `PUBLIC` | `email`: required, `password`: required. |
| `POST` | `/api/v1/auth/refresh` | Refresh Token. | `PUBLIC` | `refreshToken`: valid JWT format. |
| `POST` | `/api/v1/auth/logout` | Revoke Session. | `AUTHENTICATED` | None. |

**Register** (`POST /auth/register`):
```json
// Request
{
  "email": "student@its.com",
  "password": "StrongPassword123!",
  "fullName": "Nguyen Van A",
  "role": "STUDENT"
}
// Response (201 Created)
{ "userId": "uuid-123", "message": "Verification email sent" }
// Error (400 BAD_REQUEST)
{ "code": "VALIDATION_ERROR", "message": "Invalid email format" }
// Error (409 CONFLICT)
{ "code": "CONFLICT", "message": "Email already exists" }
```

**Login** (`POST /auth/login`):
```json
// Request
{ "email": "student@its.com", "password": "StrongPassword123!" }
// Response (200 OK)
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "expiresIn": 3600,
  "tokenType": "Bearer"
}
// Error (401 UNAUTHORIZED - Code: AUTH_FAILED)
{ "code": "AUTH_FAILED", "message": "Invalid credentials" }
// Error (403 FORBIDDEN - Account Locked)
{ "code": "ACCOUNT_LOCKED", "message": "Account locked due to multiple failed attempts" }
```

**Refresh Token** (`POST /auth/refresh`):
```json
// Request
{ "refreshToken": "eyJhbGc..." }
// Response (200 OK)
{ "accessToken": "eyJhbGc...", "expiresIn": 3600 }
```

**Logout** (`POST /auth/logout`):
```json
// Response (204 No Content)
```

### 2. Account Management
| Method | Path | Description | Role Required | Validation |
|:-------|:-----|:------------|:--------------|:-----------|
| `POST` | `/api/v1/auth/forgot-password` | Request Reset. | `PUBLIC` | `email`: valid format. |
| `POST` | `/api/v1/auth/reset-password` | Reset Password. | `PUBLIC` | `token`: required, `newPassword`: complexity rules. |
| `POST` | `/api/v1/auth/verify-email` | Verify Email. | `PUBLIC` | `token`: required. |

**Forgot Password** (`POST /auth/forgot-password`):
```json
// Request
{ "email": "student@its.com" }
// Response (200 OK)
{ "message": "If email exists, reset link sent." }
```

**Reset Password** (`POST /auth/reset-password`):
```json
// Request
{ "token": "reset-token-xyz", "newPassword": "NewPassword123!" }
// Response (200 OK)
{ "message": "Password reset successfully" }
// Error (400 BAD_REQUEST)
{ "code": "INVALID_TOKEN", "message": "Reset token expired or invalid" }
```

**Verify Email** (`POST /auth/verify-email`):
```json
// Request
{ "token": "verify-token-abc" }
// Response (200 OK)
{ "message": "Email verified successfully" }
```

### 3. User Management (Admin)
| Method | Path | Description | Role Required | Validation |
|:-------|:-----|:------------|:--------------|:-----------|
| `GET` | `/api/v1/users` | List/Search Users. | `ADMIN` | `page`, `size`, `email` (optional), `role` (optional). |
| `PUT` | `/api/v1/users/{id}/lock` | Lock Account. | `ADMIN` | `id`: valid UUID. |
| `PUT` | `/api/v1/users/{id}/unlock` | Unlock Account. | `ADMIN` | `id`: valid UUID. |

**List Users** (`GET /users`):
```json
// Query Params: ?page=0&size=10&email=student&role=STUDENT
// Response (200 OK)
{
  "content": [
    {
      "id": "uuid-123",
      "email": "student@its.com",
      "fullName": "Nguyen Van A",
      "role": "STUDENT",
      "status": "ACTIVE",
      "emailVerified": true,
      "createdAt": "2023-11-24T10:00:00Z"
    }
  ],
  "pageable": { "pageNumber": 0, "pageSize": 10, "totalElements": 150 }
}
```

**Lock Account** (`PUT /users/{id}/lock`):
```json
// Response (200 OK)
{ "status": "LOCKED", "updatedAt": "2023-11-24T12:00:00Z" }
// Audit Log Entry (Mandatory)
{
  "action": "USER_LOCK",
  "actor": "admin-uuid",
  "target": "user-uuid-123",
  "timestamp": "2023-11-24T12:00:00Z",
  "ipAddress": "192.168.1.1"
}
```

**Error Responses**:
- `400 VALIDATION_ERROR`: Validation failed.
- `401 AUTH_FAILED`: Invalid/Missing Token.
- `403 FORBIDDEN`: Insufficient Role.
- `404 NOT_FOUND`: User ID not found.
- `409 CONFLICT`: Email already exists.

## 📨 Async Events (RabbitMQ)

### 1. `USER_REGISTERED`
- **Exchange**: `its.topic.exchange`
- **Routing Key**: `identity.user.registered`
- **Reliability**: Retry 3x (Exp Backoff), DLX `its.dlx.exchange`.
- **Headers**: `X-Correlation-Id`, `X-Idempotency-Key` (UUID).
- **Idempotency**: Consumer checks Redis `processed_event:{eventId}` (TTL 24h).
- **Payload**:
  ```json
  {
    "userId": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe",
    "role": "STUDENT",
    "timestamp": "2023-10-27T10:00:00Z"
  }
  ```
- **Consumers**:
  - `Notification Service` (`q.notification.welcome`): Sends Welcome Email.
  - `Profile Service` (`q.profile.create`): Creates initial UserProfile.

### 2. `PASSWORD_RESET_REQ`
- **Exchange**: `its.topic.exchange`
- **Routing Key**: `identity.password.reset`
- **Reliability**: Retry 3x (Exp Backoff), DLX `its.dlx.exchange`.
- **Headers**: `X-Correlation-Id`, `X-Idempotency-Key` (UUID).
- **Idempotency**: Consumer checks Redis `processed_event:{eventId}` (TTL 24h).
- **Payload**:
  ```json
  {
    "email": "user@example.com",
    "resetToken": "xyz123...",
    "expiry": "2023-10-27T10:15:00Z"
  }
  ```
- **Consumers**:
  - `Notification Service` (`q.notification.otp`): Sends Reset Link Email.

### 3. `EMAIL_VERIFY_REQ`
- **Exchange**: `its.topic.exchange`
- **Routing Key**: `identity.email.verify`
- **Reliability**: Retry 3x (Exp Backoff), DLX `its.dlx.exchange`.
- **Headers**: `X-Correlation-Id`, `X-Idempotency-Key` (UUID).
- **Idempotency**: Consumer checks Redis `processed_event:{eventId}` (TTL 24h).
- **Payload**: `{ "email": "...", "verifyToken": "..." }`
- **Consumers**:
  - `Notification Service` (`q.notification.verify`): Sends Verification Email.

### Acceptance Criteria
1.  **Registration**:
    - Input: Valid email/password.
    - Output: 201 Created.
    - DB: User created in Keycloak & Local DB (status: PENDING_VERIFICATION).
    - Event: `USER_REGISTERED` emitted with Idempotency Key.
2.  **Lockout**:
    - Input: 5 failed logins.
    - Output: 401 Unauthorized (Account Locked).
    - DB: User status -> LOCKED.
3.  **Admin Search**:
    - Input: `GET /users?email=student@its.com`.
    - Output: 200 OK, List of Users.
    - Role Check: Non-Admin receives 403.

## 💾 Data Model (CRUD)

### 1. Database Schema (PostgreSQL)
```sql
CREATE TYPE user_role AS ENUM ('STUDENT', 'TEACHER', 'ADMIN');
CREATE TYPE user_status AS ENUM ('ACTIVE', 'LOCKED', 'BANNED', 'PENDING_VERIFICATION');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    keycloak_id VARCHAR(255) UNIQUE NOT NULL, -- Link to Keycloak User
    full_name VARCHAR(100) NOT NULL,
    role user_role NOT NULL DEFAULT 'STUDENT',
    status user_status NOT NULL DEFAULT 'PENDING_VERIFICATION',
    email_verified BOOLEAN DEFAULT FALSE,
    failed_attempts INT DEFAULT 0,
    last_failed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'COURSE_READ', 'COURSE_WRITE'
    description VARCHAR(255)
);

CREATE TABLE role_permissions (
    role user_role NOT NULL,
    permission_id INT REFERENCES permissions(id),
    PRIMARY KEY (role, permission_id)
);

CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    action VARCHAR(50) NOT NULL, -- e.g., 'LOGIN', 'PASSWORD_CHANGE'
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_audit_user_time ON audit_logs(user_id, timestamp);
```

### 2. Keycloak Mapping & Policy
- **Realm**: `its-realm`
- **Client**: `its-backend-client` (Confidential)
- **Claims Mapping**:
    - `sub` -> `users.keycloak_id`
    - `email` -> `users.email`
    - `realm_access.roles` -> `users.role`
- **Lockout Policy**:
    - Max Attempts: 5
    - Lockout Duration: 30 minutes (TTL)
    - Reset on: Successful login or Admin unlock.

### 3. Auth Flows & Examples

#### Login Flow (`POST /api/v1/auth/login`)
- **Request**: `{ "email": "...", "password": "..." }`
- **Response (200 OK)**:
  ```json
  {
    "accessToken": "ey...",
    "refreshToken": "ey...",
    "expiresIn": 3600,
    "tokenType": "Bearer"
  }
  ```
- **Error (401)**: `{ "code": "AUTH_FAILED", "message": "Invalid credentials" }`

#### Forgot Password Flow (`POST /api/v1/auth/forgot-password`)
- **Request**: `{ "email": "student@example.com" }`
- **Response (200 OK)**: `{ "message": "If email exists, reset link sent." }`
- **Logic**: Generates JWT with `scope=reset`, sends `PASSWORD_RESET_REQ` event.

### 4. Common Standards
- **Pagination**: `?page=0&size=10&sort=createdAt,desc`
- **Error Codes**:
    - `400`: Validation Error
    - `401`: Unauthorized (Invalid Token)
    - `403`: Forbidden (Insufficient Role)
    - `404`: Resource Not Found
    - `409`: Conflict (Email already exists)
    - `422`: Unprocessable Entity (Business Rule Violation)

### 5. gRPC & Proto
- **File**: `src/main/proto/identity.proto`
- **Stub Generation**: `mvn protobuf:compile`
- **Service**: `IdentityServiceGrpc`
    - `ValidateToken(TokenRequest) returns (TokenResponse)`
    - `GetUser(UserRequest) returns (UserResponse)`
