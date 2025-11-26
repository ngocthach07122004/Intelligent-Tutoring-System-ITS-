package ITS.com.vn.dashboard_service.service.impl;

import ITS.com.vn.dashboard_service.client.AssessmentClient;
import ITS.com.vn.dashboard_service.client.CourseClient;
import ITS.com.vn.dashboard_service.client.UserProfileClient;
import ITS.com.vn.dashboard_service.domain.entity.StudentRiskProfile;
import ITS.com.vn.dashboard_service.domain.enums.RiskLevel;
import ITS.com.vn.dashboard_service.dto.client.AssessmentSkillDTO;
import ITS.com.vn.dashboard_service.dto.client.CourseProgressDTO;
import ITS.com.vn.dashboard_service.dto.external.AchievementResponse;
import ITS.com.vn.dashboard_service.dto.external.AssessmentAnalyticsResponse;
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
import java.util.stream.Collectors;

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
            performance = assessmentClient.getGradebookSummary(userId);
            achievements = assessmentClient.getUserAchievements(userId);
        } catch (Exception e) {
            log.error("Failed to fetch assessment data", e);
        }

        DashboardSummaryResponse.CourseStats courseStats = buildCourseStats(courses);
        Integer achievementsCount = achievements == null ? 0 :
                (int) achievements.stream().filter(AchievementResponse::isEarned).count();

        return DashboardSummaryResponse.builder()
                .profile(profile)
                .courses(courses)
                .courseStats(courseStats)
                .performance(performance)
                .achievements(achievements)
                .achievementsCount(achievementsCount)
                .totalLearningHours(120) // Mock
                .upcomingAssignments(3) // Mock
                .build();
    }

    @Override
    public StudentAnalyticsResponse getStudentAnalytics(UUID userId) {
        AssessmentAnalyticsResponse analytics = null;
        GradebookSummaryResponse performance = null;

        try {
            analytics = assessmentClient.getStudentAnalytics(userId);
        } catch (Exception e) {
            log.error("Failed to fetch analytics for user {}", userId, e);
        }

        try {
            performance = assessmentClient.getGradebookSummary(userId);
        } catch (Exception e) {
            log.error("Failed to fetch gradebook summary for analytics {}", userId, e);
        }

        StudentAnalyticsResponse.AcademicProgress academicProgress = buildAcademicProgress(performance);
        Double attendanceRate = extractAttendance(performance);

        return StudentAnalyticsResponse.builder()
                .academicProgress(academicProgress)
                .subjectPerformance(Collections.emptyList())
                .attendanceRate(attendanceRate)
                .assignmentCompletion(0.0)
                .examScores(mapExamScores(analytics))
                .learningTime(mapLearningTime(analytics))
                .strengths(analytics != null && analytics.getStrengths() != null ? analytics.getStrengths() : Collections.emptyList())
                .improvements(analytics != null && analytics.getImprovements() != null ? analytics.getImprovements() : Collections.emptyList())
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

    private DashboardSummaryResponse.CourseStats buildCourseStats(List<EnrollmentResponse> courses) {
        if (courses == null || courses.isEmpty()) {
            return DashboardSummaryResponse.CourseStats.builder()
                    .totalCourses(0)
                    .inProgressCourses(0)
                    .completedCourses(0)
                    .averageProgress(0.0)
                    .build();
        }

        int total = courses.size();
        int completed = (int) courses.stream()
                .filter(c -> (c.getProgress() != null && c.getProgress() >= 100)
                        || (c.getStatus() != null && "COMPLETED".equalsIgnoreCase(c.getStatus())))
                .count();
        int inProgress = (int) courses.stream()
                .filter(c -> c.getProgress() != null && c.getProgress() < 100)
                .count();
        double avgProgress = courses.stream()
                .map(EnrollmentResponse::getProgress)
                .filter(Objects::nonNull)
                .mapToInt(Integer::intValue)
                .average()
                .orElse(0.0);

        return DashboardSummaryResponse.CourseStats.builder()
                .totalCourses(total)
                .inProgressCourses(inProgress)
                .completedCourses(completed)
                .averageProgress(avgProgress)
                .build();
    }

    private StudentAnalyticsResponse.AcademicProgress buildAcademicProgress(GradebookSummaryResponse performance) {
        if (performance == null || performance.getSemesters() == null || performance.getSemesters().isEmpty()) {
            return StudentAnalyticsResponse.AcademicProgress.empty();
        }

        GradebookSummaryResponse.SemesterSummary current = performance.getSemesters().get(0);
        Double currentGpa = current.getGpa() == null ? 0.0 : current.getGpa();
        Double previousGpa = performance.getSemesters().size() > 1 && performance.getSemesters().get(1).getGpa() != null
                ? performance.getSemesters().get(1).getGpa()
                : 0.0;
        double delta = currentGpa - previousGpa;
        String trend = delta > 0 ? "up" : delta < 0 ? "down" : "stable";
        double percentChange = previousGpa != 0 ? (delta / previousGpa) * 100 : 0;

        return StudentAnalyticsResponse.AcademicProgress.builder()
                .currentGPA(currentGpa)
                .previousGPA(previousGpa)
                .trend(trend)
                .percentChange(percentChange)
                .build();
    }

    private Double extractAttendance(GradebookSummaryResponse performance) {
        if (performance == null || performance.getSemesters() == null || performance.getSemesters().isEmpty()) {
            return 0.0;
        }
        GradebookSummaryResponse.SemesterSummary current = performance.getSemesters().get(0);
        return current.getAttendance() != null ? current.getAttendance() : 0.0;
    }

    private List<StudentAnalyticsResponse.ExamScore> mapExamScores(AssessmentAnalyticsResponse analytics) {
        if (analytics == null || analytics.getExamScores() == null) {
            return Collections.emptyList();
        }
        return analytics.getExamScores().stream()
                .map(es -> StudentAnalyticsResponse.ExamScore.builder()
                        .month(es.getMonth())
                        .score(es.getScore())
                        .average(es.getAverage())
                        .build())
                .collect(Collectors.toList());
    }

    private List<StudentAnalyticsResponse.LearningTime> mapLearningTime(AssessmentAnalyticsResponse analytics) {
        if (analytics == null || analytics.getLearningTime() == null) {
            return Collections.emptyList();
        }
        return analytics.getLearningTime().stream()
                .map(lt -> StudentAnalyticsResponse.LearningTime.builder()
                        .week(lt.getWeek())
                        .hours(lt.getHours())
                        .build())
                .collect(Collectors.toList());
    }
}
