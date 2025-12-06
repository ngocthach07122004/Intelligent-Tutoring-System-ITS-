import axios, { AxiosResponse } from "axios";
import {
    AdminStatsResponse,
    AtRiskListResponse,
    DashboardSummaryResponse,
    HealthStatus,
    InstructorCourseStatsResponse,
    StudentAnalyticsResponse,
    StudentDashboardResponse,
} from "./dashboard-service-interfaces";

const DASHBOARD_SERVICE_BASE_URL = "http://localhost:8181";
const DASHBOARD_API_PREFIX = "/api/v1/dashboard";

const unwrap = (response: AxiosResponse) => ({
    success: response?.data?.success ??
        (response.status >= 200 && response.status < 300),
    message: response.data?.message ?? "Success",
    data: response.data?.body ?? response.data?.data ?? response.data,
    status: response.status,
});

const handleError = (error: any, fallback: string) => {
    console.error(fallback, error?.response?.data);
    return {
        success: false,
        message: error?.response?.data?.message || fallback,
        data: null,
        status: error?.response?.status || 500,
    };
};

export class DashboardServiceApi {
    private baseUrl: string;
    private apiUrl: string;
    private authToken?: string;
    private devUserId?: string;

    constructor(baseUrl = DASHBOARD_SERVICE_BASE_URL) {
        this.baseUrl = baseUrl.replace(/\/$/, "");
        this.apiUrl = `${this.baseUrl}${DASHBOARD_API_PREFIX}`;
    }

    setAuthToken(token?: string) {
        this.authToken = token;
    }

    /**
     * Allows local/testing calls without a JWT using dev headers.
     */
    setDevUserId(userId?: string) {
        this.devUserId = userId;
    }

    private config(params?: Record<string, unknown>) {
        const headers: Record<string, string> = {};
        if (this.authToken) {
            headers.Authorization = `Bearer ${this.authToken}`;
        }
        if (this.devUserId) {
            headers["X-User-Id"] = this.devUserId;
            headers["X-Dev-User-Id"] = this.devUserId;
        }

        return {
            params,
            headers: Object.keys(headers).length ? headers : undefined,
            withCredentials: true,
            validateStatus: (status: number) => status >= 200 && status < 300,
        };
    }

    async health() {
        try {
            const response: AxiosResponse<HealthStatus> = await axios.get(
                `${this.baseUrl}/health`,
                {
                    validateStatus: (status: number) => status >= 200 && status < 300,
                }
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to fetch dashboard-service health");
        }
    }

    async getStudentDashboard() {
        try {
            const response: AxiosResponse<StudentDashboardResponse> = await axios.get(
                `${this.apiUrl}/student`,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to fetch student dashboard");
        }
    }

    async getStudentSummary() {
        try {
            const response: AxiosResponse<DashboardSummaryResponse> = await axios.get(
                `${this.apiUrl}/student/summary`,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to fetch student dashboard summary");
        }
    }

    async getStudentAnalytics() {
        try {
            const response: AxiosResponse<StudentAnalyticsResponse> = await axios.get(
                `${this.apiUrl}/student/analytics`,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to fetch student analytics");
        }
    }

    async getInstructorCourseStats(id: number) {
        try {
            const response: AxiosResponse<InstructorCourseStatsResponse> = await axios.get(
                `${this.apiUrl}/instructor/courses/${id}`,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to fetch instructor course stats");
        }
    }

    async getAtRiskStudents() {
        try {
            const response: AxiosResponse<AtRiskListResponse> = await axios.get(
                `${this.apiUrl}/instructor/at-risk`,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to fetch at-risk students");
        }
    }

    async getAdminStats() {
        try {
            const response: AxiosResponse<AdminStatsResponse> = await axios.get(
                `${this.apiUrl}/admin/stats`,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to fetch admin stats");
        }
    }
}

// Export a singleton instance for convenience
export const dashboardServiceApi = new DashboardServiceApi();
