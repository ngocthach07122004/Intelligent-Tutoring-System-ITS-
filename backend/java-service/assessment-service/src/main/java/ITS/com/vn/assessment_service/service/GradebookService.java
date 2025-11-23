package ITS.com.vn.assessment_service.service;

import ITS.com.vn.assessment_service.dto.response.GradebookResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface GradebookService {
    Page<GradebookResponse> getCourseGrades(Long courseId, Pageable pageable);

    Page<GradebookResponse> getMyCourseGrades(Long courseId, Pageable pageable);
}
