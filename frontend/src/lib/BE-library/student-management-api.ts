import axios, { AxiosResponse } from "axios";
import {
    Student,
    AcademicRecord,
    LearningAnalytics,
    CurrentSubject,
    Achievement,
    PerformanceRank,
    PerformanceSummary,
    SemesterPerformance,
    PerformanceSkill,
} from "./student-interfaces";
import { UserProfileResponse } from "./interfaces";

// Base URL for user-profile-service (port 8083)
const USER_PROFILE_BASE_URL = "http://localhost:8181/api/v1";

const unwrap = (response: AxiosResponse) => ({
    success: response?.data?.success ??
        (response.status >= 200 && response.status < 300),
    message: response.data?.message ?? "Success",
    data: response.data?.body ?? response.data?.data ?? response.data,
    status: response.status,
});

/**
 * Student Management Operations
 * Integrates with user-profile-service API for student management dashboard
 */
export class StudentManagementOperation {
    private baseUrl: string;
    private authToken?: string;

    constructor() {
        this.baseUrl = USER_PROFILE_BASE_URL;
    }

    setAuthToken(token?: string) {
        this.authToken = token;
    }

    private config(params?: Record<string, unknown>) {
        const headers = this.authToken
            ? { Authorization: `Bearer ${this.authToken}` }
            : undefined;

        return {
            params,
            headers,
            withCredentials: true,
            validateStatus: (status: number) => status >= 200 && status < 300,
        };
    }

    // ==========================================
    // PROFILE ENDPOINTS
    // ==========================================

    /**
     * Get current user's profile
     * GET /api/v1/profile/me
     */
    async getMyProfile() {
        try {
            const response: AxiosResponse<UserProfileResponse> = await axios.get(
                `${this.baseUrl}/profile/me`,
                this.config()
            );
            return unwrap(response);
        } catch (error: any) {
            console.error("Error fetching my profile:", error?.response?.data);
            return {
                success: false,
                message: error?.response?.data?.message || "Failed to fetch profile",
                data: null,
                status: error?.response?.status || 500,
            };
        }
    }

    /**
     * Update current user's profile
     * PUT /api/v1/profile/me
     */
    async updateMyProfile(payload: Partial<UserProfileResponse>) {
        try {
            const response: AxiosResponse<UserProfileResponse> = await axios.put(
                `${this.baseUrl}/profile/me`,
                payload,
                this.config()
            );
            return unwrap(response);
        } catch (error: any) {
            console.error("Error updating profile:", error?.response?.data);
            return {
                success: false,
                message: error?.response?.data?.message || "Failed to update profile",
                data: null,
                status: error?.response?.status || 500,
            };
        }
    }

    // ==========================================
    // STUDENT ENDPOINTS
    // ==========================================

    /**
     * Get student by ID
     * GET /api/v1/students/{id}
     */
    async getStudent(id: string) {
        try {
            const response: AxiosResponse<Student> = await axios.get(
                `${this.baseUrl}/students/${id}`,
                this.config()
            );
            return unwrap(response);
        } catch (error: any) {
            console.error("Error fetching student:", error?.response?.data);
            return {
                success: false,
                message: error?.response?.data?.message || "Failed to fetch student",
                data: null,
                status: error?.response?.status || 500,
            };
        }
    }

    /**
     * Update student profile
     * PUT /api/v1/students/{id}
     */
    async updateStudent(id: string, payload: Student) {
        try {
            const response: AxiosResponse<Student> = await axios.put(
                `${this.baseUrl}/students/${id}`,
                payload,
                this.config()
            );
            return unwrap(response);
        } catch (error: any) {
            console.error("Error updating student:", error?.response?.data);
            return {
                success: false,
                message: error?.response?.data?.message || "Failed to update student",
                data: null,
                status: error?.response?.status || 500,
            };
        }
    }

    /**
     * Get academic history
     * GET /api/v1/students/{id}/academic-history
     */
    async getAcademicHistory(id: string) {
        try {
            const response: AxiosResponse<AcademicRecord[]> = await axios.get(
                `${this.baseUrl}/students/${id}/academic-history`,
                this.config()
            );
            return unwrap(response);
        } catch (error: any) {
            console.error("Error fetching academic history:", error?.response?.data);
            return {
                success: false,
                message: error?.response?.data?.message || "Failed to fetch academic history",
                data: null,
                status: error?.response?.status || 500,
            };
        }
    }

