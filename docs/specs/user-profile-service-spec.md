# User Profile Service Specification

## 1. Tổng quan
Quản lý thông tin cá nhân, hồ sơ học sinh, phụ huynh và cài đặt người dùng.
**Trạng thái hiện tại:** Thiếu nhiều trường dữ liệu so với FE.
**Mức độ thay đổi:** Cao.

## 2. Entity Changes
### `UserProfile` (Modify)
Cần bổ sung các trường sau để khớp với `StudentProfile.tsx`:
*   **Thông tin cá nhân:**
    *   `studentId` (Mã số sinh viên - String, Unique).
    *   `phone` (String).
    *   `dateOfBirth` (LocalDate).
    *   `address` (String).
    *   `gender` (Enum).
*   **Thông tin học vụ:**
    *   `class` (String - Lớp sinh hoạt, VD: "12A1").
    *   `academicYear` (String - Niên khóa, VD: "2023-2024").
    *   `enrollmentDate` (LocalDate - Ngày nhập học).
*   **Thông tin phụ huynh (New Embedded/Entity):**
    *   `parentName` (String).
    *   `parentPhone` (String).
    *   `parentEmail` (String).
*   **Thông tin y tế/khẩn cấp (New Embedded/Entity):**
    *   `emergencyContact` (String - SĐT khẩn cấp).
    *   `bloodType` (String).
    *   `medicalNotes` (Text - Ghi chú y tế).

### `UserSkill` (New Entity)
Để phục vụ biểu đồ kỹ năng (Skill Radar) trên Dashboard:
*   `id`
*   `user_id`
*   `skill_name` (VD: Python, Communication).
*   `category` (TECHNICAL, SOFT_SKILL, LANGUAGE).
*   `level` (Integer: 0-100).

## 3. API Endpoints
### Existing (Modify)
*   `GET /api/v1/profile/me`:
    *   **Response:** Cần trả về đầy đủ các field mới (parent, medical, academic).
*   `PUT /api/v1/profile/me`:
    *   **Payload:** Cho phép update các field mới.

### New Endpoints
*   `GET /api/v1/profile/{userId}/skills`: Lấy danh sách kỹ năng của user.
*   `POST /api/v1/profile/skills`: Thêm/Update kỹ năng.
*   `GET /api/v1/profile/users/{ids}`: Bulk get profile (dùng cho danh sách lớp học/chat).

## 4. Service Communication
*   **Consumer:** Lắng nghe `UserCreated` từ Identity để khởi tạo profile mặc định.
*   **Provider:** Cung cấp thông tin user cho `Dashboard Service` và `Course Service` (khi hiển thị danh sách lớp).
