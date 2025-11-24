package ITS.com.vn.dashboard_service.client;

import ITS.com.vn.dashboard_service.dto.external.AchievementResponse;
import ITS.com.vn.dashboard_service.dto.external.GradebookSummaryResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@FeignClient(name = "assessment-service", url = "${application.config.assessment-url}")
public interface AssessmentClient {

    @GetMapping("/api/v1/assessment/gradebook/summary")
    GradebookSummaryResponse getGradebookSummary();

    @GetMapping("/api/v1/assessment/achievements")
    List<AchievementResponse> getUserAchievements();
}
