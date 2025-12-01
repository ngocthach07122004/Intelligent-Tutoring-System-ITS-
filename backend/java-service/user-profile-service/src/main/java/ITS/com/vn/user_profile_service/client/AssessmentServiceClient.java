package ITS.com.vn.user_profile_service.client;

import ITS.com.vn.user_profile_service.dto.external.assessment.AnalyticsResponse;
import ITS.com.vn.user_profile_service.dto.external.assessment.GradebookHistoryResponse;
import ITS.com.vn.user_profile_service.dto.external.assessment.GradebookSummaryResponse;
import ITS.com.vn.user_profile_service.dto.external.assessment.GradebookResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;

@FeignClient(name = "assessment-service")
public interface AssessmentServiceClient {

    @GetMapping("/api/v1/gradebook/student/{studentId}/history")
    GradebookHistoryResponse getStudentHistory(@PathVariable("studentId") UUID studentId);

    @GetMapping("/api/v1/gradebook/student/{studentId}/summary")
    GradebookSummaryResponse getStudentSummary(@PathVariable("studentId") UUID studentId);

    @GetMapping("/api/v1/gradebook/student/{studentId}/course/{courseId}")
    org.springframework.data.domain.Page<GradebookResponse> getStudentCourseGrades(
            @PathVariable("studentId") UUID studentId,
            @PathVariable("courseId") Long courseId,
            org.springframework.data.domain.Pageable pageable);

    @GetMapping("/api/v1/gradebook/student/{studentId}/analytics")
    AnalyticsResponse getStudentAnalytics(
            @PathVariable("studentId") UUID studentId,
            @org.springframework.web.bind.annotation.RequestParam(value = "timeframe", required = false) String timeframe);
}
