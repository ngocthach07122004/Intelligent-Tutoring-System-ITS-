import axios, { AxiosResponse } from "axios";
import {
  LoginPayload, SignUpPayload, ResetPasswordPayload,
  Page, PageableParams, CourseResponse, CreateCourseRequest,
  EnrollmentResponse,
  UserProfileRequest,
  UserProfileResponse,
  SkillRequest,
  SkillResponse,
  ScheduleRequest,
  ScheduleResponse,
  GroupRequest,
  GroupResponse,
  PromoteMemberRequest,
  JoinGroupRequest,
  GroupMemberResponse,
  StudentDashboardResponse,
  DashboardSummaryResponse,
  StudentAnalyticsResponse,
  InstructorCourseStatsResponse,
  AtRiskListResponse,
  AdminStatsResponse,
} from "./interfaces";

/*
  HƯỚNG DẪN LẮP API (DEV / INTEGRATION)

  1) Tải tsc và tạo file env cho NEXT_PUBLIC_IDENTITY_API_BASE_URL
  2) Viết code theo mẫu trong class AuthOperation bên dưới
  4) Viết type cho payload request và response trong file interfaces.ts
  5) Chạy lệnh: 
    cd frontend/src/lib/BE-library
    tsc main.ts
  6) Import và sử dụng class đã viết trong codebase frontend (tham khảo file signup/page.tsx)
*/

const BASE_URL = "http://localhost:8181/api/v1";

const unwrap = (response: AxiosResponse) => ({
  success: response?.data?.success ??
    (response.status >= 200 && response.status < 300),
  message: response.data?.message ?? "Success",
  data: response.data?.body ?? response.data?.data ?? response.data,
  status: response.status,
});

export class AuthOperation {
  private baseUrl: string;

  constructor() {
    this.baseUrl = BASE_URL + "/auth";
  }

  async signup(payload: SignUpPayload) {
    try {
      const response: AxiosResponse = await axios.post(
        `${this.baseUrl}/register`,
        payload,
        {
          withCredentials: true,
          validateStatus: (status) => status >= 200 && status < 300,
        }
      );
      return unwrap(response);
    } catch (error: any) {
      console.error("Error signing up: ", error?.response?.data);
      return {
        success: false,
        message: error?.response?.data?.message || "An error occurred",
      };
    }
  }

  async signin(payload: LoginPayload) {
    try {
      const response: AxiosResponse = await axios.post(
        `${this.baseUrl}/login`,
        payload,
        {
          withCredentials: true,
          validateStatus: (status) => status >= 200 && status < 300,
        }
      );
      return unwrap(response);
    } catch (error: any) {
      console.error("Error signing in: ", error?.response?.data);
      return {
        success: false,
        message: error?.response?.data?.message || "An error occurred",
      };
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const response: AxiosResponse = await axios.post(
        `${this.baseUrl}/refresh`,
        { refreshToken },
        {
          withCredentials: true,
          validateStatus: (status) => status >= 200 && status < 300,
        }
      );
      return unwrap(response);
    } catch (error: any) {
      console.error("Error refreshing token: ", error?.response?.data);
      return {
        success: false,
        message: error?.response?.data?.message || "An error occurred",
      };
    }
  }

  async logout(refreshToken?: string) {
    try {
      const response: AxiosResponse = await axios.post(
        `${this.baseUrl}/logout`,
        refreshToken ? { refreshToken } : {},
        {
          withCredentials: true,
          validateStatus: (status) => status >= 200 && status < 300,
        }
      );
      return unwrap(response);
    } catch (error: any) {
      console.error("Error logging out: ", error?.response?.data);
      return {
        success: false,
        message: error?.response?.data?.message || "An error occurred",
      };
    }
  }

  async resetPassword(payload: ResetPasswordPayload) {
    try {
      const response: AxiosResponse = await axios.post(
        `${this.baseUrl}/reset-password`,
        payload,
        {
          withCredentials: true,
          validateStatus: (status) => status >= 200 && status < 300,
        }
      );
      return unwrap(response);
    } catch (error: any) {
      console.error("Error resetting password: ", error?.response?.data);
      return {
        success: false,
        message: error?.response?.data?.message || "An error occurred",
      };
    }
  }

  async listSessions(username: string) {
    try {
      const response: AxiosResponse = await axios.get(
        `${this.baseUrl}/sessions/${username}`,
        {
          withCredentials: true,
          validateStatus: (status) => status >= 200 && status < 300,
        }
      );
      return unwrap(response);
    } catch (error: any) {
      console.error("Error fetching sessions: ", error?.response?.data);
      return {
        success: false,
        message: error?.response?.data?.message || "An error occurred",
      };
    }
  }

