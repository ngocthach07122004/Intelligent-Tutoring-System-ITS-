# Route: /auth/signup

## Overview
User registration screen.

## API Usage
- **Current Status**: Implemented
- **Backend Service**: Identity Service
- **Endpoints**:
    - `POST /api/v1/auth/register`
        - **Request**: `RegisterRequest` { `email`, `username`, `password` }
        - **Response**: `ApiResponse<TokenResponse>` { `accessToken`, `refreshToken`, `expiresIn`, `tokenType` }

## Notes
- Documented in `backend/java-service/api-docs/identity-service.md`.
