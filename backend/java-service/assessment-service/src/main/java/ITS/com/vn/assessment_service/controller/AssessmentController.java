package ITS.com.vn.assessment_service.controller;

import ITS.com.vn.assessment_service.dto.response.AchievementResponse;
import ITS.com.vn.assessment_service.dto.response.GradebookSummaryResponse;
import ITS.com.vn.assessment_service.service.AchievementService;
import ITS.com.vn.assessment_service.service.GradebookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/assessment")
@RequiredArgsConstructor
@Tag(name = "Assessment API", description = "APIs for Gradebook and Achievements")
public class AssessmentController {

    private final GradebookService gradebookService;
    private final AchievementService achievementService;

    @GetMapping("/gradebook/summary")
    @Operation(summary = "Get gradebook summary (GPA, Rank, Course Grades)")
    public ResponseEntity<GradebookSummaryResponse> getGradebookSummary(
            @RequestParam(required = false) String semester) {
        UUID userId = getCurrentUserId();
        return ResponseEntity.ok(gradebookService.getGradebookSummary(userId, semester));
    }

    @GetMapping("/achievements")
    @Operation(summary = "Get user achievements")
    public ResponseEntity<List<AchievementResponse>> getUserAchievements() {
        UUID userId = getCurrentUserId();
        return ResponseEntity.ok(achievementService.getUserAchievements(userId));
    }

    @PostMapping("/achievements/{code}/award")
    @Operation(summary = "Award achievement to current user (Test only)")
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
