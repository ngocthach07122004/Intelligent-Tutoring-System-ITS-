import axios, { AxiosResponse } from "axios";
import { UserProfileResponse } from "./interfaces";

const USER_PROFILE_SERVICE_BASE_URL = "http://localhost:8181/api/v1";

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

export class UserProfileServiceApi {
    private baseUrl: string;
    private authToken?: string;

    constructor(baseUrl = USER_PROFILE_SERVICE_BASE_URL) {
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

    async getMyProfile() {
        try {
            const response: AxiosResponse<UserProfileResponse> = await axios.get(
                `${this.baseUrl}/profile/me`,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to fetch profile");
        }
    }

    async updateMyProfile(payload: any) {
        try {
            const response: AxiosResponse<UserProfileResponse> = await axios.put(
                `${this.baseUrl}/profile/me`,
                payload,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to update profile");
        }
    }

    async getProfile(userId: string) {
        try {
            const response: AxiosResponse<UserProfileResponse> = await axios.get(
                `${this.baseUrl}/profile/${userId}`,
                this.config(),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to fetch user profile");
        }
    }

    async getProfiles(ids: string[]) {
        try {
            const response: AxiosResponse<UserProfileResponse[]> = await axios.get(
                `${this.baseUrl}/profile/users`,
                this.config({ ids: ids.join(",") }),
            );
            return unwrap(response);
        } catch (error: any) {
            return handleError(error, "Failed to fetch user profiles");
        }
    }
}

export const userProfileServiceApi = new UserProfileServiceApi();
