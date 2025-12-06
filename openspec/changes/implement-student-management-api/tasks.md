- [x] **1. `user-profile-service`: Setup & Scaffolding**
  - [x] Create `StudentController.java` under the `controller` package.
  - [x] Create `StudentService.java` interface and `StudentServiceImpl.java` implementation.
  - [x] Define all required DTOs (`Student`, `AcademicRecord`, etc.) in a new `dto/student` package.
  - [x] Add necessary Feign client interfaces (`AssessmentServiceClient`, `CourseServiceClient`) to communicate with other services.

- [x] **2. `user-profile-service`: Implement Profile Endpoints**
  - [x] Implement `GET /api/v1/students/{id}`.
    - [x] Add `getStudentProfile(UUID studentId)` method to `StudentService`.
    - [x] This service method will call the existing `UserProfileService` to fetch the profile data.
  - [x] Implement `PUT /api/v1/students/{id}`.
    - [x] Add `updateStudentProfile(UUID studentId, ...)` method to `StudentService`.
  - [x] Add unit tests for the new controller and service methods.

- [x] **3. `user-profile-service`: Implement Academic History Endpoint**
  - [x] Implement `GET /api/v1/students/{id}/academic-history`.
    - [x] Add `getStudentAcademicHistory(UUID studentId)` method to `StudentService`.
    - [x] The service method will call the `assessment-service` via the Feign client to get gradebook history.
  - [x] Add unit tests.

- [x] **4. `user-profile-service`: Implement Analytics Endpoint**
  - [x] Implement `GET /api/v1/students/{id}/analytics`.
    - [x] Add `getStudentAnalytics(UUID studentId)` method to `StudentService`.
    - [x] The service method will call the `assessment-service` via the Feign client.
  - [x] Add unit tests.

- [x] **5. `user-profile-service`: Implement Subjects Endpoint**
  - [x] Implement `GET /api/v1/students/{id}/subjects`.
    - [x] **Dependency:** May require adding a new endpoint to `course-service` to fetch enrollments for a specific `studentId` (not just the current user).
    - [x] Add `getStudentSubjects(UUID studentId)` method to `StudentService`.
    - [x] The service method will call the `course-service` via the Feign client.
  - [x] Add unit tests.

- [x] **6. `user-profile-service`: Implement Achievements Endpoint**
  - [x] Implement `GET /api/v1/students/{id}/achievements`.
    - [x] Add `getStudentAchievements(UUID studentId)` method to `StudentService`.
    - [x] The service method will call the `assessment-service` via the Feign client.
  - [x] Add unit tests.

- [x] **7. API Gateway Configuration**
  - [x] Update the API Gateway configuration to route `/api/v1/students/**` to the `user-profile-service`.

- [x] **8. Integration Testing**
  - [x] Write integration tests to verify the end-to-end functionality of the new API endpoints.

- [x] **9. Documentation**
  - [x] Update the `api-docs/user-profile-service.md` with the new endpoints.
