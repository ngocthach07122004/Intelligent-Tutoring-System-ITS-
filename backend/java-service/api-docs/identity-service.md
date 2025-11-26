# Identity Service API

REST endpoints implemented in `identity-service` (`/api/v1/auth/**`). Responses are wrapped in the standard envelope:

```json
{
  "statusCode": 200,
  "message": "success",
  "body": { ...payload }
}
```

**Base URL:** `/api/v1/auth`  
**Auth:** Public for register/login/refresh/reset-password; JWT required for logout and session management. Tokens are issued via Keycloak.  
**Content-Type:** `application/json`.

## Endpoints

| Method | Path | Purpose | Request (body) | Response body (inside `body` envelope) |
| --- | --- | --- | --- | --- |
| `POST` | `/register` (`/signup`) | Create an account and issue tokens. | `{ "email": "...", "username": "...", "name": "...", "password": "..." }` | `TokenResponse` (`accessToken`, `refreshToken`, `expiresIn`, `refreshExpiresIn`, `tokenType`, `userId`, `email`, `name`, `role`). |
| `POST` | `/login` (`/signin`) | Username/email password login. | `{ "email": "...", "username": "...", "password": "..." }` (email or username accepted) | `TokenResponse` (same shape as register). |
| `POST` | `/refresh` | Exchange a refresh token for a new access token. | `{ "refreshToken": "..." }` | `TokenResponse`. |
| `POST` | `/logout` | Revoke a refresh token + invalidate sessions. | `{ "refreshToken": "..." }` | Empty `body`, `message: "success"`. |
| `POST` | `/reset-password` | Reset password with current credentials. | `{ "email": "...", "oldPassword": "...", "newPassword": "..." }` | Empty `body`, `message: "success"`. |
| `GET` | `/sessions/{username}` | List active token sessions for a Keycloak user. | Path param `username`. | `TokenSession[]` (`id`, `keycloakUserId`, `username`, `accessToken`, `refreshToken`, `accessTokenExpiry`, `refreshTokenExpiry`, `clientId`, `createdAt`). |
| `DELETE` | `/sessions/{id}` | Revoke a stored token session by id. | Path param `id` (Long). | Empty `body`, `message: "success"`. |

## Examples

- `POST /api/v1/auth/register`  
  ```json
  { "email": "student@its.com", "username": "student1", "name": "Student One", "password": "StrongPass123!" }
  ```  
  Response (`200 OK`, envelope omitted below):  
  ```json
  {
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "eyJhbGciOi...refresh",
    "expiresIn": 3600,
    "refreshExpiresIn": 86400,
    "tokenType": "Bearer",
    "userId": 101,
    "email": "student@its.com",
    "name": "Student One",
    "role": "STUDENT"
  }
  ```

- `POST /api/v1/auth/login`  
  ```json
  { "email": "student@its.com", "password": "StrongPass123!" }
  ```
  Response: `TokenResponse` (same fields as above).

- `POST /api/v1/auth/refresh`  
  ```json
  { "refreshToken": "eyJhbGciOi...refresh" }
  ```
  Response: new `TokenResponse`.

- `POST /api/v1/auth/logout`  
  ```json
  { "refreshToken": "eyJhbGciOi...refresh" }
  ```
  Response: envelope with `message: "success"`, `body: null`.

- `POST /api/v1/auth/reset-password`  
  ```json
  { "email": "student@its.com", "oldPassword": "Old123!", "newPassword": "NewStrong123!" }
  ```
  Response: envelope with `message: "success"`.

- `GET /api/v1/auth/sessions/student1` → array of `TokenSession` records.  
  `DELETE /api/v1/auth/sessions/5` → revokes session id 5 (empty body, success message).

## Payload reference

**RegisterRequest / LoginRequest**
- `email` (string, optional for login, required for register) – email credential.
- `username` (string, optional) – username credential (legacy).
- `name` (string, optional) – display name (register only).
- `password` (string, required) – raw password.

**RefreshTokenRequest / Logout**
- `refreshToken` (string, required) – JWT refresh token.

**ResetPasswordRequest**
- `email` (string, required)
- `oldPassword` (string, required)
- `newPassword` (string, required)

**TokenResponse**
- `accessToken` (string)
- `refreshToken` (string)
- `expiresIn` (number, seconds)
- `refreshExpiresIn` (number, seconds)
- `tokenType` (string, typically `Bearer`)
- `userId` (number) – local user id.
- `email` (string)
- `name` (string)
- `role` (string)

**TokenSession**
- `id` (number)
- `keycloakUserId` (string)
- `username` (string)
- `accessToken`, `refreshToken` (string)
- `accessTokenExpiry`, `refreshTokenExpiry` (Instant)
- `clientId` (string)
- `createdAt` (Instant)

## Notes
- Security config permits `/health` and `/actuator/**` without authentication; other routes expect JWT propagation via Keycloak.
- Error payloads also use the `ApiResponse` envelope with `statusCode` and `message`.
