# Dashboard Performance API Coverage

## Route
- `/dashboard/performance`

## Component
- `src/app/dashboard/performance/page.tsx` -> `src/components/widgets/performance/PerformanceSummary.tsx`

## API Calls
### Student Summary
- **Endpoint:** `GET /api/v1/dashboard/student/summary`
- **Function:** `dashboardServiceApi.getStudentSummary`
- **Status:** Partially Covered (Mock fallback exists).

### Student Analytics
- **Endpoint:** `GET /api/v1/dashboard/student/analytics`
- **Function:** `dashboardServiceApi.getStudentAnalytics`
- **Status:** Partially Covered (Mock fallback exists).

## Assessment
Similar to the Dashboard Home, the Performance route relies on the Dashboard Service APIs which currently have mock data fallbacks in the frontend.
