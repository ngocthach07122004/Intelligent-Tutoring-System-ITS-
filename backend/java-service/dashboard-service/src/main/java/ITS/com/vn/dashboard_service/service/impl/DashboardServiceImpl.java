package ITS.com.vn.dashboard_service.service.impl;

import ITS.com.vn.dashboard_service.client.AssessmentClient;
import ITS.com.vn.dashboard_service.client.CourseClient;
import ITS.com.vn.dashboard_service.client.UserProfileClient;
import ITS.com.vn.dashboard_service.domain.entity.StudentRiskProfile;
import ITS.com.vn.dashboard_service.domain.enums.RiskLevel;
import ITS.com.vn.dashboard_service.dto.client.AssessmentSkillDTO;
import ITS.com.vn.dashboard_service.dto.client.CourseProgressDTO;
import ITS.com.vn.dashboard_service.dto.external.AchievementResponse;
import ITS.com.vn.dashboard_service.dto.external.EnrollmentResponse;
import ITS.com.vn.dashboard_service.dto.external.GradebookSummaryResponse;
import ITS.com.vn.dashboard_service.dto.external.UserProfileResponse;
import ITS.com.vn.dashboard_service.dto.response.*;
import ITS.com.vn.dashboard_service.repository.StudentRiskProfileRepository;
import ITS.com.vn.dashboard_service.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardServiceImpl implements DashboardService {

    private final CourseClient courseClient;
    private final AssessmentClient assessmentClient;
    private final UserProfileClient profileClient;
    private final StudentRiskProfileRepository riskProfileRepository;

    @Override
    public DashboardSummaryResponse getStudentSummary(UUID userId) {
        log.info("Aggregating dashboard summary for user {}", userId);

        // 1. Fetch Profile (Async candidate)
        UserProfileResponse profile = null;
        try {
            profile = profileClient.getMyProfile();
        } catch (Exception e) {
            log.error("Failed to fetch profile", e);
        }

        // 2. Fetch Courses
        List<EnrollmentResponse> courses = new ArrayList<>();
        try {
            courses = courseClient.getMyCourses();
        } catch (Exception e) {
            log.error("Failed to fetch courses", e);
        }

        // 3. Fetch Performance & Achievements
        GradebookSummaryResponse performance = null;
        List<AchievementResponse> achievements = new ArrayList<>();
        try {
            performance = assessmentClient.getGradebookSummary();
            achievements = assessmentClient.getUserAchievements();
        } catch (Exception e) {
            log.error("Failed to fetch assessment data", e);
        }

        return DashboardSummaryResponse.builder()
                .profile(profile)
                .courses(courses)
                .performance(performance)
                .achievements(achievements)
                .totalLearningHours(120) // Mock
                .upcomingAssignments(3) // Mock
                .build();
    }

    @Override
    public StudentDashboardResponse getStudentDashboard(UUID userId) {
        // 1. Fetch Course Progress (Fallback handled by Feign or try-catch)
        int coursesInProgress = 0;
        try {
            List<CourseProgressDTO> progress = courseClient.getStudentProgress(userId);
            if (progress != null) {
                coursesInProgress = (int) progress.stream().filter(p -> p.getProgressPercent() < 100).count();
            }
        } catch (Exception e) {
            log.error("Failed to fetch course progress for user {}", userId, e);
        }

        // 2. Fetch Risk Profile
        StudentRiskProfile riskProfile = riskProfileRepository.findById(userId)
                .orElse(StudentRiskProfile.builder()
                        .riskLevel(RiskLevel.LOW)
                        .build());

        // 3. Fetch Skills
        Map<String, Double> skills = new HashMap<>();
        try {
            AssessmentSkillDTO skillDTO = assessmentClient.getStudentSkills(userId);
            if (skillDTO != null && skillDTO.getMastery() != null) {
                skills = skillDTO.getMastery();
            }
        } catch (Exception e) {
            log.error("Failed to fetch skills for user {}", userId, e);
        }

        return StudentDashboardResponse.builder()
                .summary(StudentDashboardResponse.DashboardSummary.builder()
                        .coursesInProgress(coursesInProgress)
                        .nextAssignmentDue(Instant.now().plus(2, ChronoUnit.DAYS)) // Mock for now
                        .build())
                .riskProfile(StudentDashboardResponse.RiskProfileDTO.builder()
                        .level(riskProfile.getRiskLevel())
                        .trend("STABLE") // Mock trend
                        .build())
                .skillRadar(skills)
                .build();
    }

    @Override
    public InstructorCourseStatsResponse getInstructorCourseStats(Long courseId) {
        // Mock implementation for MVP
        return InstructorCourseStatsResponse.builder()
                .averageScore(75.5)
                .atRiskCount(5)
                .completionRate(0.68)
                .build();
    }

    @Override
    public AtRiskListResponse getAtRiskStudents() {
        List<StudentRiskProfile> highRiskProfiles = riskProfileRepository.findByRiskLevel(RiskLevel.HIGH);

        List<AtRiskListResponse.AtRiskStudentDTO> students = highRiskProfiles.stream()
                .map(p -> AtRiskListResponse.AtRiskStudentDTO.builder()
                        .studentId(p.getStudentId())
                        .studentName("Student " + p.getStudentId()) // Name would need ProfileClient fetch
                        .riskLevel(p.getRiskLevel())
                        .reasons(p.getRiskFactors())
                        .build())
                .toList();

        return AtRiskListResponse.builder()
                .students(students)
                .build();
    }

    @Override
    public AdminStatsResponse getAdminStats() {
        // Mock implementation for MVP
        return AdminStatsResponse.builder()
                .activeUsers(1200)
                .revenueThisMonth(5000.00)
                .totalCourses(150)
                .systemHealth("HEALTHY")
                .build();
    }
}
