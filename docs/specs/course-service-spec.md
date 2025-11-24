# Course Service Specification

## 1. Tổng quan
Quản lý khóa học, bài học, chương trình học và việc đăng ký học (Enrollment).
**Trạng thái hiện tại:** Thiếu thông tin quản lý lớp học và tiến độ chi tiết.
**Mức độ thay đổi:** Cao.

## 2. Entity Changes
### `Course` (Modify)
Bổ sung các trường hiển thị trên Dashboard:
*   `code` (String - Mã môn, VD: "CS101").
*   `credits` (Integer - Số tín chỉ).
*   `semester` (String - Học kỳ áp dụng).
*   `schedule` (String - Lịch học text, hoặc cấu trúc phức tạp hơn nếu cần).
*   `maxStudents` (Integer).
*   `startDate`, `endDate` (LocalDate).

### `Enrollment` (New Entity - Quan trọng)
Quản lý việc sinh viên tham gia khóa học. Hiện tại có thể đang thiếu hoặc sơ sài.
*   `id`
*   `courseId`
*   `studentId`
*   `status` (ACTIVE, COMPLETED, DROPPED).
*   `enrolledAt` (Timestamp).
*   `progress` (Integer 0-100 - Cache tiến độ để query nhanh cho Dashboard).
*   `lastAccessAt` (Timestamp).

### `CourseMaterial` (New Entity - Optional)
Nếu không tách riêng `Document Service`, có thể để tài liệu khóa học ở đây.
*   `id`, `courseId`, `title`, `url`, `type` (PDF, VIDEO).

## 3. API Endpoints
### Existing (Modify)
*   `GET /api/v1/courses`:
    *   **Filter:** Thêm filter theo `semester`, `status` (của enrollment).
    *   **Response:** Bổ sung `code`, `schedule`, `progress` (nếu đã login).
*   `GET /api/v1/courses/{id}`:
    *   **Response:** Chi tiết đầy đủ, bao gồm cả instructor info (gọi qua Profile Service hoặc cache).

### New Endpoints
*   `POST /api/v1/courses/{id}/enroll`: Đăng ký học.
*   `GET /api/v1/courses/my-courses`: Lấy danh sách khóa học của user đang login (kèm tiến độ).
    *   *Phục vụ:* `/dashboard/courses`.
*   `GET /api/v1/courses/{id}/stats`: Lấy thống kê lớp học (số lượng HV, điểm TB - gọi sang Assessment).

## 4. Service Communication
*   **Call to Profile Service:** Lấy thông tin giảng viên (`instructorId` -> Name, Avatar).
*   **Call to Assessment Service:** Lấy điểm số để tính điều kiện hoàn thành khóa học.
*   **Publisher:** Bắn event `StudentEnrolled` -> Assessment Service lắng nghe để khởi tạo Gradebook.
