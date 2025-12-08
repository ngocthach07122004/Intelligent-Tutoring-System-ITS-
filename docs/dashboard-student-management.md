# Dashboard Student Management API Coverage

## Route
- `/dashboard/student-management`

## Component
- `src/app/dashboard/student-management/page.tsx` -> `src/components/widgets/profile/StudentManagementDashboard.tsx`

## API Calls
### Get My Profile
- **Endpoint:** `GET /api/v1/profile/me`
- **Function:** `studentManagementOps.getMyProfile`
- **Status:** Covered.

### Get Subjects
- **Endpoint:** `GET /api/v1/students/{id}/subjects`
- **Function:** `studentManagementOps.getSubjects`
- **Status:** Covered.

### Get Achievements
- **Endpoint:** `GET /api/v1/students/{id}/achievements`
- **Function:** `studentManagementOps.getAchievements`
- **Status:** Covered.

### Get Analytics
- **Endpoint:** `GET /api/v1/students/{id}/analytics`
- **Function:** `studentManagementOps.getAnalytics`
- **Status:** Covered.

### Get Subject Detail
- **Endpoint:** `GET /api/v1/students/{id}/subjects/{subjectId}`
- **Function:** `studentManagementOps.getSubjectDetail`
- **Status:** Covered.

## Assessment
The student management route has extensive API coverage through the `studentManagementOps` wrapper, which interacts with the `user-profile-service`. The endpoints seem well-defined and cover the necessary data for the dashboard.
