package ITS.com.vn.assessment_service.controller;

import ITS.com.vn.assessment_service.dto.response.AssessmentSkillResponse;
import ITS.com.vn.assessment_service.dto.response.SkillRadarResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Temporary endpoints to satisfy dashboard-service & FE expectations.
 */
@RestController
@RequestMapping("/api/v1/assessment/skills")
public class SkillController {

    @GetMapping
    public ResponseEntity<SkillRadarResponse> getSkillRadar(
            @RequestParam(required = false) UUID studentId) {
        UUID userId = studentId != null ? studentId : UUID.fromString("00000000-0000-0000-0000-000000000000");
        SkillRadarResponse response = SkillRadarResponse.builder()
                .studentId(userId)
                .skills(List.of(
                        new SkillRadarResponse.SkillEntry("Python", 85, "technical"),
                        new SkillRadarResponse.SkillEntry("Java", 70, "technical"),
                        new SkillRadarResponse.SkillEntry("JavaScript", 75, "technical"),
                        new SkillRadarResponse.SkillEntry("Làm việc nhóm", 90, "soft"),
                        new SkillRadarResponse.SkillEntry("Tiếng Anh", 78, "language")
                ))
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<AssessmentSkillResponse> getSkills(@PathVariable UUID userId) {
        AssessmentSkillResponse sample = new AssessmentSkillResponse(
                Map.of("java", 0.8, "spring", 0.65)
        );
        return ResponseEntity.ok(sample);
    }
}
