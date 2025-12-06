- [ ] **1. `assessment-service`: Support Analytics Timeframe**
  - [ ] Update `getStudentAnalytics` in `GradebookController` to accept `timeframe`.
  - [ ] Implement filtering logic in `GradebookService`.

- [ ] **2. `assessment-service`: Expose Subject Details**
  - [ ] Create endpoint `GET /api/v1/gradebook/student/{studentId}/course/{courseId}` to return detailed performance for a specific course (assignments, exams).

- [ ] **3. `user-profile-service`: Update Clients**
  - [ ] Update `AssessmentServiceClient` to include new/updated endpoints.

- [ ] **4. `user-profile-service`: Implement Subject Details Endpoint**
  - [ ] Add `getStudentSubject(UUID studentId, String subjectId)` to `StudentService`.
  - [ ] Expose `GET /api/v1/students/{id}/subjects/{subjectId}` in `StudentController`.

- [ ] **5. `user-profile-service`: Update Analytics Endpoint**
  - [ ] Update `getStudentAnalytics` in `StudentController` to accept `timeframe` and pass it to service/client.

- [ ] **6. Verification**
  - [ ] Verify new endpoints and filtering.
