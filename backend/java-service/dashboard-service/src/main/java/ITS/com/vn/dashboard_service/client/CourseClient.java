package ITS.com.vn.dashboard_service.client;

import ITS.com.vn.dashboard_service.dto.external.EnrollmentResponse;
import ITS.com.vn.dashboard_service.dto.client.CourseProgressDTO;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.UUID;

@FeignClient(name = "course-service", url = "${application.config.course-url}")
public interface CourseClient {

    @GetMapping("/api/v1/courses/my-courses")
    List<EnrollmentResponse> getMyCourses();

    @GetMapping("/api/v1/courses/progress/{studentId}")
    List<CourseProgressDTO> getStudentProgress(@PathVariable("studentId") UUID studentId);
}
