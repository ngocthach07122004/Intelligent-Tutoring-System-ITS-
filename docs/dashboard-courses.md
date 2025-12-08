# Dashboard Courses API Coverage

## Route
- `/dashboard/courses`

## Component
- `src/app/dashboard/courses/page.tsx` -> `src/components/widgets/courses/CourseManagement.tsx`

## API Calls
### Get My Enrollments
- **Endpoint:** `GET /api/v1/courses/my-courses`
- **Function:** `courseServiceApi.getMyEnrollments`
- **Status:** Covered.
- **Notes:** The backend endpoint `GET /api/v1/courses/my-courses` is implemented in `EnrollmentController.java` and returns the correct `EnrollmentResponse` structure. The frontend fallback is a defensive measure.

### Course Details
- **Component:** `CourseDetailModal` (used within `CourseManagement`)
- **API Calls:**
    - **Get Course Details:**
        - **Endpoint:** `GET /api/v1/courses/{id}`
        - **Function:** `courseServiceApi.getCourse`
        - **Status:** Covered.
    - **Get Course Chapters:**
        - **Endpoint:** `GET /api/v1/courses/{id}/chapters`
        - **Function:** `courseServiceApi.getCourseChapters`
        - **Status:** Covered.

## Assessment
The courses route has basic API coverage for listing enrollments. However, it relies on a fallback mechanism, indicating potential backend instability or incompleteness.
