# Dashboard Learning API Coverage

## Route
- `/dashboard/learning`

## Component
- `src/app/dashboard/learning/page.tsx`

## API Calls
### Get Published Courses
- **Endpoint:** `GET /api/v1/courses/published`
- **Function:** `courseServiceApi.getPublishedCourses`
- **Status:** Partially Covered (Mock fallback exists).
- **Notes:** 
    - The component explicitly handles "Backend offline, using mock data".
    - Several fields used in the UI are noted as `// Not in API`: `department`, `rating`, `reviews`.
    - `level` is hardcoded to 'Intermediate' or derived from tags.

## Assessment
The learning route has significant gaps. While it calls `getPublishedCourses`, the API response seems to lack several fields required by the UI design (department, rating, reviews), and the component relies heavily on mock data fallbacks.
