// Identity Service API Client
import axios, { AxiosResponse } from "axios";

const IDENTITY_SERVICE_BASE_URL = "http://localhost:8181/api/v1/auth";

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    roles: string[]; // ["STUDENT", "TEACHER", "ADMIN"]
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface AuthenticationResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
}

export interface UserResponse {
    id: string;
    username: string;
    email: string;
    roles: string[];
    enabled: boolean;
    createdAt: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

const unwrap = (response: AxiosResponse) => ({
    success: response?.data?.success ?? (response.status >= 200 && response.status < 300),
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

export class IdentityServiceApi {
    private baseUrl: string;
    private authToken?: string;

    constructor(baseUrl = IDENTITY_SERVICE_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    setAuthToken(token?: string) {
        this.authToken = token;
    }

    private config(token?: string) {
        const headers = (token || this.authToken)
            ? { Authorization: `Bearer ${token || this.authToken}` }
            : undefined;

        return {
            headers,
            withCredentials: true,
            validateStatus: (status: number) => status >= 200 && status < 300,
        };
    }

    // Register new user
    async register(payload: RegisterRequest) {
        try {
            const response: AxiosResponse<AuthenticationResponse> = await axios.post(
                `${this.baseUrl}/register`,
                payload,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to register user");
        }
    }

    // Login
    async login(payload: LoginRequest) {
        try {
            const response: AxiosResponse<AuthenticationResponse> = await axios.post(
                `${this.baseUrl}/login`,
                payload,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to login");
        }
    }

    // Refresh token
    async refreshToken(refreshToken: string) {
        try {
            const response: AxiosResponse<AuthenticationResponse> = await axios.post(
                `${this.baseUrl}/refresh`,
                { refreshToken },
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to refresh token");
        }
    }

    // Get current user
    async getCurrentUser(accessToken: string) {
        try {
            const response: AxiosResponse<UserResponse> = await axios.get(
                `${this.baseUrl}/me`,
                this.config(accessToken),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to get current user");
        }
    }

    // Logout (client-side only, no server call needed)
    async logout() {
        // JWT is stateless, just clear local storage
        return {
            success: true,
            message: "Logged out successfully",
            data: null,
            status: 200,
        };
    }
}

export const identityServiceApi = new IdentityServiceApi();