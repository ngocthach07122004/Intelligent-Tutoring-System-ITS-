package ITS.com.vn.dashboard_service.client;

import ITS.com.vn.dashboard_service.dto.client.AssessmentSkillDTO;
import ITS.com.vn.dashboard_service.dto.external.AchievementResponse;
import ITS.com.vn.dashboard_service.dto.external.AssessmentAnalyticsResponse;
import ITS.com.vn.dashboard_service.dto.external.GradebookSummaryResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.UUID;

@FeignClient(name = "assessment-service", url = "${application.config.assessment-url}")
public interface AssessmentClient {

    @GetMapping("/api/v1/assessment/gradebook/summary")
    GradebookSummaryResponse getGradebookSummary(@RequestParam("studentId") UUID studentId);

    @GetMapping("/api/v1/assessment/achievements")
    List<AchievementResponse> getUserAchievements(@RequestParam("studentId") UUID studentId);

    @GetMapping("/api/v1/assessment/analytics")
    AssessmentAnalyticsResponse getStudentAnalytics(@RequestParam("studentId") UUID studentId);

    @GetMapping("/api/v1/assessment/skills")
    AssessmentSkillDTO getStudentSkills(@RequestParam("studentId") UUID studentId);
}
