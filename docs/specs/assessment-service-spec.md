# Assessment Service Specification

## 1. Tổng quan
Quản lý bài kiểm tra, điểm số, đánh giá năng lực và hệ thống thành tích (Gamification).
**Trạng thái hiện tại:** Logic cơ bản, thiếu Gamification và Aggregation.
**Mức độ thay đổi:** Trung bình - Cao.

## 2. Entity Changes
### `Gradebook` (Modify)
*   Cần đảm bảo lưu trữ điểm số cho từng `Course` và `Student`.
*   Thêm `gpa` (Điểm tổng kết môn).
*   Thêm `status` (PASSED, FAILED).

### `Achievement` (New Entity - Gamification)
Phục vụ tab "Thành tích" trên Dashboard.
*   `id`
*   `code` (VD: "MATH_MASTER").
*   `name`, `description`, `iconUrl`.
*   `criteria` (JSON - Điều kiện đạt).

### `UserAchievement` (New Entity)
*   `userId`
*   `achievementId`
*   `earnedAt` (Timestamp).

### `StudentRank` (New Entity - Optional)
Lưu trữ xếp hạng học tập theo kỳ.
*   `userId`
*   `semester`
*   `gpa`
*   `rank` (Thứ hạng).

## 3. API Endpoints
### New Endpoints
*   `GET /api/v1/assessment/gradebook/summary`: Lấy bảng điểm tổng hợp (GPA, Credits, Rank) theo kỳ.
    *   *Phục vụ:* `/dashboard/performance`.
*   `GET /api/v1/assessment/achievements`: Lấy danh sách thành tích của user.
*   `GET /api/v1/assessment/skills`: Lấy đánh giá kỹ năng (nếu Assessment tính toán kỹ năng dựa trên bài test).
    *   *Note:* Nếu kỹ năng do user tự nhập -> Profile Service. Nếu do hệ thống đánh giá -> Assessment Service. FE đang hiển thị cả 2.

## 4. Service Communication
*   **Consumer:** Lắng nghe `StudentEnrolled` (từ Course) để tạo Gradebook entry.
*   **Provider:** Cung cấp điểm số cho Dashboard Service (để vẽ biểu đồ).
