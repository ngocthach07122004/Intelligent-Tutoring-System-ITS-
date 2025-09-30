import axios from "axios";
import { LoginPayload, SignUpPayload } from "@/lib/BE-library/interfaces";

const BASE_URL = "http://localhost:8000/api/v1/auth";

export const signup = async (payload: SignUpPayload) => {
  try {
    const response = await axios.post(`${BASE_URL}/signup`, payload, {
      withCredentials: true,
    });
    return { status: response.status, data: response.data }; // Return status and data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Signup failed");
  }
};

export const signin = async (payload: LoginPayload) => {
  try {
    const response = await axios.post(`${BASE_URL}/signin`, payload, {
      withCredentials: true,
    });
    return { status: response.status, data: response.data }; // Return status and data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Signin failed");
  }
};

export const logout = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/logout`, {}, {
      withCredentials: true,
    });
    return { status: response.status, data: response.data }; // Return status and data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Logout failed");
  }
};
