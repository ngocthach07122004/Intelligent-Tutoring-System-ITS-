import axios, { AxiosResponse } from "axios";
import {
    AchievementResponse,
    AnalyticsResponse,
    AssessmentSkillResponse,
    AttemptResultResponse,
    AttemptStartResponse,
    AttemptSubmitRequest,
    AttemptSubmitResponse,
    DocumentListQuery,
    DocumentRequest,
    DocumentResponse,
    DocumentStatisticsResponse,
    ExamConfigRequest,
    ExamConfigResponse,
    GradebookHistoryResponse,
    GradebookListQuery,
    GradebookResponse,
    GradebookSummaryQuery,
    GradebookSummaryResponse,
    GradebookSummaryV2Response,
    HealthStatus,
    QuestionPoolRequest,
    QuestionPoolResponse,
    QuestionRequest,
    QuestionResponse,
    SkillRadarResponse,
    FavoriteToggleRequest,
} from "./assessment-service-interfaces";

const ASSESSMENT_SERVICE_BASE_URL = "http://localhost:8181";

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

export class AssessmentServiceApi {
    private baseUrl: string;
    private authToken?: string;
    private devUserId?: string;

    constructor(baseUrl = ASSESSMENT_SERVICE_BASE_URL) {
        this.baseUrl = baseUrl.replace(/\/$/, "");
    }

    setAuthToken(token?: string) {
        this.authToken = token;
    }

