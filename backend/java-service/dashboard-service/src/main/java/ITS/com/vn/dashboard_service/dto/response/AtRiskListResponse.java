package ITS.com.vn.dashboard_service.dto.response;

import ITS.com.vn.dashboard_service.domain.enums.RiskLevel;
import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@Builder
public class AtRiskListResponse {
    private List<AtRiskStudentDTO> students;

    @Data
    @Builder
    public static class AtRiskStudentDTO {
        private UUID studentId;
        private String studentName;
        private RiskLevel riskLevel;
        private List<String> reasons;
    }
}
