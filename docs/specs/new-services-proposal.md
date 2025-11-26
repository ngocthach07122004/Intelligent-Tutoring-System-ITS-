# Proposal: New Services & Missing Features

## 1. Document Service (Quản lý Tài liệu)
Hiện tại FE có màn hình `/dashboard/documents` rất chi tiết nhưng chưa có Backend.
*   **Entity:** `Document` (id, title, content/url, category, tags, isFavorite, ownerId, courseId).
*   **Features:** CRUD tài liệu, Upload file (S3/MinIO), Tagging, Search.
*   **Đề xuất:**
    *   *Phương án A (Nhanh):* Gộp vào `Course Service` nếu tài liệu gắn liền với khóa học.
    *   *Phương án B (Chuẩn):* Tạo `resource-service` riêng để quản lý mọi tài nguyên (Video, PDF, User Uploads). **Khuyên dùng Phương án B** vì FE có tính năng "Tài liệu cá nhân" không thuộc khóa học nào.

## 2. Forum Service (Hỏi đáp/Cộng đồng)
FE có `/dashboard/forum`.
*   **Entity:** `Question`, `Answer`, `Comment`, `Vote`, `Tag`.
*   **Features:** Đăng câu hỏi, Trả lời, Vote up/down, Search.
*   **Đề xuất:** Tạo `forum-service` riêng biệt. Đây là domain phức tạp, không nên gộp.

## 3. Chat Service (Tin nhắn)
FE có `/dashboard/chat`.
*   **Tech Stack:** WebSocket (Spring WebSocket / STOMP).
*   **Entity:** `Conversation`, `Message`, `Participant`.
*   **Đề xuất:**
    *   MVP: Có thể bỏ qua hoặc làm tính năng chat đơn giản (polling) nếu không kịp làm WebSocket.
    *   Long-term: Cần service riêng `chat-service` + MongoDB (để lưu message log lớn).

## 4. Recommendation Service (Gợi ý học tập)
FE có phần "Gợi ý bài học" và "Phân tích gap".
*   **Logic:** Dựa trên điểm số (`Assessment`) và Profile (`LearningStyle`) để gợi ý `Course`/`Lesson`.
*   **Đề xuất:** Có thể nằm trong `Dashboard Service` (logic đơn giản) hoặc tách riêng nếu dùng AI/ML model phức tạp.

---

## Lộ trình triển khai (Roadmap)
1.  **Phase 1 (Fix Gap):** Update `Profile`, `Course`, `Assessment` để FE chạy mượt các tính năng cơ bản (Hiển thị đúng thông tin, điểm số).
2.  **Phase 2 (New Core):** Build `Document Service` (đơn giản) để user upload bài tập/ghi chú.
3.  **Phase 3 (Social):** Build `Forum` và `Chat`.
