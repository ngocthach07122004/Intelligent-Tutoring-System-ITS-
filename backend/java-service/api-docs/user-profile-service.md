# User Profile Service API

REST endpoints implemented in `user-profile-service`. Most endpoints derive the current user from the JWT (`JwtUtil.getUserIdFromJwt()`).

**Base URL:** `/api/v1`  
**Auth:** JWT required for all except `/health`. Role/ownership checks enforced in business logic (e.g., group creation/join/removal).  
**Content-Type:** `application/json`.

## Profile (`/api/v1/profile`)

| Method | Path | Purpose | Request (body/params) | Response body |
| --- | --- | --- | --- | --- |
| `GET` | `/api/v1/profile/me` | Fetch the caller's profile. | — | `UserProfileResponse` (`id`, `userId`, contact/academic fields, `skills`, timestamps). |
| `PUT` | `/api/v1/profile/me` | Update the caller's profile. | `UserProfileRequest` – supports `bio`, `timezone`, `learningStyle`, `avatarUrl`, personal/academic/parent/emergency fields (see DTO validations). | Updated `UserProfileResponse`. |
| `GET` | `/api/v1/profile/{userId}` | Fetch another user's profile. | Path `userId` (UUID). | `UserProfileResponse`. |
| `GET` | `/api/v1/profile/users?ids=a,b,c` | Bulk fetch profiles. | Query `ids` (comma-separated UUID list). | `UserProfileResponse[]`. |

**Examples**
- `GET /api/v1/profile/me` → current user's profile.
- `PUT /api/v1/profile/me`  
  ```json
  {
    "bio": "Passionate learner",
    "timezone": "Asia/Ho_Chi_Minh",
    "learningStyle": "VISUAL",
    "avatarUrl": "https://cdn/avatar.png",
    "fullName": "Student One",
    "classId": "C101"
  }
  ```
  Response: updated `UserProfileResponse`.
- `GET /api/v1/profile/users?ids=uuid1,uuid2` → array of profiles.

**UserProfileRequest fields**
- `bio` (string, <=500)
- `timezone` (string, <=50)
- `learningStyle` (string, <=50)
- `avatarUrl` (string, <=512)
- Personal: `studentId` (<=50), `fullName` (<=255), `phone` (<=20), `dateOfBirth` (LocalDate), `address` (<=500), `gender` (<=20)
- Academic: `classId` (<=50), `className` (<=100), `academicYear` (<=20), `enrollmentDate` (LocalDate)
- Parent: `parentName` (<=255), `parentPhone` (<=20), `parentEmail` (email, <=255)
- Emergency/medical: `emergencyContact` (<=20), `bloodType` (<=10), `medicalNotes` (<=2000)

**UserProfileResponse fields**
- Echoes profile data plus: `id` (number), `userId` (UUID), `skills` (`SkillResponse[]`), `createdAt`, `updatedAt`.

## Skills (`/api/v1/profile`)

| Method | Path | Purpose | Request | Response body |
| --- | --- | --- | --- | --- |
| `GET` | `/api/v1/profile/skills` | List skills for the caller. | — | `SkillResponse[]` (`id`, `skillName`, `category`, `level`, `description`, timestamps). |
| `GET` | `/api/v1/profile/{userId}/skills` | List skills for another user (optional filter). | Path `userId`, optional `category`. | `SkillResponse[]`. |
| `POST` | `/api/v1/profile/skills` | Add a skill for the caller. | `SkillRequest` (`skillName` required, `category`, `level` 0–100, `description`). | Created `SkillResponse`. |
| `PUT` | `/api/v1/profile/skills/{skillId}` | Update a skill owned by the caller. | Path `skillId`, `SkillRequest`. | Updated `SkillResponse`. |
| `DELETE` | `/api/v1/profile/skills/{skillId}` | Remove a skill owned by the caller. | Path `skillId`. | No content. |

**Examples**
- `POST /api/v1/profile/skills`  
  ```json
  { "skillName": "Java", "category": "TECHNICAL", "level": 80, "description": "Spring Boot" }
  ```
  Response: created `SkillResponse`.
- `GET /api/v1/profile/{userId}/skills?category=TECHNICAL` → filtered skills list.

**SkillRequest fields**
- `skillName` (string, required)
- `category` (string, optional; e.g., TECHNICAL/SOFT_SKILL/LANGUAGE)
- `level` (int 0–100, required)
- `description` (string, optional)

