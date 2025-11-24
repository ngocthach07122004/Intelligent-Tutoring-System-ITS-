package ITS.com.vn.course_service.controller;

import ITS.com.vn.course_service.dto.response.CourseProgressResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

/**
 * Temporary dummy endpoint to satisfy dashboard-service client expectations.
 * Replace with real progress data once available.
 */
@RestController
@RequestMapping("/api/v1/courses")
public class CourseProgressController {

    @GetMapping("/progress/{userId}")
    public ResponseEntity<List<CourseProgressResponse>> getCourseProgress(@PathVariable UUID userId) {
        List<CourseProgressResponse> sample = List.of(
                new CourseProgressResponse(1L, 50),
                new CourseProgressResponse(2L, 75)
        );
        return ResponseEntity.ok(sample);
    }
}
