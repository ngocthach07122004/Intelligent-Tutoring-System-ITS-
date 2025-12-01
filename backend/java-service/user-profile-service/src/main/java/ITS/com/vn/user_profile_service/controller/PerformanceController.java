package ITS.com.vn.user_profile_service.controller;

import ITS.com.vn.user_profile_service.dto.performance.PerformanceSummary;
import ITS.com.vn.user_profile_service.dto.performance.SemesterPerformance;
import ITS.com.vn.user_profile_service.dto.performance.Skill;
import ITS.com.vn.user_profile_service.service.PerformanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;
import ITS.com.vn.user_profile_service.util.SecurityUtils; // Assuming this exists or similar

@RestController
@RequestMapping("/api/v1/performance")
@RequiredArgsConstructor
public class PerformanceController {

    private final PerformanceService performanceService;

    @GetMapping("/summary")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PerformanceSummary> getPerformanceSummary() {
        UUID userId = SecurityUtils.getCurrentUserId(); // Or extract from context
        return ResponseEntity.ok(performanceService.getPerformanceSummary(userId));
    }

    @GetMapping("/semesters")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<SemesterPerformance>> getSemesterPerformance() {
        UUID userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(performanceService.getSemesterPerformance(userId));
    }

    @GetMapping("/skills")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Skill>> getStudentSkills() {
        UUID userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(performanceService.getStudentSkills(userId));
    }
}
