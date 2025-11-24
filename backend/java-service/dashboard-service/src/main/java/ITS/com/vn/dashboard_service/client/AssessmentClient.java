package ITS.com.vn.dashboard_service.client;

import ITS.com.vn.dashboard_service.dto.client.AssessmentSkillDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;

@FeignClient(name = "assessment-service", path = "/api/v1")
public interface AssessmentClient {
    // Assuming endpoint from assessment service
    @GetMapping("/skills/{userId}")
    AssessmentSkillDTO getStudentSkills(@PathVariable("userId") UUID userId);
}