    /**
     * Allows local/dev calls without a JWT by sending dev headers.
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

    // ==========================================
    // Health
    // ==========================================

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
            return handleError(error, "Failed to fetch assessment-service health");
        }
    }

    // ==========================================
    // Gradebook & Analytics
    // ==========================================

    async getMyGradebookSummary(params?: GradebookSummaryQuery) {
        try {
            const response: AxiosResponse<GradebookSummaryResponse> = await axios.get(
                `${this.baseUrl}/api/v1/assessment/gradebook/summary`,
                this.config(params),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to fetch gradebook summary");
        }
    }

    async getGradebookSummaryV2(params?: GradebookSummaryQuery) {
        try {
            const response: AxiosResponse<GradebookSummaryV2Response> = await axios.get(
                `${this.baseUrl}/api/v1/assessment/gradebook/summary/v2`,
                this.config(params),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to fetch gradebook summary v2");
        }
    }

    async getGradebookHistory(studentId: string) {
        try {
            const response: AxiosResponse<GradebookHistoryResponse> = await axios.get(
                `${this.baseUrl}/api/v1/assessment/gradebook/history/${studentId}`,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to fetch gradebook history");
        }
    }

    async getAnalytics(studentId?: string) {
        try {
            const response: AxiosResponse<AnalyticsResponse> = await axios.get(
                `${this.baseUrl}/api/v1/assessment/analytics`,
                this.config(studentId ? { studentId } : undefined),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to fetch assessment analytics");
        }
    }

    // ==========================================
    // Achievements
    // ==========================================

    async getAchievements() {
        try {
            const response: AxiosResponse<AchievementResponse[]> = await axios.get(
                `${this.baseUrl}/api/v1/assessment/achievements`,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to fetch achievements");
        }
    }

    async awardAchievement(code: string) {
        try {
            const response: AxiosResponse = await axios.post(
                `${this.baseUrl}/api/v1/assessment/achievements/${code}/award`,
                {},
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to award achievement");
        }
    }

    // ==========================================
    // Exams & Attempts
    // ==========================================

    async startExamAttempt(configId: number) {
        try {
            const response: AxiosResponse<AttemptStartResponse> = await axios.post(
                `${this.baseUrl}/api/v1/exams/${configId}/start`,
                {},
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to start exam attempt");
        }
    }

    async submitAttempt(id: number, payload: AttemptSubmitRequest) {
        try {
            const response: AxiosResponse<AttemptSubmitResponse> = await axios.post(
                `${this.baseUrl}/api/v1/attempts/${id}/submit`,
                payload,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to submit attempt");
        }
    }

    async getAttemptResult(id: number) {
        try {
            const response: AxiosResponse<AttemptResultResponse> = await axios.get(
                `${this.baseUrl}/api/v1/attempts/${id}/result`,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to fetch attempt result");
        }
    }

    async createExamConfig(payload: ExamConfigRequest) {
        try {
            const response: AxiosResponse<ExamConfigResponse> = await axios.post(
                `${this.baseUrl}/api/v1/exams`,
                payload,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to create exam configuration");
        }
    }

    async updateExamConfig(id: number, payload: ExamConfigRequest) {
        try {
            const response: AxiosResponse<ExamConfigResponse> = await axios.put(
                `${this.baseUrl}/api/v1/exams/${id}`,
                payload,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to update exam configuration");
        }
    }

    async getExamConfig(id: number) {
        try {
            const response: AxiosResponse<ExamConfigResponse> = await axios.get(
                `${this.baseUrl}/api/v1/exams/${id}`,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to fetch exam configuration");
        }
    }

    async deleteExamConfig(id: number) {
        try {
            const response: AxiosResponse = await axios.delete(
                `${this.baseUrl}/api/v1/exams/${id}`,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to delete exam configuration");
        }
    }

    // ==========================================
    // Gradebook by course/student
    // ==========================================

    async getCourseGrades(courseId: number, params?: GradebookListQuery) {
        try {
            const response: AxiosResponse<GradebookResponse[]> = await axios.get(
                `${this.baseUrl}/api/v1/gradebook/courses/${courseId}`,
                this.config(params),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to fetch course grades");
        }
    }

    async getMyCourseGrades(courseId: number, params?: GradebookListQuery) {
        try {
            const response: AxiosResponse<GradebookResponse[]> = await axios.get(
                `${this.baseUrl}/api/v1/gradebook/my/courses/${courseId}`,
                this.config(params),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to fetch my course grades");
        }
    }

    async getStudentCourseGrades(studentId: string, courseId: number, params?: GradebookListQuery) {
        try {
            const response: AxiosResponse<GradebookResponse[]> = await axios.get(
                `${this.baseUrl}/api/v1/gradebook/student/${studentId}/course/${courseId}`,
                this.config(params),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to fetch student course grades");
        }
    }

    async getStudentGradebookHistory(studentId: string) {
        try {
            const response: AxiosResponse<GradebookHistoryResponse> = await axios.get(
                `${this.baseUrl}/api/v1/gradebook/student/${studentId}/history`,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to fetch student gradebook history");
        }
    }

    async getStudentAnalytics(studentId: string, timeframe?: string) {
        try {
            const response: AxiosResponse<AnalyticsResponse> = await axios.get(
                `${this.baseUrl}/api/v1/gradebook/student/${studentId}/analytics`,
                this.config(timeframe ? { timeframe } : undefined),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to fetch student analytics");
        }
    }

    async getStudentGradebookSummary(studentId: string) {
        try {
            const response: AxiosResponse<GradebookSummaryResponse> = await axios.get(
                `${this.baseUrl}/api/v1/gradebook/student/${studentId}/summary`,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to fetch student gradebook summary");
        }
    }

    // ==========================================
    // Documents
    // ==========================================

    async getDocumentStats() {
        try {
            const response: AxiosResponse<DocumentStatisticsResponse> = await axios.get(
                `${this.baseUrl}/api/v1/documents/stats`,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to fetch document statistics");
        }
    }

    async listDocuments(params?: DocumentListQuery) {
        try {
            const response: AxiosResponse<DocumentResponse[]> = await axios.get(
                `${this.baseUrl}/api/v1/documents`,
                this.config(params),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to fetch documents");
        }
    }

    async createDocument(payload: DocumentRequest) {
        try {
            const response: AxiosResponse<DocumentResponse> = await axios.post(
                `${this.baseUrl}/api/v1/documents`,
                payload,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to create document");
        }
    }

    async getDocument(id: string) {
        try {
            const response: AxiosResponse<DocumentResponse> = await axios.get(
                `${this.baseUrl}/api/v1/documents/${id}`,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to fetch document");
        }
    }

    async updateDocument(id: string, payload: DocumentRequest) {
        try {
            const response: AxiosResponse<DocumentResponse> = await axios.put(
                `${this.baseUrl}/api/v1/documents/${id}`,
                payload,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to update document");
        }
    }

    async deleteDocument(id: string) {
        try {
            const response: AxiosResponse = await axios.delete(
                `${this.baseUrl}/api/v1/documents/${id}`,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to delete document");
        }
    }

    async toggleFavorite(id: string, payload: FavoriteToggleRequest) {
        try {
            const response: AxiosResponse<DocumentResponse> = await axios.patch(
                `${this.baseUrl}/api/v1/documents/${id}/favorite`,
                payload,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to toggle favorite");
        }
    }

    // ==========================================
    // Questions & Pools
    // ==========================================

    async createQuestionPool(payload: QuestionPoolRequest) {
        try {
            const response: AxiosResponse<QuestionPoolResponse> = await axios.post(
                `${this.baseUrl}/api/v1/pools`,
                payload,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to create question pool");
        }
    }

    async updateQuestionPool(id: number, payload: QuestionPoolRequest) {
        try {
            const response: AxiosResponse<QuestionPoolResponse> = await axios.put(
                `${this.baseUrl}/api/v1/pools/${id}`,
                payload,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to update question pool");
        }
    }

    async getQuestionPool(id: number) {
        try {
            const response: AxiosResponse<QuestionPoolResponse> = await axios.get(
                `${this.baseUrl}/api/v1/pools/${id}`,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to fetch question pool");
        }
    }

    async deleteQuestionPool(id: number) {
        try {
            const response: AxiosResponse = await axios.delete(
                `${this.baseUrl}/api/v1/pools/${id}`,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to delete question pool");
        }
    }

    async getMyQuestionPools() {
        try {
            const response: AxiosResponse<QuestionPoolResponse[]> = await axios.get(
                `${this.baseUrl}/api/v1/pools/my`,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to fetch my question pools");
        }
    }

    async createQuestion(payload: QuestionRequest) {
        try {
            const response: AxiosResponse<QuestionResponse> = await axios.post(
                `${this.baseUrl}/api/v1/questions`,
                payload,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to create question");
        }
    }

    async getQuestion(id: number) {
        try {
            const response: AxiosResponse<QuestionResponse> = await axios.get(
                `${this.baseUrl}/api/v1/questions/${id}`,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to fetch question");
        }
    }

    async updateQuestion(id: number, payload: QuestionRequest) {
        try {
            const response: AxiosResponse<QuestionResponse> = await axios.put(
                `${this.baseUrl}/api/v1/questions/${id}`,
                payload,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to update question");
        }
    }

    async deleteQuestion(id: number) {
        try {
            const response: AxiosResponse = await axios.delete(
                `${this.baseUrl}/api/v1/questions/${id}`,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to delete question");
        }
    }

    async getQuestionsByPool(poolId: number) {
        try {
            const response: AxiosResponse<QuestionResponse[]> = await axios.get(
                `${this.baseUrl}/api/v1/questions/pool/${poolId}`,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to fetch questions by pool");
        }
    }

    // ==========================================
    // Skills
    // ==========================================

    async getSkillRadar(studentId?: string) {
        try {
            const response: AxiosResponse<SkillRadarResponse> = await axios.get(
                `${this.baseUrl}/api/v1/assessment/skills`,
                this.config(studentId ? { studentId } : undefined),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to fetch skill radar");
        }
    }

    async getUserSkills(userId: string) {
        try {
            const response: AxiosResponse<AssessmentSkillResponse> = await axios.get(
                `${this.baseUrl}/api/v1/assessment/skills/${userId}`,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to fetch user skills");
        }
    }
}

export const assessmentServiceApi = new AssessmentServiceApi();