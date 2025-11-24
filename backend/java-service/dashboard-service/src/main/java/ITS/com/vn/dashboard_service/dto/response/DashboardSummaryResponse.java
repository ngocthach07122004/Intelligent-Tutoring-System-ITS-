package ITS.com.vn.dashboard_service.dto.response;

import ITS.com.vn.dashboard_service.dto.external.AchievementResponse;
import ITS.com.vn.dashboard_service.dto.external.EnrollmentResponse;
import ITS.com.vn.dashboard_service.dto.external.GradebookSummaryResponse;
import ITS.com.vn.dashboard_service.dto.external.UserProfileResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryResponse {

    private UserProfileResponse profile;
    private List<EnrollmentResponse> courses;
    private CourseStats courseStats;
    private GradebookSummaryResponse performance;
    private List<AchievementResponse> achievements;
    private Integer achievementsCount;
    private Integer totalLearningHours; // Mock or calculated
    private Integer upcomingAssignments; // Mock

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CourseStats {
        private Integer totalCourses;
        private Integer inProgressCourses;
        private Integer completedCourses;
        private Double averageProgress;
    }
}
