package ITS.com.vn.assessment_service.controller;

import ITS.com.vn.assessment_service.dto.response.AchievementResponse;
import ITS.com.vn.assessment_service.dto.response.GradebookHistoryResponse;
import ITS.com.vn.assessment_service.dto.response.GradebookSummaryResponse;
import ITS.com.vn.assessment_service.dto.response.GradebookSummaryV2Response;
import ITS.com.vn.assessment_service.dto.response.AnalyticsResponse;
import ITS.com.vn.assessment_service.service.AchievementService;
import ITS.com.vn.assessment_service.service.GradebookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/assessment")
@RequiredArgsConstructor
public class AssessmentController {

    private final GradebookService gradebookService;
    private final AchievementService achievementService;

    @GetMapping("/gradebook/summary")
    public ResponseEntity<GradebookSummaryResponse> getGradebookSummary(
            @RequestParam(required = false) String semester) {
        UUID userId = getCurrentUserId();
        return ResponseEntity.ok(gradebookService.getGradebookSummary(userId, semester));
    }

    @GetMapping("/gradebook/summary/v2")
    public ResponseEntity<GradebookSummaryV2Response> getGradebookSummaryV2(
            @RequestParam(required = false) String semester,
            @RequestParam(required = false) UUID studentId) {
        UUID userId = studentId != null ? studentId : getCurrentUserId();
        return ResponseEntity.ok(gradebookService.getGradebookSummaryV2(userId, semester));
    }

    @GetMapping("/gradebook/history/{studentId}")
    public ResponseEntity<GradebookHistoryResponse> getGradebookHistory(
            @PathVariable UUID studentId) {
        return ResponseEntity.ok(gradebookService.getGradebookHistory(studentId));
    }

    @GetMapping("/analytics")
    public ResponseEntity<AnalyticsResponse> getAnalytics(
            @RequestParam(required = false) UUID studentId) {
        UUID userId = studentId != null ? studentId : getCurrentUserId();
        return ResponseEntity.ok(gradebookService.getAnalytics(userId));
    }

    @GetMapping("/achievements")
    public ResponseEntity<List<AchievementResponse>> getUserAchievements() {
        UUID userId = getCurrentUserId();
        return ResponseEntity.ok(achievementService.getUserAchievements(userId));
    }

    @PostMapping("/achievements/{code}/award")
    public ResponseEntity<Void> awardAchievement(@PathVariable String code) {
        UUID userId = getCurrentUserId();
        achievementService.awardAchievement(userId, code);
        return ResponseEntity.ok().build();
    }

    private UUID getCurrentUserId() {
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            try {
                return UUID.fromString(SecurityContextHolder.getContext().getAuthentication().getName());
            } catch (IllegalArgumentException e) {
                return UUID.randomUUID();
            }
        }
        return UUID.fromString("00000000-0000-0000-0000-000000000000");
    }
}
