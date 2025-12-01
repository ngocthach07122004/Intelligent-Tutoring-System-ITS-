# Connect Student Profile Widgets to API

## Goal
Connect the `StudentProfile` and `StudentManagementDashboard` components to the backend API using the `student-management-api.ts` library. This involves replacing mock data with real API calls for user profile, academic history, subjects, and achievements.

## User Review Required
> [!IMPORTANT]
> The implementation assumes the current user context (`getMyProfile`) for fetching the initial student ID. If this dashboard is intended for an admin/teacher view, the logic for obtaining the `studentId` would need to change (e.g., from route params). For now, we default to the logged-in user's profile.

## Proposed Changes

### Frontend Components

#### [MODIFY] [StudentProfile.tsx](file:///c:/BachKhoa/HK251/KTPM/Assignment/Intelligent-Tutoring-System-ITS-/frontend/src/components/widgets/profile/StudentProfile.tsx)
- Add props interface `StudentProfileProps` to accept `initialData` (Student/UserProfileResponse) and `studentId`.
- Remove hardcoded `mockStudentData` and `mockAcademicRecords`.
- Use `useEffect` to fetch `academicHistory` using `studentManagementOps.getAcademicHistory(studentId)`.
- Initialize `studentData` state from `initialData` prop.
- Update `handleSave` to use `studentManagementOps.updateMyProfile` (or `updateStudent`).
- Map API response fields to the component's state structure.

#### [MODIFY] [StudentManagementDashboard.tsx](file:///c:/BachKhoa/HK251/KTPM/Assignment/Intelligent-Tutoring-System-ITS-/frontend/src/components/widgets/profile/StudentManagementDashboard.tsx)
- Import `studentManagementOps` and necessary interfaces.
- Add state for `profile`, `subjects`, `achievements`, `analytics`, `loading`, and `error`.
- Use `useEffect` to:
    1. Fetch current user profile via `studentManagementOps.getMyProfile()`.
    2. Extract `studentId`.
    3. Fetch `subjects`, `achievements`, and `analytics` using the `studentId`.
- Replace `mockSubjects` and `mockAchievements` with fetched data.
- Pass `profile` and `studentId` to `<StudentProfile />`.
- Handle loading and error states (e.g., show a spinner or error message).

## Verification Plan

### Manual Verification
- **Profile Tab**: Verify that student information loads correctly from the API. Test "Edit" functionality to ensure updates are saved to the backend.
- **Academic Tab**: Verify that academic history (semesters, subjects, grades) is displayed correctly.
- **Subjects Tab**: Verify that the list of current subjects and their statistics (attendance, assignments) are real data.
- **Achievements Tab**: Verify that badges and progress reflect the API response.
- **General**: Check console for any errors during data fetching.
