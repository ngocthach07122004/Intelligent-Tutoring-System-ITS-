# Dashboard Service Specification

## 1. Tổng quan
Service Aggregator (Tổng hợp), chịu trách nhiệm gọi các service con để lấy dữ liệu hiển thị cho Dashboard, giảm tải cho FE phải gọi quá nhiều API.
**Trạng thái hiện tại:** Đã có khung, cần implement logic gọi Feign Client.
**Mức độ thay đổi:** Cao (Implementation).

## 2. Logic Aggregation
### Endpoint: `GET /api/v1/dashboard/student/summary`
*   **Mục đích:** Phục vụ `/dashboard/home`.
*   **Dữ liệu cần:**
    1.  **Profile:** Tên, Avatar (`ProfileClient`).
    2.  **Courses:** Số khóa đang học, tiến độ trung bình (`CourseClient`).
    3.  **Performance:** GPA hiện tại, Next Assignment (`AssessmentClient` + `CourseClient`).
    4.  **Notifications/Messages:** Số tin nhắn mới (Nếu có Chat Service).

### Endpoint: `GET /api/v1/dashboard/student/analytics`
*   **Mục đích:** Phục vụ `/dashboard/performance` (phần biểu đồ).
*   **Dữ liệu cần:**
    1.  **Exam Scores History:** Lịch sử điểm số theo tháng (`month`, `score`, `average`).
    2.  **Learning Time:** Thời gian học theo tuần (`week`, `hours`).
    3.  **Trend Analysis:** So sánh `current` vs `previous` cho GPA và Subject Score.
    4.  **Skill Radar:** Tổng hợp kỹ năng (`ProfileClient` hoặc `AssessmentClient`).
    5.  **AI Insights:** `strengths` (Điểm mạnh) và `improvements` (Cần cải thiện) - Có thể mock hoặc rule-based đơn giản.

## 3. Feign Clients Requirements
*   **CourseClient:**
    *   `getStudentCourses(userId)`: Trả về list khóa học + tiến độ.
*   **AssessmentClient:**
    *   `getStudentGradebook(userId)`: Trả về điểm số, GPA.
    *   `getStudentAchievements(userId)`: Trả về huy hiệu.
*   **ProfileClient:**
    *   `getUserProfile(userId)`: Trả về thông tin cá nhân.

## 4. Lưu ý
*   Dashboard Service nên sử dụng **Async** (CompletableFuture) để gọi song song các service con, giảm latency.
*   Cân nhắc **Caching** (Redis) cho các dữ liệu ít thay đổi (như Achievements, Profile).
