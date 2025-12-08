# Auth Routes API Coverage

## Routes
- `/auth/login`
- `/auth/signup`

## Components
- `src/app/auth/login/page.tsx` -> `src/screens/LoginScreen.tsx` -> `src/components/widgets/auth/AuthForm.tsx`
- `src/app/auth/signup/page.tsx`

## API Calls
### Login
- **Endpoint:** `POST /api/v1/auth/login`
- **Function:** `identityServiceApi.login`
- **Status:** Covered.
- **Additional:** Calls `GET /api/v1/auth/me` (`identityServiceApi.getCurrentUser`) after successful login to fetch user details.

### Signup
- **Endpoint:** `POST /api/v1/auth/register`
- **Function:** `identityServiceApi.register`
- **Status:** Covered.

## Assessment
The authentication routes have sufficient API support for the current screens.
