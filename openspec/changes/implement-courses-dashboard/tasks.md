- [ ] **1. `course-service`: Implement Course Statistics**
  - [ ] Add `getCourseStatistics(UUID studentId)` to `EnrollmentService`.
  - [ ] Expose `GET /api/v1/courses/my-courses/stats` in `EnrollmentController` (or `CourseController` if mapped there).

- [ ] **2. `course-service`: Enhance My Courses Endpoint**
  - [ ] Update `getMyCourses` in `EnrollmentController` to support `status` and `q` (search) parameters.
  - [ ] Ensure response matches `Course` object fields (progress, students count, etc.).

- [ ] **3. `course-service`: Enhance Course Details Endpoint**
  - [ ] Verify `GET /api/v1/courses/{id}` returns `CourseDetail` fields (syllabus, assignments, resources).
  - [ ] If not, update `CourseService` and DTOs.

- [ ] **4. `course-service`: Verify Enrollment Endpoint**
  - [ ] Verify `POST /api/v1/courses/{id}/enroll` works as expected.

- [ ] **5. Integration & Verification**
  - [ ] Verify all endpoints against the spec.
