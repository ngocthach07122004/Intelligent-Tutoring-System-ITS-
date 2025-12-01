// Token Storage Utility
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "user_data";

export interface TokenData {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
}

export interface UserData {
    id: string;
    username: string;
    email: string;
    roles: string[];
}

export class TokenStorage {
    // Save tokens
    static saveTokens(tokens: TokenData): void {
        if (typeof window !== "undefined") {
            localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
            localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
        }
    }

    // Get access token
    static getAccessToken(): string | null {
        if (typeof window !== "undefined") {
            return localStorage.getItem(ACCESS_TOKEN_KEY);
        }
        return null;
    }

    // Get refresh token
    static getRefreshToken(): string | null {
        if (typeof window !== "undefined") {
            return localStorage.getItem(REFRESH_TOKEN_KEY);
        }
        return null;
    }

    // Save user data
    static saveUser(user: UserData): void {
        if (typeof window !== "undefined") {
            localStorage.setItem(USER_KEY, JSON.stringify(user));
        }
    }

    // Get user data
    static getUser(): UserData | null {
        if (typeof window !== "undefined") {
            const userData = localStorage.getItem(USER_KEY);
            return userData ? JSON.parse(userData) : null;
        }
        return null;
    }

    // Clear all auth data
    static clearAuth(): void {
        if (typeof window !== "undefined") {
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
        }
    }

    // Check if user is authenticated
    static isAuthenticated(): boolean {
        return !!this.getAccessToken();
    }

    // Check if user has specific role
    static hasRole(role: string): boolean {
        const user = this.getUser();
        return user?.roles?.includes(role) ?? false;
    }

    // Check if user has any of the specified roles
    static hasAnyRole(roles: string[]): boolean {
        const user = this.getUser();
        return roles.some(role => user?.roles?.includes(role)) ?? false;
    }
}