  async revokeSession(id: number) {
    try {
      const response: AxiosResponse = await axios.delete(
        `${this.baseUrl}/sessions/${id}`,
        {
          withCredentials: true,
          validateStatus: (status) => status >= 200 && status < 300,
        }
      );
      return unwrap(response);
    } catch (error: any) {
      console.error("Error revoking session: ", error?.response?.data);
      return {
        success: false,
        message: error?.response?.data?.message || "An error occurred",
      };
    }
  }
}

export class UserOperation {
  private baseUrl: string;

  constructor() {
    this.baseUrl = BASE_URL + "/user";
  }

  async getAuthenticatedInfo() {
    try {
      const response: AxiosResponse = await axios.get(`${this.baseUrl}/me`, {
        withCredentials: true,
        validateStatus: (status) => status >= 200 && status < 300,
      });

      return unwrap(response);
    } catch (error: any) {
      console.error("Error fetching authenticated user info: ", error?.response?.data);
      return {
        success: false,
        message: error?.response?.data?.message || "An error occurred",
      };
    }
  }
}

export class CourseOperation {
  private baseUrl: string;

  constructor() {
    this.baseUrl = BASE_URL;
  }

  async getAllCourses(
    pageable: PageableParams,
    semester?: string,
    enrollmentStatus?: string
  ) {
    try {
      const response: AxiosResponse<Page<CourseResponse>> = await axios.get(
        `${this.baseUrl}/courses`,
        {
          params: { ...pageable, semester, enrollmentStatus },
          withCredentials: true,
          validateStatus: (status) => status >= 200 && status < 300,
        }
      );
      return unwrap(response);
    } catch (error: any) {
      console.error("Error fetching all courses: ", error?.response?.data);
      return {
        success: false,
        message: error?.response?.data?.message || "An error occurred",
      };
    }
  }

  async createCourse(payload: CreateCourseRequest) {
    try {
      const response: AxiosResponse<CourseResponse> = await axios.post(
        `${this.baseUrl}/courses`,
        payload,
        {
          withCredentials: true,
          validateStatus: (status) => status >= 200 && status < 300,
        }
      );
      return unwrap(response);
    } catch (error: any) {
      console.error("Error creating course: ", error?.response?.data);
      return {
        success: false,
        message: error?.response?.data?.message || "An error occurred",
      };
    }
  }

  async getCourseById(id: number) {
    try {
      const response: AxiosResponse<CourseResponse> = await axios.get(
        `${this.baseUrl}/courses/${id}`,
        {
          withCredentials: true,
          validateStatus: (status) => status >= 200 && status < 300,
        }
      );
      return unwrap(response);
    } catch (error: any) {
      console.error("Error fetching course by id: ", error?.response?.data);
      return {
        success: false,
        message: error?.response?.data?.message || "An error occurred",
      };
    }
  }

  async getMyCourses(status?: string) {
    try {
      const response: AxiosResponse<EnrollmentResponse[]> = await axios.get(
        `${this.baseUrl}/courses/my-courses`,
        {
          params: { status },
          withCredentials: true,
          validateStatus: (status) => status >= 200 && status < 300,
        }
      );
      return unwrap(response);
    } catch (error: any) {
      console.error("Error fetching my courses: ", error?.response?.data);
      return {
        success: false,
        message: error?.response?.data?.message || "An error occurred",
        data: null
      };
    }
  }
}

export class ProfileOperation {
  private baseUrl: string;

  constructor() {
    this.baseUrl = BASE_URL; // BASE_URL = http://localhost:8080/api/v1
  }

  // ==========================================
  // USER PROFILE CONTROLLER
  // ==========================================

  async getMyProfile() {
    try {
      const response: AxiosResponse<UserProfileResponse> = await axios.get(
        `${this.baseUrl}/profile/me`,
        {
          withCredentials: true,
          validateStatus: (status) => status >= 200 && status < 300,
        }
      );
      return unwrap(response);
    } catch (error: any) {
      console.error("Error fetching user profile: ", error?.response?.data);
      return {
        success: false,
        message: error?.response?.data?.message || "An error occurred",
        data: null,
        status: error?.response?.status || 500,
      };
    }
  }

  async updateMyProfile(payload: UserProfileRequest) {
    try {
      const response: AxiosResponse<UserProfileResponse> = await axios.put(
        `${this.baseUrl}/profile/me`,
        payload,
        {
          withCredentials: true,
          validateStatus: (status) => status >= 200 && status < 300,
        }
      );
      return unwrap(response);
    } catch (error: any) {
      console.error("Error updating user profile: ", error?.response?.data);
      return {
        success: false,
        message: error?.response?.data?.message || "An error occurred",
        data: null,
        status: error?.response?.status || 500,
      };
    }
  }

