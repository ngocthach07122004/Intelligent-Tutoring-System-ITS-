# Route: /student-management

## Overview
Standalone student management page (possibly legacy or specific use case).

## API Usage
- **Current Status**: Implemented
- **Backend Service**: User Profile Service
- **Endpoints**:
    - `GET /api/v1/profile/me`
        - **Response**: `UserProfileResponse`
            - Personal: `fullName`, `studentId`, `dateOfBirth`, `phone`, `address`
            - Academic: `classId`, `className`, `academicYear`
            - Parent: `parentName`, `parentPhone`
            - Skills: List<`SkillResponse`>
    - `PUT /api/v1/profile/me`

## Notes
- Central hub for student profile data.
