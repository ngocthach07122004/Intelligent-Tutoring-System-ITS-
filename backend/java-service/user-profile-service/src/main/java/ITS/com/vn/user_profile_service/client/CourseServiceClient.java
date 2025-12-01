package ITS.com.vn.user_profile_service.client;

import ITS.com.vn.user_profile_service.dto.external.course.EnrollmentResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "course-service")
public interface CourseServiceClient {

    @GetMapping("/api/v1/enrollments/student/{studentId}")
    List<EnrollmentResponse> getStudentEnrollments(@PathVariable("studentId") Long studentId);
}
