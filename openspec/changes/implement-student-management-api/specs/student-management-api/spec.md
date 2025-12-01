---
capability: student-management-api
---

## ADDED Requirements

### Requirement
The `user-profile-service` MUST expose an endpoint to retrieve a student's core profile.
#### Scenario: An admin requests a student's profile.
- **Given** an admin is authenticated.
- **When** a `GET` request is made to `/api/v1/students/{id}`.
- **Then** the service MUST return a `200 OK` response.
- **And** the response body MUST contain the `Student` profile object.

### Requirement
The `user-profile-service` MUST expose an endpoint to update a student's core profile.
#### Scenario: An admin updates a student's phone number.
- **Given** an admin is authenticated.
- **When** a `PUT` request is made to `/api/v1/students/{id}` with an updated `Student` object.
- **Then** the service MUST return a `200 OK` response.
- **And** the response body MUST contain the updated `Student` profile object.

### Requirement
The `user-profile-service` MUST expose an endpoint to retrieve a student's academic history.
#### Scenario: An admin requests a student's academic history.
- **Given** an admin is authenticated.
- **When** a `GET` request is made to `/api/v1/students/{id}/academic-history`.
- **Then** the service MUST return a `200 OK` response.
- **And** the response body MUST contain a list of `AcademicRecord` objects.

### Requirement
The `user-profile-service` MUST expose an endpoint to retrieve a student's learning analytics.
#### Scenario: An admin requests a student's learning analytics.
- **Given** an admin is authenticated.
- **When** a `GET` request is made to `/api/v1/students/{id}/analytics`.
- **Then** the service MUST return a `200 OK` response.
- **And** the response body MUST contain the `LearningAnalytics` object.

### Requirement
The `user-profile-service` MUST expose an endpoint to retrieve a student's currently enrolled subjects.
#### Scenario: An admin requests a student's current subjects.
- **Given** an admin is authenticated.
- **When** a `GET` request is made to `/api/v1/students/{id}/subjects`.
- **Then** the service MUST return a `200 OK` response.
- **And** the response body MUST contain a list of `CurrentSubject` objects.

### Requirement
The `user-profile-service` MUST expose an endpoint to retrieve a student's achievements.
#### Scenario: An admin requests a student's achievements.
- **Given** an admin is authenticated.
- **When** a `GET` request is made to `/api/v1/students/{id}/achievements`.
- **Then** the service MUST return a `200 OK` response.
- **And** the response body MUST contain a list of `Achievement` objects.

### Requirement
The `api-gateway` MUST route student management requests to the user-profile-service.
#### Scenario: A request for a student's profile is made.
- **Given** a client sends a request to the gateway.
- **When** the request path is `/api/v1/students/{id}` or a sub-path.
- **Then** the gateway MUST forward the request to the `user-profile-service`.
