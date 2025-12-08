# Dashboard Home API Coverage

## Route
- `/dashboard/home`

## Component
- `src/app/dashboard/home/page.tsx` -> `src/screens/HomeScreen.tsx`

## API Calls
### Student Summary
- **Endpoint:** `GET /api/v1/dashboard/student/summary`
- **Function:** `dashboardServiceApi.getStudentSummary`
- **Status:** Partially Covered (Mock fallback exists).
- **Notes:** The frontend has a mock fallback if the backend is offline or fails.

### Student Analytics
- **Endpoint:** `GET /api/v1/dashboard/student/analytics`
- **Function:** `dashboardServiceApi.getStudentAnalytics`
- **Status:** Partially Covered (Mock fallback exists).
- **Notes:** The frontend has a mock fallback if the backend is offline or fails.

## Assessment
The dashboard home screen has API calls wired up, but relies on mock data fallbacks, suggesting the backend endpoints might not be fully stable or implemented yet.
