# Hướng dẫn kết nối API với Auto-Fallback

## 📌 Tổng quan

Frontend được thiết kế với **cơ chế auto-fallback** - tự động chuyển sang mock data khi backend offline, không cần cấu hình thủ công.

## 🔧 Cấu hình Backend URLs

File `.env.local`:
```env
NEXT_PUBLIC_DASHBOARD_API_BASE_URL=http://localhost:8085/api/v1/dashboard
NEXT_PUBLIC_COURSE_API_BASE_URL=http://localhost:8084/api/v1
```

## 🚀 Cách hoạt động

### 1. **Dashboard API** (`src/lib/BE-library/dashboard-service-api.ts`)

```typescript
async getStudentSummary() {
  try {
    const response = await axios.get('/student/summary');
    console.log('✅ Dashboard summary loaded from API');
    return { success: true, data: response.data };
  } catch (error) {
    console.warn('⚠️ Backend offline, using mock data');
    return { success: false, data: mockDashboardSummary };
  }
}
```

**Endpoints:**
- `GET /student/summary` - Thông tin tổng quan (profile, courses, achievements)
- `GET /student/analytics` - Phân tích học tập (GPA, performance, learning time)

### 2. **Course API** (`src/lib/BE-library/course-service-api.ts`)

```typescript
async getPublishedCourses(params) {
  try {
    const response = await axios.get('/courses/published', this.config(params));
    console.log('✅ Loaded courses from API');
    return unwrap(response);
  } catch (error) {
    console.warn('⚠️ Using mock published courses');
    return handleError(error); // Hiện tại trả về null
  }
}
```

**Endpoints:**
- `GET /courses/published` - Danh sách khóa học công khai (có phân trang)
- `GET /courses/search` - Tìm kiếm khóa học
- `POST /courses/{courseId}/enroll` - Đăng ký khóa học
- `GET /courses/my-courses` - Khóa học đã đăng ký

## 📊 Luồng dữ liệu

### Dashboard (Home Page)
```
HomeScreen.tsx
  └─> useEffect() on mount
      ├─> dashboardServiceApi.getStudentSummary()
      │   ├─ [Backend ON] → API Response → setSummary(data)
      │   └─ [Backend OFF] → Mock Data → setSummary(mockData)
      │
      └─> dashboardServiceApi.getStudentAnalytics()
          ├─ [Backend ON] → API Response → setAnalytics(data)
          └─ [Backend OFF] → Mock Data → setAnalytics(mockData)

MainDetail.tsx (nhận props: summary, analytics)
  ├─> QuickStatsCard (attendanceRate, assignmentCompletion, totalLearningHours)
  ├─> GPACard (academicProgress.currentGPA, trend)
  ├─> CourseStatsCard (courseStats)
  ├─> SubjectPerformanceCard (subjectPerformance[])
  ├─> ActiveCoursesCard (courses[], filter by lastAccessAt)
  ├─> AchievementsCard (achievements[], filter by earned=true)
  └─> LearningTimeChart (learningTime[], last 4 weeks)
```

### Learning Page
```
LearningPage.tsx
  └─> useEffect() on mount
      └─> courseServiceApi.getPublishedCourses({ page: 0, size: 100 })
          ├─ [Backend ON] → Map CourseResponse[] → AvailableCourse[]
          └─ [Backend OFF] → allAvailableCourses (mock)

Display
  ├─> Stats Cards (total, enrolled, available)
  ├─> Filters (search, level, enrollment status)
  ├─> Course Grid (mapped courses)
  └─> Course Detail Modal (selected course)
```

## 🧪 Kiểm tra hoạt động

### Khi Backend ONLINE
```bash
# Mở browser console (F12)
✅ Dashboard summary loaded from API
✅ Student analytics loaded from API
✅ Loaded 15 courses from API
```

### Khi Backend OFFLINE
```bash
# Mở browser console (F12)
⚠️ Backend offline, using mock data: AxiosError: connect ECONNREFUSED
⚠️ API returned no courses, using mock data
```

## 📁 Cấu trúc Mock Data

```
src/lib/mockData/
├── dashboard.types.ts          # TypeScript interfaces (match OpenAPI schema)
├── dashboard.mock.ts           # Sample dashboard data
│   ├── mockDashboardSummary    (6 courses, 3 achievements)
│   └── mockStudentAnalytics    (4 subjects, 6 weeks learning time)
│
└── allCourses.ts              # Sample courses
    └── allAvailableCourses    (15 courses with tags, prerequisites)
```

## 🔍 Debug Tips

### 1. Xem API được gọi hay không
```typescript
// Trong component
useEffect(() => {
  console.log('🔵 Component mounted, fetching data...');
  fetchData();
}, []);
```

### 2. Kiểm tra response structure
```typescript
const response = await api.getStudentSummary();
console.log('Response:', response);
// { success: true, data: {...} } hoặc
// { success: false, data: mockData }
```

### 3. Test API endpoint thủ công
```bash
# Dashboard API
curl http://localhost:8085/api/v1/dashboard/student/summary

# Course API
curl http://localhost:8084/api/v1/courses/published?page=0&size=10
```

## ⚠️ Lưu ý

1. **Port numbers quan trọng:**
   - Dashboard Service: `8085`
   - Course Service: `8084` (NOT 8181 - đã fix)

2. **Mock data tự động:**
   - Không cần điều kiện `if (process.env.NODE_ENV === 'development')`
   - Frontend tự động detect khi API fail

3. **Type safety:**
   - Mock data phải match với TypeScript interfaces
   - Kiểm tra `dashboard.types.ts` và `course-service-interfaces.ts`

4. **Environment variables:**
   - Next.js yêu cầu prefix `NEXT_PUBLIC_` để expose ra browser
   - Cần restart dev server sau khi sửa `.env.local`

## 🎯 API Schema Mapping

### DashboardSummaryResponse
```typescript
{
  profile: { studentId, fullName, email, phoneNumber, avatarUrl },
  courseStats: { totalCourses, inProgressCourses, completedCourses, averageProgress },
  upcomingTasks: [{ title, dueDate, priority, type }],
  achievements: [{ id, name, description, iconUrl, earnedAt, rarity }]
}
```

### StudentAnalyticsResponse
```typescript
{
  academicProgress: { currentGPA, previousGPA, trend, percentChange },
  subjectPerformance: [{ subjectName, currentScore, previousScore, trend }],
  learningTime: [{ weekStart, weekEnd, totalHours }],
  quickStats: { attendanceRate, assignmentCompletionRate, totalLearningHours, upcomingAssignments }
}
```

### CourseResponse (từ /courses/published)
```typescript
{
  id, code, title, description, credits, instructorName,
  semester, schedule, startDate, endDate,
  enrolled, currentStudents, maxStudents,
  prerequisites: [{ requiredCourseId, requiredCourseTitle }],
  tags: [{ name, color }]
}
```

## 🚦 Testing Checklist

- [ ] Dashboard hiển thị đúng khi backend online
- [ ] Dashboard tự động dùng mock data khi backend offline
- [ ] Learning page load được danh sách courses từ API
- [ ] Learning page fallback về mock courses khi API fail
- [ ] Console log rõ ràng (✅ success / ⚠️ fallback)
- [ ] Type checking không có lỗi (npm run type-check)
- [ ] UI responsive và consistent (black/white theme)

---

**Tác giả:** GitHub Copilot  
**Cập nhật:** 2024  
**Mục đích:** Development guide cho Intelligent Tutoring System
