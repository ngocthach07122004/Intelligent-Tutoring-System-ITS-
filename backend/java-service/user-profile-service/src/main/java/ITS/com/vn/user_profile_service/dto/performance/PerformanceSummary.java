package ITS.com.vn.user_profile_service.dto.performance;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PerformanceSummary {
    private Double overallGpa;
    private Integer totalCredits;
    private Integer totalAchievements;
    private RankInfo currentRank;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RankInfo {
        private Integer rank;
        private Integer totalStudents;
    }
}
