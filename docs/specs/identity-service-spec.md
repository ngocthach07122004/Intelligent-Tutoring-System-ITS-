# Identity Service Specification

## 1. Tổng quan
Service quản lý xác thực (Authentication) và phân quyền (Authorization).
**Trạng thái hiện tại:** Cơ bản ổn định.
**Mức độ thay đổi:** Thấp.

## 2. Entity Changes
Hiện tại `Identity Service` chủ yếu quản lý `User` (Credential) và `Role`. Thông tin chi tiết người dùng (Avatar, Bio, v.v.) nằm ở `User Profile Service`.
*   **User Entity:**
    *   Giữ nguyên các trường cơ bản: `username`, `password`, `email`, `roles`.
    *   **Lưu ý:** Đảm bảo `id` (UUID) được đồng bộ sang `User Profile Service` khi tạo user mới.

## 3. API Endpoints
### Existing (Cần kiểm tra/giữ nguyên)
*   `POST /api/v1/auth/signup`: Đăng ký tài khoản.
    *   **Flow:** Tạo User -> Bắn event `UserCreated` -> Profile Service lắng nghe để tạo Profile rỗng.
*   `POST /api/v1/auth/signin`: Đăng nhập, trả về JWT.
*   `POST /api/v1/auth/refresh`: Refresh token.
*   `POST /api/v1/auth/logout`: Đăng xuất.

### New / Modified
*   Không có yêu cầu thay đổi lớn từ phía FE.
*   **Gap:** Kiểm tra xem response `signin` có trả về thông tin cơ bản (`name`, `role`, `avatar` - optional) để FE hiển thị ngay trên Header không. Nếu không, FE phải gọi thêm `GET /api/v1/profile/me`.
    *   *Đề xuất:* Response `signin` nên kèm `user_id` và `role` để FE tiện điều hướng.

## 4. Service Communication
*   **Publisher:** Bắn event `UserCreated` (RabbitMQ) khi đăng ký thành công.
*   **Consumer:** Không.
