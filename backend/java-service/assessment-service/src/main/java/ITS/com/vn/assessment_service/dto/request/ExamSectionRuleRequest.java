package ITS.com.vn.assessment_service.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ExamSectionRuleRequest {
    @NotNull(message = "Pool ID is required")
    private Long poolId;

    @NotNull(message = "Count to pull is required")
    private Integer countToPull;

    private Integer pointsPerQuestion;
}
