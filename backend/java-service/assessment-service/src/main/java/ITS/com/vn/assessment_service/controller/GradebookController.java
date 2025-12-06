package ITS.com.vn.assessment_service.controller;

import ITS.com.vn.assessment_service.dto.response.GradebookResponse;

import ITS.com.vn.assessment_service.dto.response.GradebookSummaryResponse;
import ITS.com.vn.assessment_service.dto.response.GradebookHistoryResponse;
import ITS.com.vn.assessment_service.dto.response.AnalyticsResponse;
import java.util.UUID;
import ITS.com.vn.assessment_service.service.GradebookService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/gradebook")
@RequiredArgsConstructor
public class GradebookController {

    private final GradebookService gradebookService;

    @GetMapping("/courses/{courseId}")
    public ResponseEntity<Page<GradebookResponse>> getCourseGrades(
            @PathVariable Long courseId,
            Pageable pageable) {
        // TODO: Add role check here (Teacher vs Student)
        // For now, exposing the teacher view endpoint as per plan
        return ResponseEntity.ok(gradebookService.getCourseGrades(courseId, pageable));
    }

    @GetMapping("/my/courses/{courseId}")
    public ResponseEntity<Page<GradebookResponse>> getMyCourseGrades(
            @PathVariable Long courseId,
            Pageable pageable) {
        return ResponseEntity.ok(gradebookService.getMyCourseGrades(courseId, pageable));
    }

    @GetMapping("/student/{studentId}/course/{courseId}")
    public ResponseEntity<Page<GradebookResponse>> getStudentCourseGrades(
            @PathVariable UUID studentId,
            @PathVariable Long courseId,
            Pageable pageable) {
        return ResponseEntity.ok(gradebookService.getStudentCourseGrades(courseId, studentId, pageable));
    }

    @GetMapping("/student/{studentId}/history")
    public ResponseEntity<GradebookHistoryResponse> getStudentHistory(@PathVariable UUID studentId) {
        return ResponseEntity.ok(gradebookService.getGradebookHistory(studentId));
    }

    @GetMapping("/student/{studentId}/analytics")
    public ResponseEntity<AnalyticsResponse> getStudentAnalytics(
            @PathVariable UUID studentId,
            @RequestParam(required = false, defaultValue = "semester") String timeframe) {
        return ResponseEntity.ok(gradebookService.getAnalytics(studentId, timeframe));
    }

    @GetMapping("/student/{studentId}/summary")
    public ResponseEntity<GradebookSummaryResponse> getStudentSummary(@PathVariable UUID studentId) {
        return ResponseEntity.ok(gradebookService.getGradebookSummary(studentId, null));
    }
}
