"use client";

import { useEffect } from "react";
import { TokenStorage } from "@/lib/utils/tokenStorage";
import { courseServiceApi } from "@/lib/BE-library/course-service-api";
import { identityServiceApi } from "@/lib/BE-library/identity-service-api";
import { assessmentServiceApi } from "@/lib/BE-library/assessment-service-api";
import { dashboardServiceApi } from "@/lib/BE-library/dashboard-service-api";
import { userProfileServiceApi } from "@/lib/BE-library/user-profile-service-api";
import { studentManagementOps } from "@/lib/BE-library/student-management-api";
// Import other services as needed

export default function TokenInitializer() {
    useEffect(() => {
        const accessToken = TokenStorage.getAccessToken();
        if (accessToken) {
            console.log("Initializing API tokens from storage");
            courseServiceApi.setAuthToken(accessToken);
            identityServiceApi.setAuthToken(accessToken);
            assessmentServiceApi.setAuthToken(accessToken);
            dashboardServiceApi.setAuthToken(accessToken);
            userProfileServiceApi.setAuthToken(accessToken);
            studentManagementOps.setAuthToken(accessToken);
        }
    }, []);

    return null;
}
