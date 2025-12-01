# Route: /auth/login

## Overview
User login screen.

## API Usage
- **Current Status**: Implemented
- **Backend Service**: Identity Service
- **Endpoints**:
    - `POST /api/v1/auth/login`
        - **Request**: `LoginRequest` { `username`, `password` }
        - **Response**: `ApiResponse<TokenResponse>` { `accessToken`, `refreshToken`, `expiresIn`, `tokenType` }

## Notes
- Documented in `backend/java-service/api-docs/identity-service.md`.
- Refresh/logout/sessions/reset-password helpers exist in FE but are not wired to any screen yet.
