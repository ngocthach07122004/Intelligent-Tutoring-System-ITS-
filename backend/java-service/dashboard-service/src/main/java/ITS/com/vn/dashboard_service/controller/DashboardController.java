package ITS.com.vn.dashboard_service.controller;

import ITS.com.vn.dashboard_service.dto.response.AdminStatsResponse;
import ITS.com.vn.dashboard_service.dto.response.AtRiskListResponse;
import ITS.com.vn.dashboard_service.dto.response.InstructorCourseStatsResponse;
import ITS.com.vn.dashboard_service.dto.response.StudentDashboardResponse;
import ITS.com.vn.dashboard_service.service.DashboardService;
import ITS.com.vn.dashboard_service.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/student")
    public ResponseEntity<StudentDashboardResponse> getStudentDashboard() {
        UUID userId = JwtUtil.getUserIdFromJwt();
        return ResponseEntity.ok(dashboardService.getStudentDashboard(userId));
    }

    @GetMapping("/instructor/courses/{id}")
    public ResponseEntity<InstructorCourseStatsResponse> getInstructorCourseStats(@PathVariable Long id) {
        return ResponseEntity.ok(dashboardService.getInstructorCourseStats(id));
    }

    @GetMapping("/instructor/at-risk")
    public ResponseEntity<AtRiskListResponse> getAtRiskStudents() {
        return ResponseEntity.ok(dashboardService.getAtRiskStudents());
    }

    @GetMapping("/admin/stats")
    public ResponseEntity<AdminStatsResponse> getAdminStats() {
        return ResponseEntity.ok(dashboardService.getAdminStats());
    }
}
