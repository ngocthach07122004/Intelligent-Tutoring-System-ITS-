# Route: /auth/login

## Overview
User login screen.

## API Usage
- **Current Status**: Implemented (Frontend helpers exist but wiring needs verification)
- **Backend Service**: Identity Service
- **Endpoints**:
    - `POST /api/v1/auth/login` (via `AuthOperation.signin`)
- **Helpers**: `AuthOperation.signin`

## Notes
- Documented in `backend/java-service/api-docs/identity-service.md`.
- Refresh/logout/sessions/reset-password helpers exist in FE but are not wired to any screen yet.