  async getProfile(userId: string) {
    try {
      const response: AxiosResponse<UserProfileResponse> = await axios.get(
        `${this.baseUrl}/profile/${userId}`,
        {
          withCredentials: true,
          validateStatus: (status) => status >= 200 && status < 300,
        }
      );
      return unwrap(response);
    } catch (error: any) {
      console.error("Error fetching user profile by ID: ", error?.response?.data);
      return {
        success: false,
        message: error?.response?.data?.message || "An error occurred",
        data: null,
        status: error?.response?.status || 500,
      };
    }
  }

  async getProfiles(ids: string[]) {
    try {
      const response: AxiosResponse<UserProfileResponse[]> = await axios.get(
        `${this.baseUrl}/profile/users`,
        {
          params: { ids },
          withCredentials: true,
          validateStatus: (status) => status >= 200 && status < 300,
        }
      );
      return unwrap(response);
    } catch (error: any) {
      console.error("Error fetching user profiles by IDs: ", error?.response?.data);
      return {
        success: false,
        message: error?.response?.data?.message || "An error occurred",
        data: null,
        status: error?.response?.status || 500,
      };
    }
  }

  // ==========================================
  // SKILL CONTROLLER
  // ==========================================

  async getMySkills() {
    try {
      const response: AxiosResponse<SkillResponse[]> = await axios.get(
        `${this.baseUrl}/profile/skills`,
        {
          withCredentials: true,
          validateStatus: (status) => status >= 200 && status < 300,
        }
      );
      return unwrap(response);
    } catch (error: any) {
      console.error("Error fetching user skills: ", error?.response?.data);
      return {
        success: false,
        message: error?.response?.data?.message || "An error occurred",
        data: null,
        status: error?.response?.status || 500,
      };
    }
  }

  async addSkill(payload: SkillRequest) {
    try {
      const response: AxiosResponse<SkillResponse> = await axios.post(
        `${this.baseUrl}/profile/skills`,
        payload,
        {
          withCredentials: true,
          validateStatus: (status) => status >= 200 && status < 300,
        }
      );
      return unwrap(response);
    } catch (error: any) {
      console.error("Error adding skill: ", error?.response?.data);
      return {
        success: false,
        message: error?.response?.data?.message || "An error occurred",
        data: null,
        status: error?.response?.status || 500,
      };
    }
  }

  async updateSkill(skillId: number, payload: SkillRequest) {
    try {
      const response: AxiosResponse<SkillResponse> = await axios.put(
        `${this.baseUrl}/profile/skills/${skillId}`,
        payload,
        {
          withCredentials: true,
          validateStatus: (status) => status >= 200 && status < 300,
        }
      );
      return unwrap(response);
    } catch (error: any) {
      console.error("Error updating skill: ", error?.response?.data);
      return {
        success: false,
        message: error?.response?.data?.message || "An error occurred",
        data: null,
        status: error?.response?.status || 500,
      };
    }
  }

  async deleteSkill(skillId: number) {
    try {
      const response: AxiosResponse = await axios.delete(
        `${this.baseUrl}/profile/skills/${skillId}`,
        {
          withCredentials: true,
          validateStatus: (status) => status >= 200 && status < 300,
        }
      );
      return unwrap(response);
    } catch (error: any) {
      console.error("Error deleting skill: ", error?.response?.data);
      return {
        success: false,
        message: error?.response?.data?.message || "An error occurred",
        data: null,
        status: error?.response?.status || 500,
      };
    }
  }

  async getUserSkills(userId: string, category?: string) {
    try {
      const response: AxiosResponse<SkillResponse[]> = await axios.get(
        `${this.baseUrl}/profile/${userId}/skills`,
        {
          params: { category },
          withCredentials: true,
          validateStatus: (status) => status >= 200 && status < 300,
        }
      );
      return unwrap(response);
    } catch (error: any) {
      console.error("Error fetching user skills by ID: ", error?.response?.data);
      return {
        success: false,
        message: error?.response?.data?.message || "An error occurred",
        data: null,
        status: error?.response?.status || 500,
      };
    }
  }


  // ==========================================
  // SCHEDULE CONTROLLER
  // ==========================================

  async getMySchedule(from: string, to: string) {
    try {
      const response: AxiosResponse<ScheduleResponse[]> = await axios.get(
        `${this.baseUrl}/schedules`,
        {
          params: { from, to },
          withCredentials: true,
          validateStatus: (status) => status >= 200 && status < 300,
        }
      );
      return unwrap(response);
    } catch (error: any) {
      console.error("Error fetching schedule: ", error?.response?.data);
      return {
        success: false,
        message: error?.response?.data?.message || "An error occurred",
        data: null,
        status: error?.response?.status || 500,
      };
    }
  }

