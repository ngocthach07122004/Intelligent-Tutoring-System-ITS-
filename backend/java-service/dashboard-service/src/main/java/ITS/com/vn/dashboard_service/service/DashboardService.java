package ITS.com.vn.dashboard_service.service;

import ITS.com.vn.dashboard_service.dto.response.AdminStatsResponse;
import ITS.com.vn.dashboard_service.dto.response.AtRiskListResponse;
import ITS.com.vn.dashboard_service.dto.response.InstructorCourseStatsResponse;
import ITS.com.vn.dashboard_service.dto.response.StudentAnalyticsResponse;
import ITS.com.vn.dashboard_service.dto.response.StudentDashboardResponse;

import ITS.com.vn.dashboard_service.dto.response.DashboardSummaryResponse;

import java.util.UUID;

public interface DashboardService {
    
    DashboardSummaryResponse getStudentSummary(UUID userId);

    StudentAnalyticsResponse getStudentAnalytics(UUID userId);

    StudentDashboardResponse getStudentDashboard(UUID userId);

    InstructorCourseStatsResponse getInstructorCourseStats(Long courseId);

    AtRiskListResponse getAtRiskStudents();

    AdminStatsResponse getAdminStats();
}
