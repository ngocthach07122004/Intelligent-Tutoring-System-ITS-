import axios, { AxiosResponse } from "axios";
import { LoginPayload, SignUpPayload } from "./interfaces";

const BASE_URL =
  process.env.NEXT_PUBLIC_IDENTITY_API_BASE_URL ??
  "http://localhost:8080/api/v1/auth";

const unwrap = (response: AxiosResponse) => ({
  success: response.data?.success ?? response.status >= 200 && response.status < 300,
  message: response.data?.message ?? "Success",
  data: response.data?.body ?? response.data?.data ?? response.data,
  status: response.status,
});

export class AuthOperation {
  private baseUrl: string;

  constructor() {
    this.baseUrl = BASE_URL;
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
}

export class UserOperation {
  private baseUrl: string;

  constructor() {
    this.baseUrl =
      process.env.NEXT_PUBLIC_USER_API_BASE_URL ??
      "http://localhost:8000/api/v1/user";
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