  async createSlot(payload: ScheduleRequest) {
    try {
      const response: AxiosResponse<ScheduleResponse> = await axios.post(
        `${this.baseUrl}/schedules`,
        payload,
        {
          withCredentials: true,
          validateStatus: (status) => status >= 200 && status < 300,
        }
      );
      return unwrap(response);
    } catch (error: any) {
      console.error("Error creating schedule slot: ", error?.response?.data);
      return {
        success: false,
        message: error?.response?.data?.message || "An error occurred",
        data: null,
        status: error?.response?.status || 500,
      };
    }
  }

  async deleteSlot(id: number) {
    try {
      const response: AxiosResponse = await axios.delete(
        `${this.baseUrl}/schedules/${id}`,
        {
          withCredentials: true,
          validateStatus: (status) => status >= 200 && status < 300,
        }
      );
      return unwrap(response);
    } catch (error: any) {
      console.error("Error deleting schedule slot: ", error?.response?.data);
      return {
        success: false,
        message: error?.response?.data?.message || "An error occurred",
        data: null,
        status: error?.response?.status || 500,
      };
    }
  }

  // ==========================================
  // GROUP CONTROLLER
  // ==========================================

  async getMyGroups(role?: 'LEADER' | 'MEMBER') {
    try {
      const response: AxiosResponse<GroupResponse[]> = await axios.get(
        `${this.baseUrl}/groups`,
        {
          params: { role },
          withCredentials: true,
          validateStatus: (status) => status >= 200 && status < 300,
        }
      );
      return unwrap(response);
    } catch (error: any) {
      console.error("Error fetching user groups: ", error?.response?.data);
      return {
        success: false,
        message: error?.response?.data?.message || "An error occurred",
        data: null,
        status: error?.response?.status || 500,
      };
    }
  }

  async createGroup(payload: GroupRequest) {
    try {
      const response: AxiosResponse<GroupResponse> = await axios.post(
        `${this.baseUrl}/groups`,
        payload,
        {
          withCredentials: true,
          validateStatus: (status) => status >= 200 && status < 300,
        }
      );
      return unwrap(response);
    } catch (error: any) {
      console.error("Error creating group: ", error?.response?.data);
      return {
        success: false,
        message: error?.response?.data?.message || "An error occurred",
        data: null,
        status: error?.response?.status || 500,
      };
    }
  }

  async joinGroup(payload: JoinGroupRequest) {
    try {
      const response: AxiosResponse = await axios.post(
        `${this.baseUrl}/groups/join`,
        payload,
        {
          withCredentials: true,
          validateStatus: (status) => status >= 200 && status < 300,
        }
      );
      return unwrap(response);
    } catch (error: any) {
      console.error("Error joining group: ", error?.response?.data);
      return {
        success: false,
        message: error?.response?.data?.message || "An error occurred",
        data: null,
        status: error?.response?.status || 500,
      };
    }
  }

  async getGroupMembers(id: number) {
    try {
      const response: AxiosResponse<GroupMemberResponse[]> = await axios.get(
        `${this.baseUrl}/groups/${id}/members`,
        {
          withCredentials: true,
          validateStatus: (status) => status >= 200 && status < 300,
        }
      );
      return unwrap(response);
    } catch (error: any) {
      console.error("Error fetching group members: ", error?.response?.data);
      return {
        success: false,
        message: error?.response?.data?.message || "An error occurred",
        data: null,
        status: error?.response?.status || 500,
      };
    }
  }

  async promoteMember(id: number, userId: string, payload: PromoteMemberRequest) {
    try {
      const response: AxiosResponse = await axios.put(
        `${this.baseUrl}/groups/${id}/members/${userId}/role`,
        payload,
        {
          withCredentials: true,
          validateStatus: (status) => status >= 200 && status < 300,
        }
      );
      return unwrap(response);
    } catch (error: any) {
      console.error("Error promoting member: ", error?.response?.data);
      return {
        success: false,
        message: error?.response?.data?.message || "An error occurred",
        data: null,
        status: error?.response?.status || 500,
      };
    }
  }

  async removeMember(id: number, userId: string) {
    try {
      const response: AxiosResponse = await axios.delete(
        `${this.baseUrl}/groups/${id}/members/${userId}`,
        {
          withCredentials: true,
          validateStatus: (status) => status >= 200 && status < 300,
        }
      );
      return unwrap(response);
    } catch (error: any) {
      console.error("Error removing member: ", error?.response?.data);
      return {
        success: false,
        message: error?.response?.data?.message || "An error occurred",
        data: null,
        status: error?.response?.status || 500,
      };
    }
  }
}

