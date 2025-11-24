package ITS.com.vn.assessment_service.controller;

import ITS.com.vn.assessment_service.dto.response.AssessmentSkillResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.UUID;

/**
 * Temporary dummy endpoint to satisfy dashboard-service client expectations.
 * Replace with real skill data once available.
 */
@RestController
@RequestMapping("/api/v1/skills")
public class SkillController {

    @GetMapping("/{userId}")
    public ResponseEntity<AssessmentSkillResponse> getSkills(@PathVariable UUID userId) {
        AssessmentSkillResponse sample = new AssessmentSkillResponse(
                Map.of("java", 0.8, "spring", 0.65)
        );
        return ResponseEntity.ok(sample);
    }
}
