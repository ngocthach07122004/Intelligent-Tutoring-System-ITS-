import axios, { AxiosResponse } from "axios";
import { LoginPayload, SignUpPayload, ResetPasswordPayload } from "./interfaces";

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

const BASE_URL = "http://localhost:8080/api/v1";

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