export class DashboardOperation {

  private baseUrl: string;

  constructor() {
    this.baseUrl = BASE_URL + "/dashboard";
  }

  async getStudentDashboard() {
    try {
      const response: AxiosResponse<StudentDashboardResponse> = await axios.get(
        `${this.baseUrl}/student`,
        {
          withCredentials: true,
          validateStatus: (status) => status >= 200 && status < 300,
        }
      );
      return unwrap(response);
    } catch (error: any) {
      console.error("Error fetching student dashboard: ", error?.response?.data);
      return {
        success: false,
        message: error?.response?.data?.message || "An error occurred",
        data: null,
        status: error?.response?.status || 500,
      };
    }
  }

  async getStudentSummary() {
    try {
      const response: AxiosResponse<DashboardSummaryResponse> = await axios.get(
        `${this.baseUrl}/student/summary`,
        {
          withCredentials: true,
          validateStatus: (status) => status >= 200 && status < 300,
        }
      );
      return unwrap(response);
    } catch (error: any) {
      console.error("Error fetching student summary: ", error?.response?.data);
      return {
        success: false,
        message: error?.response?.data?.message || "An error occurred",
        data: null,
        status: error?.response?.status || 500,
      };
    }
  }

  async getStudentAnalytics() {
    try {
      const response: AxiosResponse<StudentAnalyticsResponse> = await axios.get(
        `${this.baseUrl}/student/analytics`,
        {
          withCredentials: true,
          validateStatus: (status) => status >= 200 && status < 300,
        }
      );
      return unwrap(response);
    } catch (error: any) {
      console.error("Error fetching student analytics: ", error?.response?.data);
      return {
        success: false,
        message: error?.response?.data?.message || "An error occurred",
        data: null,
        status: error?.response?.status || 500,
      };
    }
  }

  // ==========================================
  // INSTRUCTOR DASHBOARD CONTROLLER
  // ==========================================

  async getInstructorCourseStats(id: number) {
    try {
      const response: AxiosResponse<InstructorCourseStatsResponse> = await axios.get(
        `${this.baseUrl}/instructor/courses/${id}`,
        {
          withCredentials: true,
          validateStatus: (status) => status >= 200 && status < 300,
        }
      );
      return unwrap(response);
    } catch (error: any) {
      console.error("Error fetching instructor course stats: ", error?.response?.data);
      return {
        success: false,
        message: error?.response?.data?.message || "An error occurred",
        data: null,
        status: error?.response?.status || 500,
      };
    }
  }

  async getAtRiskStudents() {
    try {
      const response: AxiosResponse<AtRiskListResponse> = await axios.get(
        `${this.baseUrl}/instructor/at-risk`,
        {
          withCredentials: true,
          validateStatus: (status) => status >= 200 && status < 300,
        }
      );
      return unwrap(response);
    } catch (error: any) {
      console.error("Error fetching at-risk students list: ", error?.response?.data);
      return {
        success: false,
        message: error?.response?.data?.message || "An error occurred",
        data: null,
        status: error?.response?.status || 500,
      };
    }
  }

  // ==========================================
  // ADMIN DASHBOARD CONTROLLER
  // ==========================================

  async getAdminStats() {
    try {
      const response: AxiosResponse<AdminStatsResponse> = await axios.get(
        `${this.baseUrl}/admin/stats`,
        {
          withCredentials: true,
          validateStatus: (status) => status >= 200 && status < 300,
        }
      );
      return unwrap(response);
    } catch (error: any) {
      console.error("Error fetching admin stats: ", error?.response?.data);
      return {
        success: false,
        message: error?.response?.data?.message || "An error occurred",
        data: null,
        status: error?.response?.status || 500,
      };
    }
  }

  // ==========================================
  // HEALTH CHECK (ROOT)
  // ==========================================

  async healthCheck() {
    try {
      const healthUrl = BASE_URL.replace('/api/v1', '') + '/health';

      const response: AxiosResponse<Record<string, string>> = await axios.get(
        healthUrl,
        {
          validateStatus: (status) => status >= 200 && status < 600, // Chấp nhận cả lỗi 5xx
        }
      );
      return unwrap(response);
    } catch (error: any) {
      console.error("Error performing health check: ", error?.response?.data);
      return {
        success: false,
        message: "Failed to connect to health endpoint",
        data: null,
        status: error?.response?.status || 500,
      };
    }
  }
}