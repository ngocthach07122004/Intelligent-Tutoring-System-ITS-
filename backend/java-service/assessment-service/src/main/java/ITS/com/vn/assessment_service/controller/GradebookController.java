package ITS.com.vn.assessment_service.controller;

import ITS.com.vn.assessment_service.dto.response.GradebookResponse;
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
}