**SkillResponse fields**
- `id` (number), `skillName`, `category`, `level`, `description`, `createdAt`, `updatedAt`.

## Schedules (`/api/v1/schedules`)

| Method | Path | Purpose | Request | Response body |
| --- | --- | --- | --- | --- |
| `GET` | `/api/v1/schedules` | List schedule slots for the caller within a range. | Query `from` and `to` (ISO-8601 `Instant`). | `ScheduleResponse[]` (`id`, `title`, `startTime`, `endTime`, `isRecurring`, `recurrenceRule`). |
| `POST` | `/api/v1/schedules` | Create a slot. | `ScheduleRequest` (`title`, `startTime` required, `endTime` required, optional `isRecurring`, `recurrenceRule`). | Created `ScheduleResponse`. |
| `DELETE` | `/api/v1/schedules/{id}` | Delete a slot owned by the caller. | Path `id` (Long). | No content. |

**Examples**
- `GET /api/v1/schedules?from=2024-01-01T00:00:00Z&to=2024-01-31T23:59:59Z` → list of slots in range.
- `POST /api/v1/schedules`  
  ```json
  {
    "title": "Study Session",
    "startTime": "2024-01-10T14:00:00Z",
    "endTime": "2024-01-10T16:00:00Z",
    "isRecurring": true,
    "recurrenceRule": "FREQ=WEEKLY;BYDAY=MO,WE,FR"
  }
  ```
  Response: created `ScheduleResponse`.

**ScheduleRequest fields**
- `title` (string, optional)
- `startTime` (Instant, required)
- `endTime` (Instant, required)
- `isRecurring` (boolean, optional)
- `recurrenceRule` (string, optional; RFC 5545)

**ScheduleResponse fields**
- `id` (number), `title`, `startTime`, `endTime`, `isRecurring`, `recurrenceRule`.

## Groups (`/api/v1/groups`)

| Method | Path | Purpose | Request | Response body |
| --- | --- | --- | --- | --- |
| `POST` | `/api/v1/groups` | Create a group. | `GroupRequest` (`name` required, `description` optional). | `GroupResponse` (`id`, `name`, `description`, `joinCode`, `role`, `memberCount`). |
| `POST` | `/api/v1/groups/join` | Join by code. | `JoinGroupRequest` (`joinCode` required). | Empty body, HTTP 200. |
| `GET` | `/api/v1/groups` | List groups for the caller. | Optional `role` (enum `GroupRole`). | `GroupResponse[]`. |
| `GET` | `/api/v1/groups/{id}/members` | List members of a group. | Path `id` (Long). | `GroupMemberResponse[]` (`studentId`, `role`, `joinedAt`). |
| `DELETE` | `/api/v1/groups/{id}/members/{userId}` | Remove a member. | Path `id` (group), `userId` (UUID). | No content. |
| `PUT` | `/api/v1/groups/{id}/members/{userId}/role` | Promote/demote a member. | Path `id`, `userId`, body `PromoteMemberRequest` (`role`). | Empty body, HTTP 200. |

**Examples**
- `POST /api/v1/groups`  
  ```json
  { "name": "Java Study Group", "description": "Weekly practice" }
  ```
  Response: `GroupResponse` with `joinCode`.
- `POST /api/v1/groups/join`  
  ```json
  { "joinCode": "ABC123" }
  ```
  Response: HTTP 200, empty body.
- `GET /api/v1/groups/{id}/members` → list of `GroupMemberResponse`.
- `PUT /api/v1/groups/{id}/members/{userId}/role`  
  ```json
  { "role": "LEADER" }
  ```
  Response: HTTP 200, empty body.

**GroupRequest fields**
- `name` (string, required, <=100)
- `description` (string, optional, <=255)

**JoinGroupRequest fields**
- `joinCode` (string, required)

**PromoteMemberRequest fields**
- `role` (enum `GroupRole`, required)

**GroupResponse fields**
- `id` (number), `name`, `description`, `joinCode`, `role` (current user's role), `memberCount` (int).

**GroupMemberResponse fields**
- `studentId` (UUID), `role` (`GroupRole`), `joinedAt` (Instant).

## Health

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Basic health check, returns `{ "status": "UP", "service": "user-profile-service" }`. |
