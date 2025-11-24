package ITS.com.vn.assessment_service.service.impl;

import ITS.com.vn.assessment_service.domain.entity.Gradebook;
import ITS.com.vn.assessment_service.domain.entity.Gradebook;
import ITS.com.vn.assessment_service.dto.response.GradebookResponse;
import ITS.com.vn.assessment_service.dto.response.GradebookSummaryResponse;
import ITS.com.vn.assessment_service.mapper.AttemptMapper;
import ITS.com.vn.assessment_service.repository.GradebookRepository;
import ITS.com.vn.assessment_service.service.GradebookService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
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

    @Override
    @Transactional
    public void createGradebookForEnrollment(Long courseId, Long studentId, LocalDateTime enrolledAt) {
        log.info("Creating gradebook for student {} in course {}", studentId, courseId);

        // Convert Long studentId to UUID (assuming studentId from event is actually
        // userId)
        // TODO: Verify this conversion logic based on your actual data model
        UUID studentUUID;
        try {
            // If studentId is actually a UUID string representation
            studentUUID = UUID.fromString(String.valueOf(studentId));
        } catch (Exception e) {
            // If studentId is a Long, create a deterministic UUID
            // This is a workaround - ideally events should use UUID
            log.warn("Converting Long studentId {} to UUID", studentId);
            studentUUID = UUID.nameUUIDFromBytes(studentId.toString().getBytes());
        }

        // Idempotency check: Don't create duplicate gradebook
        Page<Gradebook> existing = gradebookRepository.findByCourseIdAndStudentId(
                courseId, studentUUID, Pageable.unpaged());

        if (!existing.isEmpty()) {
            log.info("Gradebook already exists for student {} in course {}. Skipping.", studentId, courseId);
            return;
        }

        // Create new gradebook entry
        Gradebook gradebook = Gradebook.builder()
                .studentId(studentUUID)
                .courseId(courseId)
                .finalScore(0.0)
                .grade(null)
                .status("IN_PROGRESS")
                .build();

        gradebookRepository.save(gradebook);
        log.info("Created gradebook for student {} in course {}", studentId, courseId);
    }

    @Override
    public GradebookSummaryResponse getGradebookSummary(UUID userId, String semester) {
        log.debug("Getting gradebook summary for user {}", userId);

        // Lấy tất cả điểm số của student
        List<Gradebook> gradebooks = gradebookRepository.findByStudentId(userId);

        // Calculate statistics
        int totalCourses = gradebooks.size();
        int completedCourses = 0;
        int inProgressCourses = 0;
        double totalGpaPoints = 0.0;
        int gradedCoursesCount = 0;

        List<GradebookSummaryResponse.CourseGradeDetail> details = new ArrayList<>();

        for (Gradebook gb : gradebooks) {
            // Determine status
            boolean isPassed = "PASSED".equalsIgnoreCase(gb.getStatus());
            if (isPassed) {
                completedCourses++;
            } else {
                inProgressCourses++;
            }

            // Calculate GPA for this course if not present
            Double gpa = gb.getGpa();
            if (gpa == null && gb.getFinalScore() != null) {
                // Convert 10-scale to 4-scale roughly
                gpa = (gb.getFinalScore() / 10.0) * 4.0;
            }

            if (gpa != null) {
                totalGpaPoints += gpa;
                gradedCoursesCount++;
            }

            details.add(GradebookSummaryResponse.CourseGradeDetail.builder()
                    .courseId(gb.getCourseId())
                    .courseName("Course " + gb.getCourseId()) // Placeholder until Feign client
                    .courseCode("CODE" + gb.getCourseId())   // Placeholder
                    .finalScore(gb.getFinalScore())
                    .grade(gb.getGrade())
                    .gpa(gpa)
                    .status(gb.getStatus())
                    .build());
        }

        Double overallGpa = gradedCoursesCount > 0 ? totalGpaPoints / gradedCoursesCount : 0.0;

        // Mock rank calculation (would normally require comparing with all students)
        Integer rank = 1; 

        return GradebookSummaryResponse.builder()
                .overallGpa(Math.round(overallGpa * 100.0) / 100.0) // Round to 2 decimals
                .totalCredits(completedCourses * 3) // Assume 3 credits per course for MVP
                .completedCourses(completedCourses)
                .inProgressCourses(inProgressCourses)
                .rank(rank)
                .semester(semester != null ? semester : "Current")
                .courseGrades(details)
                .build();
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