    /**
     * Get learning analytics
     * GET /api/v1/students/{id}/analytics?timeframe={timeframe}
     */
    async getAnalytics(id: string, timeframe?: string) {
        try {
            const params = timeframe ? { timeframe } : {};
            const response: AxiosResponse<LearningAnalytics> = await axios.get(
                `${this.baseUrl}/students/${id}/analytics`,
                this.config(params)
            );
            return unwrap(response);
        } catch (error: any) {
            console.error("Error fetching analytics:", error?.response?.data);
            return {
                success: false,
                message: error?.response?.data?.message || "Failed to fetch analytics",
                data: null,
                status: error?.response?.status || 500,
            };
        }
    }

    /**
     * Get current subjects
     * GET /api/v1/students/{id}/subjects
     */
    async getSubjects(id: string) {
        try {
            const response: AxiosResponse<CurrentSubject[]> = await axios.get(
                `${this.baseUrl}/students/${id}/subjects`,
                this.config()
            );
            return unwrap(response);
        } catch (error: any) {
            console.error("Error fetching subjects:", error?.response?.data);
            return {
                success: false,
                message: error?.response?.data?.message || "Failed to fetch subjects",
                data: null,
                status: error?.response?.status || 500,
            };
        }
    }

    /**
     * Get subject detail
     * GET /api/v1/students/{id}/subjects/{subjectId}
     */
    async getSubjectDetail(id: string, subjectId: string) {
        try {
            const response: AxiosResponse<CurrentSubject> = await axios.get(
                `${this.baseUrl}/students/${id}/subjects/${subjectId}`,
                this.config()
            );
            return unwrap(response);
        } catch (error: any) {
            console.error("Error fetching subject detail:", error?.response?.data);
            return {
                success: false,
                message: error?.response?.data?.message || "Failed to fetch subject detail",
                data: null,
                status: error?.response?.status || 500,
            };
        }
    }

    /**
     * Get achievements
     * GET /api/v1/students/{id}/achievements
     */
    async getAchievements(id: string) {
        try {
            const response: AxiosResponse<Achievement[]> = await axios.get(
                `${this.baseUrl}/students/${id}/achievements`,
                this.config()
            );
            return unwrap(response);
        } catch (error: any) {
            console.error("Error fetching achievements:", error?.response?.data);
            return {
                success: false,
                message: error?.response?.data?.message || "Failed to fetch achievements",
                data: null,
                status: error?.response?.status || 500,
            };
        }
    }

    // ==========================================
    // PERFORMANCE ENDPOINTS
    // ==========================================

    /**
     * Get performance summary
     * GET /api/v1/performance/summary
     */
    async getPerformanceSummary() {
        try {
            const response: AxiosResponse<PerformanceSummary> = await axios.get(
                `${this.baseUrl}/performance/summary`,
                this.config()
            );
            return unwrap(response);
        } catch (error: any) {
            console.error("Error fetching performance summary:", error?.response?.data);
            return {
                success: false,
                message: error?.response?.data?.message || "Failed to fetch performance summary",
                data: null,
                status: error?.response?.status || 500,
            };
        }
    }

    /**
     * Get semester performance
     * GET /api/v1/performance/semesters
     */
    async getSemesterPerformance() {
        try {
            const response: AxiosResponse<SemesterPerformance[]> = await axios.get(
                `${this.baseUrl}/performance/semesters`,
                this.config()
            );
            return unwrap(response);
        } catch (error: any) {
            console.error("Error fetching semester performance:", error?.response?.data);
            return {
                success: false,
                message: error?.response?.data?.message || "Failed to fetch semester performance",
                data: null,
                status: error?.response?.status || 500,
            };
        }
    }

    /**
     * Get performance skills
     * GET /api/v1/performance/skills
     */
    async getPerformanceSkills() {
        try {
            const response: AxiosResponse<PerformanceSkill[]> = await axios.get(
                `${this.baseUrl}/performance/skills`,
                this.config()
            );
            return unwrap(response);
        } catch (error: any) {
            console.error("Error fetching performance skills:", error?.response?.data);
            return {
                success: false,
                message: error?.response?.data?.message || "Failed to fetch performance skills",
                data: null,
                status: error?.response?.status || 500,
            };
        }
    }
}

// Export singleton instance
export const studentManagementOps = new StudentManagementOperation();