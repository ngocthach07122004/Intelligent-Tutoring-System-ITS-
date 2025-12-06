- [ ] **1. `assessment-service`: Expose Performance Data**
  - [ ] Add endpoint to calculate/retrieve overall GPA and total credits.
  - [ ] Add endpoint to retrieve semester-wise performance (GPA, credits, rank).
  - [ ] Ensure `GradebookService` can provide these metrics.

- [ ] **2. `user-profile-service`: Implement Performance API**
  - [ ] Create `PerformanceController` in `user-profile-service`.
  - [ ] Implement `GET /api/v1/performance/summary`.
    - [ ] Aggregates data from `assessment-service` (GPA, credits) and `user-profile-service` (achievements count).
  - [ ] Implement `GET /api/v1/performance/semesters`.
    - [ ] Proxies/Aggregates from `assessment-service`.
  - [ ] Implement `GET /api/v1/performance/skills`.
    - [ ] Retrieves skills from `user-profile-service` database (already exists, just need to expose via this path or reuse existing).

- [ ] **3. Integration & Verification**
  - [ ] Verify data flow from `assessment-service` to `user-profile-service`.
