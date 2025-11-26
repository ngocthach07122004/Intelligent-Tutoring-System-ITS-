import axios from "axios";
import { LoginPayload, SignUpPayload } from "@/lib/BE-library/interfaces";

const BASE_URL =
  process.env.NEXT_PUBLIC_IDENTITY_API_BASE_URL ||
  (process.env.NEXT_PUBLIC_API_BASE_URL
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth`
    : "http://localhost:8181/api/v1/auth");

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

const unwrap = (response: any) => ({
  status: response.status,
  statusCode: response.data?.statusCode ?? response.status,
  message: response.data?.message ?? response.data?.body?.message ?? "Success",
  data: response.data?.body ?? response.data?.data ?? response.data,
});

export const signup = async (payload: SignUpPayload) => {
  try {
    const response = await api.post("/register", payload);
    return unwrap(response);
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Signup failed");
  }
};

export const signin = async (payload: LoginPayload) => {
  try {
    const response = await api.post("/login", payload);
    return unwrap(response);
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Signin failed");
  }
};

export const refreshToken = async (refreshToken: string) => {
  try {
    const response = await api.post("/refresh", { refreshToken });
    return unwrap(response);
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Refresh token failed");
  }
};

export const logout = async (refreshToken?: string) => {
  try {
    const response = await api.post(
      "/logout",
      refreshToken ? { refreshToken } : {}
    );
    return unwrap(response);
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Logout failed");
  }
};

export const resetPassword = async (
  email: string,
  oldPassword: string,
  newPassword: string
) => {
  try {
    const response = await api.post("/reset-password", {
      email,
      oldPassword,
      newPassword,
    });
    return unwrap(response);
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Reset password failed");
  }
};

export const listSessions = async (username: string) => {
  try {
    const response = await api.get(`/sessions/${username}`);
    return unwrap(response);
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Fetch sessions failed");
  }
};

export const revokeSession = async (id: number) => {
  try {
    const response = await api.delete(`/sessions/${id}`);
    return unwrap(response);
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Revoke session failed");
  }
};
