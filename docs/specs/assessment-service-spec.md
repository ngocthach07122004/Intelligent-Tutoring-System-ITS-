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
*   `GET /api/v1/assessment/gradebook/history/{studentId}`: Lấy lịch sử bảng điểm chi tiết theo từng kỳ (Academic Records).
    *   *Phục vụ:* Tab "Bảng điểm học tập" trong Profile.
    *   *Response:* List of `{ semester, gpa, totalCredits, rank, subjects: [...] }`.
*   `GET /api/v1/assessment/achievements`: Lấy danh sách thành tích của user.
*   `GET /api/v1/assessment/skills`: Lấy đánh giá kỹ năng (nếu Assessment tính toán kỹ năng dựa trên bài test).
    *   *Note:* Nếu kỹ năng do user tự nhập -> Profile Service. Nếu do hệ thống đánh giá -> Assessment Service. FE đang hiển thị cả 2.

## 4. Service Communication
*   **Consumer:** Lắng nghe `StudentEnrolled` (từ Course) để tạo Gradebook entry.
*   **Provider:** Cung cấp điểm số cho Dashboard Service (để vẽ biểu đồ).

## 5. FE Alignment Plan (Assessment-first)
Chuẩn hóa payload để thay mock trên FE (`/dashboard/performance`, `StudentProfile`, `LearningAnalytics`, `AchievementBadge`).

### API Contracts (đề xuất trả về JSON)
* `GET /api/v1/assessment/gradebook/summary?studentId={id}`
    * Dùng cho thẻ tổng quan & dropdown học kỳ (`PerformanceSummary`).
    * Response:
    ```json
    {
      "studentId": "uuid",
      "semesters": [
        {
          "semester": "HK1 2024-2025",
          "gpa": 8.75,
          "totalCredits": 18,
          "rank": 3,
          "totalStudents": 120,
          "achievements": 5,
          "attendance": 96.5
        }
      ],
      "overall": {
        "gpa": 8.46,
        "totalCredits": 56
      }
    }
    ```
* `GET /api/v1/assessment/gradebook/history/{studentId}`
    * Dùng cho tab học kỳ + modal môn học trong `StudentProfile`.
    * Response:
    ```json
    {
      "studentId": "uuid",
      "records": [
        {
          "semester": "HK1 2024-2025",
          "gpa": 8.75,
          "totalCredits": 24,
          "rank": 3,
          "totalStudents": 45,
          "subjects": [
            { "name": "Toán học", "code": "MATH12", "credits": 4, "grade": "A", "score": 9.0, "teacher": "Trần Văn A" }
          ]
        }
      ]
    }
    ```
* `GET /api/v1/assessment/achievements?studentId={id}`
    * Feed cho `AchievementBadge` và thống kê count trong `PerformanceSummary`.
    * Response item: `{ "id": "top_student", "title": "...", "description": "...", "icon": "⭐", "category": "academic|attendance|participation|leadership|special", "rarity": "common|uncommon|rare|legendary", "isEarned": true, "earnedDate": "2024-06-20", "progress": { "current": 3, "target": 5 } }`
* `GET /api/v1/assessment/skills?studentId={id}` (nếu Assessment tính skill radar; nếu không thì trả về rỗng và Dashboard lấy từ Profile Service)
    * Response item: `{ "name": "Python", "level": 85, "category": "technical|soft|language" }`
* `GET /api/v1/assessment/analytics?studentId={id}`
    * Cung cấp dữ liệu biểu đồ tháng/tuần và AI insights cho `LearningAnalytics`.
    * Response:
    ```json
    {
      "examScores": [ { "month": "T9", "score": 8.2, "average": 7.8 } ],
      "learningTime": [ { "week": "T1", "hours": 25 } ],
      "strengths": ["Toán học - Tư duy logic tốt"],
      "improvements": ["Quản lý thời gian học tập"]
    }
    ```

### Backend TODO
1) Hoàn thiện entity: `Gradebook` (gpa, status), `Achievement`, `UserAchievement`, optional `StudentRank`.  
2) Implement các endpoint trên (REST) + validation filter theo `studentId`.  
3) Tính toán phụ trợ:
   - `attendance`, `achievements` count trong summary (có thể từ LMS hoặc tạm mock).  
   - `subjects.teacher` cần join Course Service hoặc cache.  
4) Event consumer `StudentEnrolled` để init gradebook.  
5) Bật pagination/caching cho `achievements` nếu số lượng lớn.  
6) Expose Feign client cho Dashboard Service để tổng hợp `/dashboard/student/summary` và `/dashboard/student/analytics`.

### Frontend TODO
1) Thay mock bằng API calls:
   - `PerformanceSummary`: gọi `GET /assessment/gradebook/summary` & `GET /assessment/achievements` (để lấy count/chi tiết).
   - `StudentProfile` (tab học tập): dùng `GET /assessment/gradebook/history/{studentId}`; map `subjects[]` đúng key.  
   - `LearningAnalytics`: gọi `GET /assessment/analytics`.  
2) Chuẩn hóa enum mapping:
   - `category`: `academic|attendance|participation|leadership|special`.  
   - `rarity`: `common|uncommon|rare|legendary`.  
   - `skill.category`: `technical|soft|language`.  
3) Lấy `studentId` từ session/profile (không hardcode) và truyền vào query.  
4) Hiển thị graceful fallback khi API trả rỗng (chưa có dữ liệu).  
5) Nếu dùng Dashboard Service làm aggregator, trỏ FE sang `/api/v1/dashboard/student/summary` và `/analytics` với cùng payload như trên (Dashboard sẽ gọi Assessment).
