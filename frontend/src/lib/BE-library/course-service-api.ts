import axios, { AxiosResponse } from "axios";
import {
    HealthStatus,
    CourseListQuery,
    PublishedCourseQuery,
    CourseSearchQuery,
    CreateCourseRequest,
    UpdateCourseRequest,
    CourseResponse,
    CourseStatsResponse,
    CourseStatistics,
    CreateChapterRequest,
    ChapterResponse,
    ReorderChaptersRequest,
    CreateLessonRequest,
    LessonResponse,
    EnrollmentResponse,
    EnrollmentListQuery,
    MyEnrollmentQuery,
    EnrollmentProgressRequest,
    EnrollmentStatusResponse,
} from "./course-service-interfaces";

const COURSE_SERVICE_BASE_URL = "http://localhost:8181/api/v1";

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

export class CourseServiceApi {
    private baseUrl: string;
    private authToken?: string;

    constructor(baseUrl = COURSE_SERVICE_BASE_URL) {
        this.baseUrl = baseUrl;
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
    // Health
    // ==========================================
    async health() {
        try {
            const response: AxiosResponse<HealthStatus> = await axios.get(
                `${this.baseUrl}/health`,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to fetch health status");
        }
    }

    async readiness() {
        try {
            const response: AxiosResponse<HealthStatus> = await axios.get(
                `${this.baseUrl}/health/ready`,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to fetch readiness status");
        }
    }

    async liveness() {
        try {
            const response: AxiosResponse<HealthStatus> = await axios.get(
                `${this.baseUrl}/health/live`,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to fetch liveness status");
        }
    }

    // ==========================================
    // Courses
    // ==========================================

    async createCourse(payload: CreateCourseRequest) {
        try {
            const response: AxiosResponse<CourseResponse> = await axios.post(
                `${this.baseUrl}/courses`,
                payload,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to create course");
        }
    }

    async getCourses(params?: CourseListQuery) {
        try {
            const response: AxiosResponse<CourseResponse[]> = await axios.get(
                `${this.baseUrl}/courses`,
                this.config(params),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to fetch courses");
        }
    }

    async getCourse(id: number) {
        try {
            const response: AxiosResponse<CourseResponse> = await axios.get(
                `${this.baseUrl}/courses/${id}`,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to fetch course");
        }
    }

    async updateCourse(id: number, payload: UpdateCourseRequest) {
        try {
            const response: AxiosResponse<CourseResponse> = await axios.put(
                `${this.baseUrl}/courses/${id}`,
                payload,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to update course");
        }
    }

    async deleteCourse(id: number) {
        try {
            const response: AxiosResponse = await axios.delete(
                `${this.baseUrl}/courses/${id}`,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to delete course");
        }
    }

    async getCoursesByInstructor(instructorId: string, params?: CourseListQuery) {
        try {
            const response: AxiosResponse<CourseResponse[]> = await axios.get(
                `${this.baseUrl}/courses/instructor/${instructorId}`,
                this.config(params),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to fetch instructor courses");
        }
    }

    /**
     * Note: backend uses same path for instructor vs student context.
     * This method is typed for instructor usage returning courses.
     */
    async getMyCourses(params?: CourseListQuery) {
        try {
            const response: AxiosResponse<CourseResponse[]> = await axios.get(
                `${this.baseUrl}/courses/my-courses`,
                this.config(params),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to fetch my courses");
        }
    }

    async getPublishedCourses(params?: PublishedCourseQuery) {
        try {
            const response: AxiosResponse<CourseResponse[]> = await axios.get(
                `${this.baseUrl}/courses/published`,
                this.config(params),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to fetch published courses");
        }
    }

    async searchCourses(params: CourseSearchQuery) {
        try {
            const response: AxiosResponse<CourseResponse[]> = await axios.get(
                `${this.baseUrl}/courses/search`,
                this.config(params),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to search courses");
        }
    }

    async publishCourse(id: number) {
        try {
            const response: AxiosResponse<CourseResponse> = await axios.post(
                `${this.baseUrl}/courses/${id}/publish`,
                {},
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to publish course");
        }
    }

    async archiveCourse(id: number) {
        try {
            const response: AxiosResponse<CourseResponse> = await axios.post(
                `${this.baseUrl}/courses/${id}/archive`,
                {},
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to archive course");
        }
    }

    async getCourseStats(id: number) {
        try {
            const response: AxiosResponse<CourseStatsResponse> = await axios.get(
                `${this.baseUrl}/courses/${id}/stats`,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to fetch course stats");
        }
    }

    // ==========================================
    // Chapters
    // ==========================================

    async createChapter(courseId: number, payload: CreateChapterRequest) {
        try {
            const response: AxiosResponse<ChapterResponse> = await axios.post(
                `${this.baseUrl}/courses/${courseId}/chapters`,
                payload,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to create chapter");
        }
    }

    async getCourseChapters(courseId: number) {
        try {
            const response: AxiosResponse<ChapterResponse[]> = await axios.get(
                `${this.baseUrl}/courses/${courseId}/chapters`,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to fetch course chapters");
        }
    }

    async getChapter(id: number) {
        try {
            const response: AxiosResponse<ChapterResponse> = await axios.get(
                `${this.baseUrl}/chapters/${id}`,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to fetch chapter");
        }
    }

    async updateChapter(id: number, payload: CreateChapterRequest) {
        try {
            const response: AxiosResponse<ChapterResponse> = await axios.put(
                `${this.baseUrl}/chapters/${id}`,
                payload,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to update chapter");
        }
    }

    async deleteChapter(id: number) {
        try {
            const response: AxiosResponse = await axios.delete(
                `${this.baseUrl}/chapters/${id}`,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to delete chapter");
        }
    }

    async reorderChapters(courseId: number, payload: ReorderChaptersRequest) {
        try {
            const response: AxiosResponse<ChapterResponse[]> = await axios.put(
                `${this.baseUrl}/courses/${courseId}/chapters/reorder`,
                payload,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to reorder chapters");
        }
    }

    // ==========================================
    // Lessons
    // ==========================================

    async createLesson(chapterId: number, payload: CreateLessonRequest) {
        try {
            const response: AxiosResponse<LessonResponse> = await axios.post(
                `${this.baseUrl}/chapters/${chapterId}/lessons`,
                payload,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to create lesson");
        }
    }

    async getLessons(chapterId: number) {
        try {
            const response: AxiosResponse<LessonResponse[]> = await axios.get(
                `${this.baseUrl}/chapters/${chapterId}/lessons`,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to fetch lessons");
        }
    }

    async getLesson(id: number) {
        try {
            const response: AxiosResponse<LessonResponse> = await axios.get(
                `${this.baseUrl}/lessons/${id}`,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to fetch lesson");
        }
    }

    async updateLesson(id: number, payload: CreateLessonRequest) {
        try {
            const response: AxiosResponse<LessonResponse> = await axios.put(
                `${this.baseUrl}/lessons/${id}`,
                payload,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to update lesson");
        }
    }

    async deleteLesson(id: number) {
        try {
            const response: AxiosResponse = await axios.delete(
                `${this.baseUrl}/lessons/${id}`,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to delete lesson");
        }
    }

    // ==========================================
    // Enrollments
    // ==========================================

    async enroll(courseId: number) {
        try {
            const response: AxiosResponse<EnrollmentResponse> = await axios.post(
                `${this.baseUrl}/courses/${courseId}/enroll`,
                {},
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to enroll in course");
        }
    }

    /**
     * For student context; backend uses same path as instructor variant.
     */
    async getMyEnrollments(params?: MyEnrollmentQuery) {
        try {
            const response: AxiosResponse<EnrollmentResponse[]> = await axios.get(
                `${this.baseUrl}/courses/my-courses`,
                this.config(params),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to fetch my enrollments");
        }
    }

    async getMyCourseStats() {
        try {
            const response: AxiosResponse<CourseStatistics> = await axios.get(
                `${this.baseUrl}/courses/my-courses/stats`,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to fetch my course stats");
        }
    }

    async getCourseEnrollments(courseId: number, params?: EnrollmentListQuery) {
        try {
            const response: AxiosResponse<EnrollmentResponse[]> = await axios.get(
                `${this.baseUrl}/courses/${courseId}/enrollments`,
                this.config(params),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to fetch course enrollments");
        }
    }

    async updateEnrollmentProgress(enrollmentId: number, progress: number) {
        try {
            const payload: EnrollmentProgressRequest = { progress };
            const response: AxiosResponse<EnrollmentResponse> = await axios.patch(
                `${this.baseUrl}/enrollments/${enrollmentId}/progress`,
                payload,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to update enrollment progress");
        }
    }

    async getEnrollment(enrollmentId: number) {
        try {
            const response: AxiosResponse<EnrollmentResponse> = await axios.get(
                `${this.baseUrl}/enrollments/${enrollmentId}`,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to fetch enrollment");
        }
    }

    async dropEnrollment(enrollmentId: number) {
        try {
            const response: AxiosResponse = await axios.delete(
                `${this.baseUrl}/enrollments/${enrollmentId}`,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to drop enrollment");
        }
    }

    async checkEnrollment(courseId: number) {
        try {
            const response: AxiosResponse<EnrollmentStatusResponse> = await axios.get(
                `${this.baseUrl}/courses/${courseId}/is-enrolled`,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to check enrollment status");
        }
    }

    async getEnrollmentsByStudent(studentId: string) {
        try {
            const response: AxiosResponse<EnrollmentResponse[]> = await axios.get(
                `${this.baseUrl}/enrollments/student/${studentId}`,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to fetch student enrollments");
        }
    }
}

export const courseServiceApi = new CourseServiceApi();s