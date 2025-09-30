import axios, { AxiosResponse } from "axios";
import { LoginPayload, SignUpPayload } from "./interfaces";

export class AuthOperation {
    private baseUrl: string;

    constructor() {
        this.baseUrl = 'http://localhost/api/v1/internal/auth';
    }

    async signup(payload: SignUpPayload) {
        try {
            const response: AxiosResponse = await axios.post(`${this.baseUrl}/signup`, payload, {
                withCredentials: true,
                validateStatus: status => status >= 200 && status < 300,
            });

            return {
                success: response.data.success,
                message: response.data.message,
                data: response.data.data,
                status: response.status,
            };
        } catch (error: any) {
            console.error("Error signing up: ", error?.response?.data);
            return { success: false, message: error?.response?.data?.message || "An error occurred" };
        }
    }

    async signin(payload: LoginPayload) {
        try {
            const response: AxiosResponse = await axios.post(`${this.baseUrl}/signin`, payload, {
                withCredentials: true,
                validateStatus: status => status >= 200 && status < 300,
            });

            return {
                success: response.data.success,
                message: response.data.message,
                data: response.data.data,
                status: response.status,
            };
        } catch (error: any) {
            console.error("Error signing in: ", error?.response?.data);
            return { success: false, message: error?.response?.data?.message || "An error occurred" };
        }
    }
}

export class UserOperation {
    private baseUrl: string;

    constructor() {
        this.baseUrl = 'http://localhost:8000/api/v1/user';
    }

    async getAuthenticatedInfo() {
        try {
            const response: AxiosResponse = await axios.get(`${this.baseUrl}/me`, {
                withCredentials: true,
                validateStatus: status => status >= 200 && status < 300,
            });

            return {
                success: response.data.success,
                message: response.data.message,
                data: response.data.data,
                status: response.status,
            };
        } catch (error: any) {
            console.error("Error fetching authenticated user info: ", error?.response?.data);
            return { success: false, message: error?.response?.data?.message || "An error occurred" };
        }
    }
}
