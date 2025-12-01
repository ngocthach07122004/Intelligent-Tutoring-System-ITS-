package ITS.com.vn.user_profile_service.service.impl;

import ITS.com.vn.user_profile_service.client.AssessmentServiceClient;
import ITS.com.vn.user_profile_service.client.CourseServiceClient;
import ITS.com.vn.user_profile_service.domain.entity.UserProfile;
import ITS.com.vn.user_profile_service.dto.external.assessment.AnalyticsResponse;
import ITS.com.vn.user_profile_service.dto.external.assessment.GradebookHistoryResponse;
import ITS.com.vn.user_profile_service.dto.external.course.EnrollmentResponse;
import ITS.com.vn.user_profile_service.dto.student.*;
import ITS.com.vn.user_profile_service.mapper.StudentMapper;
import ITS.com.vn.user_profile_service.repository.UserProfileRepository;
import ITS.com.vn.user_profile_service.service.StudentService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudentServiceImpl implements StudentService {

    private final UserProfileRepository userProfileRepository;
    private final AssessmentServiceClient assessmentServiceClient;
    private final CourseServiceClient courseServiceClient;
    private final StudentMapper studentMapper;

    @Override
    @Transactional(readOnly = true)
    public Student getStudentProfile(UUID studentId) {
        UserProfile profile = userProfileRepository.findByUserId(studentId)
                .orElseThrow(() -> new EntityNotFoundException("Student profile not found for ID: " + studentId));
        return studentMapper.toStudentDto(profile);
    }

    @Override
    @Transactional
    public Student updateStudentProfile(UUID studentId, Student studentDto) {
        UserProfile profile = userProfileRepository.findByUserId(studentId)
                .orElseThrow(() -> new EntityNotFoundException("Student profile not found for ID: " + studentId));

        studentMapper.updateEntityFromDto(studentDto, profile);
        profile = userProfileRepository.save(profile);
        return studentMapper.toStudentDto(profile);
    }

    @Override
    public List<AcademicRecord> getStudentAcademicHistory(UUID studentId) {
        // Verify student exists
        if (!userProfileRepository.existsByUserId(studentId)) {
            throw new EntityNotFoundException("Student profile not found for ID: " + studentId);
        }

        try {
            GradebookHistoryResponse response = assessmentServiceClient.getStudentHistory(studentId);
            if (response != null && response.getRecords() != null) {
                return studentMapper.toAcademicRecordList(response.getRecords());
            }
        } catch (Exception e) {
            log.error("Error fetching academic history for student {}", studentId, e);
        }
        return Collections.emptyList();
    }

    @Override
    public LearningAnalytics getStudentAnalytics(UUID studentId, String timeframe) {
        // Verify student exists
        if (!userProfileRepository.existsByUserId(studentId)) {
            throw new EntityNotFoundException("Student profile not found for ID: " + studentId);
        }

        try {
            AnalyticsResponse response = assessmentServiceClient.getStudentAnalytics(studentId, timeframe);
            if (response != null) {
                return studentMapper.toLearningAnalytics(response);
            }
        } catch (Exception e) {
            log.error("Error fetching analytics for student {}", studentId, e);
        }
        return LearningAnalytics.builder().build();
    }

    @Override
    public List<CurrentSubject> getStudentSubjects(UUID studentId) {
        UserProfile profile = userProfileRepository.findByUserId(studentId)
                .orElseThrow(() -> new EntityNotFoundException("Student profile not found for ID: " + studentId));

        // Use UserProfile.id (Long) for course-service
        Long internalId = profile.getId();

        try {
            List<EnrollmentResponse> enrollments = courseServiceClient.getStudentEnrollments(internalId);
            if (enrollments != null) {
                return studentMapper.toCurrentSubjectList(enrollments);
            }
        } catch (Exception e) {
            log.error("Error fetching subjects for student {}", studentId, e);
        }
        return Collections.emptyList();
    }

    @Override
    public CurrentSubject getStudentSubject(UUID studentId, String subjectId) {
        UserProfile profile = userProfileRepository.findByUserId(studentId)
                .orElseThrow(() -> new EntityNotFoundException("Student profile not found for ID: " + studentId));

        Long courseId;
        try {
            courseId = Long.parseLong(subjectId);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid subject ID: " + subjectId);
        }

        // 1. Get Course Details (via Enrollment)
        EnrollmentResponse enrollment = null;
        try {
            List<EnrollmentResponse> enrollments = courseServiceClient.getStudentEnrollments(profile.getId());
            enrollment = enrollments.stream()
                    .filter(e -> e.getCourseId().equals(courseId))
                    .findFirst()
                    .orElseThrow(() -> new EntityNotFoundException("Student not enrolled in course: " + courseId));
        } catch (Exception e) {
            log.error("Error fetching enrollment for student {} course {}", studentId, courseId, e);
            if (e instanceof EntityNotFoundException)
                throw e;
            throw new RuntimeException("Error fetching course details");
        }

        CurrentSubject subject = studentMapper.toCurrentSubject(enrollment);

        // 2. Get Detailed Grades
        try {
            org.springframework.data.domain.Page<ITS.com.vn.user_profile_service.dto.external.assessment.GradebookResponse> gradesPage = assessmentServiceClient
                    .getStudentCourseGrades(studentId, courseId, org.springframework.data.domain.Pageable.unpaged());

            if (gradesPage != null && gradesPage.hasContent()) {
                enrichSubjectWithGrades(subject, gradesPage.getContent());
            }
        } catch (Exception e) {
            log.error("Error fetching grades for student {} course {}", studentId, courseId, e);
            // Continue without grades
        }

        return subject;
    }

    private void enrichSubjectWithGrades(CurrentSubject subject,
            List<ITS.com.vn.user_profile_service.dto.external.assessment.GradebookResponse> grades) {
        int assignmentCount = 0;
        int assignmentCompleted = 0;
        double assignmentScoreSum = 0;
        int assignmentGradedCount = 0;

        int examCount = 0; // quizzes + midterm + final
        List<Double> quizzes = new java.util.ArrayList<>();
        Double midterm = null;
        Double finalExam = null;

        for (ITS.com.vn.user_profile_service.dto.external.assessment.GradebookResponse grade : grades) {
            // Heuristic to distinguish assignment vs exam based on title or other field
            // Since GradebookResponse is limited, we assume everything is an "assignment"
            // unless title says "Exam"
            // In a real system, we'd check examConfig type.

            String title = grade.getExamTitle() != null ? grade.getExamTitle().toLowerCase() : "";
            boolean isExam = title.contains("exam") || title.contains("midterm") || title.contains("final")
                    || title.contains("quiz");

            if (isExam) {
                examCount++;
                if (grade.getScore() != null) {
                    if (title.contains("midterm"))
                        midterm = grade.getScore();
                    else if (title.contains("final"))
                        finalExam = grade.getScore();
                    else
                        quizzes.add(grade.getScore());
                }
            } else {
                assignmentCount++;
                if ("PASSED".equalsIgnoreCase(grade.getStatus()) || grade.getScore() != null) {
                    assignmentCompleted++;
                }
                if (grade.getScore() != null) {
                    assignmentScoreSum += grade.getScore();
                    assignmentGradedCount++;
                }
            }
        }

        subject.setAssignments(CurrentSubject.AssignmentsInfo.builder()
                .total(assignmentCount)
                .completed(assignmentCompleted)
                .avgScore(assignmentGradedCount > 0 ? assignmentScoreSum / assignmentGradedCount : 0.0)
                .build());

        subject.setExams(CurrentSubject.ExamsInfo.builder()
                .midterm(midterm)
                .finalExam(finalExam)
                .quizzes(quizzes)
                .build());

        // Update progress
        if (subject.getProgress() == null) {
            subject.setProgress(CurrentSubject.ProgressInfo.builder().completed(assignmentCompleted)
                    .total(assignmentCount + examCount).build());
        }
    }

    @Override
    public List<Achievement> getStudentAchievements(UUID studentId) {
        // Not implemented yet in assessment-service
        return Collections.emptyList();
    }
}
