package ITS.com.vn.assessment_service.service.impl;

import ITS.com.vn.assessment_service.dto.response.GradebookResponse;
import ITS.com.vn.assessment_service.mapper.AttemptMapper;
import ITS.com.vn.assessment_service.repository.GradebookRepository;
import ITS.com.vn.assessment_service.service.GradebookService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GradebookServiceImpl implements GradebookService {

    private final GradebookRepository gradebookRepository;
    private final AttemptMapper attemptMapper;

    @Override
    public Page<GradebookResponse> getCourseGrades(Long courseId, Pageable pageable) {
        // Teacher view: get all grades for a course
        return gradebookRepository.findByCourseId(courseId, pageable)
                .map(attemptMapper::toGradebookResponse);
    }

    @Override
    public Page<GradebookResponse> getMyCourseGrades(Long courseId, Pageable pageable) {
        // Student view: get my grades for a course
        UUID studentId = getCurrentUserId();
        return gradebookRepository.findByCourseIdAndStudentId(courseId, studentId, pageable)
                .map(attemptMapper::toGradebookResponse);
    }

    private UUID getCurrentUserId() {
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            try {
                return UUID.fromString(SecurityContextHolder.getContext().getAuthentication().getName());
            } catch (IllegalArgumentException e) {
                return UUID.randomUUID();
            }
        }
        return UUID.fromString("00000000-0000-0000-0000-000000000000");
    }
}
