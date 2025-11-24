package ITS.com.vn.dashboard_service.dto.response;

import ITS.com.vn.dashboard_service.domain.enums.RiskLevel;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.Map;

@Data
@Builder
public class StudentDashboardResponse {
    private DashboardSummary summary;
    private RiskProfileDTO riskProfile;
    private Map<String, Double> skillRadar;

    @Data
    @Builder
    public static class DashboardSummary {
        private int coursesInProgress;
        private Instant nextAssignmentDue;
    }

    @Data
    @Builder
    public static class RiskProfileDTO {
        private RiskLevel level;
        private String trend; // STABLE, INCREASING, DECREASING
    }
}
