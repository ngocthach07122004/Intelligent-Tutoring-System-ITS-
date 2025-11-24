package ITS.com.vn.dashboard_service.client;

import ITS.com.vn.dashboard_service.dto.client.CourseProgressDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.UUID;

@FeignClient(name = "course-service", path = "/api/v1/courses")
public interface CourseClient {
    // Assuming an endpoint to get progress for a user
    @GetMapping("/progress/{userId}")
    List<CourseProgressDTO> getStudentProgress(@PathVariable("userId") UUID userId);
}
