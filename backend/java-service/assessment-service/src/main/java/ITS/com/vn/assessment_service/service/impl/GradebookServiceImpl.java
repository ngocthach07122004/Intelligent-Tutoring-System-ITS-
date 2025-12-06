package ITS.com.vn.assessment_service.service.impl;

import ITS.com.vn.assessment_service.domain.entity.Gradebook;
import ITS.com.vn.assessment_service.dto.response.AnalyticsResponse;
import ITS.com.vn.assessment_service.dto.response.GradebookResponse;
import ITS.com.vn.assessment_service.dto.response.GradebookSummaryResponse;
import ITS.com.vn.assessment_service.dto.response.GradebookHistoryResponse;
import ITS.com.vn.assessment_service.dto.response.GradebookSummaryV2Response;
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
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

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
    public Page<GradebookResponse> getStudentCourseGrades(Long courseId, UUID studentId, Pageable pageable) {
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

            Double gpa = resolveGpa(gb);

            if (gpa != null) {
                totalGpaPoints += gpa;
                gradedCoursesCount++;
            }

            details.add(GradebookSummaryResponse.CourseGradeDetail.builder()
                    .courseId(gb.getCourseId())
                    .courseName("Course " + gb.getCourseId()) // Placeholder until Feign client
                    .courseCode("CODE" + gb.getCourseId()) // Placeholder
                    .finalScore(gb.getFinalScore())
                    .grade(gb.getGrade())
                    .gpa(gpa)
                    .status(gb.getStatus())
                    .build());
        }

        Double overallGpa = gradedCoursesCount > 0 ? totalGpaPoints / gradedCoursesCount : 0.0;

        // Mock rank calculation (would normally require comparing with all students)
        Integer rank = 1;

        // Calculate achievements (e.g., score >= 8.0)
        int totalAchievements = (int) gradebooks.stream()
                .filter(gb -> gb.getFinalScore() != null && gb.getFinalScore() >= 8.0)
                .count();

        // Get total students (cohort size)
        Integer totalStudents = gradebookRepository.countDistinctStudentId().intValue();

        return GradebookSummaryResponse.builder()
                .overallGpa(Math.round(overallGpa * 100.0) / 100.0) // Round to 2 decimals
                .totalCredits(completedCourses * 3) // Assume 3 credits per course for MVP
                .completedCourses(completedCourses)
                .inProgressCourses(inProgressCourses)
                .rank(rank)
                .totalStudents(totalStudents)
                .totalAchievements(totalAchievements)
                .semester(semester != null ? semester : "Current")
                .courseGrades(details)
                .build();
    }

    @Override
    public GradebookSummaryV2Response getGradebookSummaryV2(UUID userId, String semester) {
        List<Gradebook> gradebooks = gradebookRepository.findByStudentId(userId);
        String semesterLabel = semester != null ? semester : "Hiện tại";

        double gpaSum = 0d;
        int gpaCount = 0;
        for (Gradebook gb : gradebooks) {
            Double gpa = resolveGpa(gb);
            if (gpa != null) {
                gpaSum += gpa;
                gpaCount++;
            }
        }
        double overallGpa = gpaCount > 0 ? gpaSum / gpaCount : 0d;
        int totalCredits = gradebooks.size() * 3;

        GradebookSummaryV2Response.SemesterSummary semesterSummary = GradebookSummaryV2Response.SemesterSummary
                .builder()
                .semester(semesterLabel)
                .gpa(Math.round(overallGpa * 100.0) / 100.0)
                .totalCredits(totalCredits)
                .rank(1)
                .totalStudents(Math.max(gradebooks.size(), 1) * 2) // placeholder: double class size
                .achievements(gradebooks.size()) // placeholder count
                .attendance(96.5)
                .build();

        GradebookSummaryV2Response.OverallStats overallStats = GradebookSummaryV2Response.OverallStats.builder()
                .gpa(Math.round(overallGpa * 100.0) / 100.0)
                .totalCredits(totalCredits)
                .build();

        return GradebookSummaryV2Response.builder()
                .studentId(userId)
                .semesters(List.of(semesterSummary))
                .overall(overallStats)
                .build();
    }

    @Override
    public GradebookHistoryResponse getGradebookHistory(UUID userId) {
        List<Gradebook> gradebooks = gradebookRepository.findByStudentId(userId);
        List<GradebookHistoryResponse.SubjectRecord> subjects = gradebooks.stream()
                .map(this::toSubjectRecord)
                .collect(Collectors.toList());

        double gpaSum = 0d;
        int gpaCount = 0;
        for (Gradebook gb : gradebooks) {
            Double gpa = resolveGpa(gb);
            if (gpa != null) {
                gpaSum += gpa;
                gpaCount++;
            }
        }
        double semesterGpa = gpaCount > 0 ? gpaSum / gpaCount : 0d;

        // Calculate achievements for this semester/record
        int achievements = (int) gradebooks.stream()
                .filter(gb -> gb.getFinalScore() != null && gb.getFinalScore() >= 8.0)
                .count();

        Integer totalStudents = gradebookRepository.countDistinctStudentId().intValue();

        GradebookHistoryResponse.AcademicRecord record = GradebookHistoryResponse.AcademicRecord.builder()
                .semester("Hiện tại")
                .gpa(Math.round(semesterGpa * 100.0) / 100.0)
                .totalCredits(gradebooks.size() * 3)
                .rank(1)
                .totalStudents(totalStudents)
                .achievements(achievements)
                .attendance(98.5) // Mock attendance
                .subjects(subjects)
                .build();

        return GradebookHistoryResponse.builder()
                .studentId(userId)
                .records(List.of(record))
                .build();
    }

    @Override
    public AnalyticsResponse getAnalytics(UUID userId, String timeframe) {
        // For now, return safe sample data aligned with FE mock; will be replaced with
        // real aggregation.
        log.info("Getting analytics for user {} with timeframe: {}", userId, timeframe);
        return AnalyticsResponse.builder()
                .examScores(List.of(
                        new AnalyticsResponse.ExamScorePoint("T9", 8.2, 7.8),
                        new AnalyticsResponse.ExamScorePoint("T10", 8.5, 7.9),
                        new AnalyticsResponse.ExamScorePoint("T11", 8.8, 8.1),
                        new AnalyticsResponse.ExamScorePoint("T12", 8.7, 8.0),
                        new AnalyticsResponse.ExamScorePoint("T1", 9.0, 8.2),
                        new AnalyticsResponse.ExamScorePoint("T2", 8.9, 8.3)))
                .learningTime(List.of(
                        new AnalyticsResponse.LearningTimePoint("T1", 25),
                        new AnalyticsResponse.LearningTimePoint("T2", 28),
                        new AnalyticsResponse.LearningTimePoint("T3", 22),
                        new AnalyticsResponse.LearningTimePoint("T4", 30),
                        new AnalyticsResponse.LearningTimePoint("T5", 27),
                        new AnalyticsResponse.LearningTimePoint("T6", 32)))
                .strengths(List.of(
                        "Toán học - Tư duy logic tốt",
                        "Hóa học - Hiểu bản chất phản ứng",
                        "Tiếng Anh - Giao tiếp tự tin"))
                .improvements(List.of(
                        "Vật lý - Cần cải thiện kỹ năng giải bài tập",
                        "Quản lý thời gian học tập"))
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

    private Double resolveGpa(Gradebook gb) {
        if (gb.getGpa() != null) {
            return gb.getGpa();
        }
        if (gb.getFinalScore() != null) {
            return (gb.getFinalScore() / 10.0) * 4.0;
        }
        return null;
    }

    private GradebookHistoryResponse.SubjectRecord toSubjectRecord(Gradebook gb) {
        Double score = gb.getFinalScore();
        return GradebookHistoryResponse.SubjectRecord.builder()
                .name("Course " + gb.getCourseId())
                .code("COURSE-" + gb.getCourseId())
                .credits(3)
                .grade(score != null ? deriveLetter(score) : gb.getGrade())
                .score(score)
                .teacher("Đang cập nhật")
                .build();
    }

    private String deriveLetter(Double score) {
        if (score == null)
            return null;
        if (score >= 9.0)
            return "A";
        if (score >= 8.0)
            return "B+";
        if (score >= 7.0)
            return "B";
        if (score >= 6.5)
            return "C+";
        if (score >= 5.5)
            return "C";
        if (score >= 5.0)
            return "D";
        return "F";
    }
}
