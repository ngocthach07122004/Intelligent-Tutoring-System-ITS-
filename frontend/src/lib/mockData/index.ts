// Central export for all mock data

// Dashboard
export * from "./dashboard.types";
export * from "./dashboard.mock";
// Courses
export * from "./courses.mock";
// Performance
export * from "./performance.mock";
// Documents
export * from "./documents.mock";

// Re-export commonly used types
export type {
  DashboardSummaryResponse,
  StudentAnalyticsResponse,
  StudentDashboardResponse,
} from "./dashboard.types";
