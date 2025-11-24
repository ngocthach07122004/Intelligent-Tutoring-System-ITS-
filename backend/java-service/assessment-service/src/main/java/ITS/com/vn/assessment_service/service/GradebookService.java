package ITS.com.vn.assessment_service.service;

import ITS.com.vn.assessment_service.dto.response.GradebookResponse;
import ITS.com.vn.assessment_service.dto.response.GradebookSummaryResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.UUID;

public interface GradebookService {
    Page<GradebookResponse> getCourseGrades(Long courseId, Pageable pageable);

    Page<GradebookResponse> getMyCourseGrades(Long courseId, Pageable pageable);

    /**
     * Tạo Gradebook entry khi student enroll vào course
     * @param courseId ID của khóa học
     * @param studentId ID của sinh viên
     * @param enrolledAt Thời điểm enroll
     */
    void createGradebookForEnrollment(Long courseId, Long studentId, LocalDateTime enrolledAt);

    /**
     * Lấy gradebook summary (GPA, credits, rank)
     * @param userId User ID
     * @param semester Học kỳ (optional)
     * @return GradebookSummaryResponse
     */
    GradebookSummaryResponse getGradebookSummary(UUID userId, String semester);
}
