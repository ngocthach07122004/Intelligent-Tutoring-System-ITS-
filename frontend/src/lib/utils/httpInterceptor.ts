// HTTP Interceptor to add JWT token to all requests
import axios from "axios";
import { TokenStorage } from "../utils/tokenStorage";
import { identityServiceApi } from "../BE-library/identity-service-api";

// Request interceptor to add access token
axios.interceptors.request.use(
    (config) => {
        const token = TokenStorage.getAccessToken();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh
axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = TokenStorage.getRefreshToken();

                if (!refreshToken) {
                    // No refresh token, redirect to login
                    TokenStorage.clearAuth();
                    if (typeof window !== "undefined") {
                        window.location.href = "/login";
                    }
                    return Promise.reject(error);
                }

                // Try to refresh the token
                const response = await identityServiceApi.refreshToken(refreshToken);

                if (response.success && response.data) {
                    // Save new tokens
                    TokenStorage.saveTokens({
                        accessToken: response.data.accessToken,
                        refreshToken: response.data.refreshToken,
                        tokenType: response.data.tokenType || "Bearer",
                    });

                    // Retry the original request with new token
                    originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
                    return axios(originalRequest);
                } else {
                    // Refresh failed, redirect to login
                    TokenStorage.clearAuth();
                    if (typeof window !== "undefined") {
                        window.location.href = "/login";
                    }
                    return Promise.reject(error);
                }
            } catch (refreshError) {
                // Refresh failed, redirect to login
                TokenStorage.clearAuth();
                if (typeof window !== "undefined") {
                    window.location.href = "/login";
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axios;