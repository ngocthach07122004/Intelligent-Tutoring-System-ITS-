// Dashboard Service interfaces for dashboard-service API

import { UserProfileResponse, EnrollmentResponse, GradebookSummaryResponse } from "./interfaces";
import { Achievement } from "./student-interfaces";

export interface HealthStatus {
    status?: string;
    service?: string;
}

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";
export type RiskTrend = "STABLE" | "INCREASING" | "DECREASING";

export interface StudentDashboardSummary {
    coursesInProgress?: number;
    nextAssignmentDue?: string;
}

export interface RiskProfile {
    level?: RiskLevel;
    trend?: RiskTrend;
}

export interface StudentDashboardResponse {
    summary?: StudentDashboardSummary;
    riskProfile?: RiskProfile;
    skillRadar?: Record<string, number>;
}

export interface CourseStats {
    totalCourses?: number;
    inProgressCourses?: number;
    completedCourses?: number;
    averageProgress?: number;
}

export interface DashboardSummaryResponse {
    profile?: UserProfileResponse;
    courses?: EnrollmentResponse[];
    courseStats?: CourseStats;
    performance?: GradebookSummaryResponse;
    achievements?: Achievement[];
    achievementsCount?: number;
    totalLearningHours?: number;
    upcomingAssignments?: number;
}

export type TrendDirection = "up" | "down" | "stable";

export interface AcademicProgress {
    currentGPA?: number;
    previousGPA?: number;
    trend?: TrendDirection;
    percentChange?: number;
}

export interface SubjectPerformance {
    name?: string;
    currentScore?: number;
    previousScore?: number;
    trend?: TrendDirection;
    percentChange?: number;
    color?: string;
}

export interface ExamScore {
    month?: string;
    score?: number;
    average?: number;
}

export interface LearningTime {
    week?: string;
    hours?: number;
}

export interface StudentAnalyticsResponse {
    academicProgress?: AcademicProgress;
    subjectPerformance?: SubjectPerformance[];
    attendanceRate?: number;
    assignmentCompletion?: number;
    examScores?: ExamScore[];
    learningTime?: LearningTime[];
    strengths?: string[];
    improvements?: string[];
}

export interface InstructorCourseStatsResponse {
    averageScore?: number;
    atRiskCount?: number;
    completionRate?: number;
}

export interface AtRiskStudentDTO {
    studentId?: string;
    studentName?: string;
    riskLevel?: RiskLevel;
    reasons?: string[];
}

export interface AtRiskListResponse {
    students?: AtRiskStudentDTO[];
}

export interface AdminStatsResponse {
    activeUsers?: number;
    revenueThisMonth?: number;
    totalCourses?: number;
    systemHealth?: string;
}