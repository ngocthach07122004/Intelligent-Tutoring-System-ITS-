package ITS.com.vn.assessment_service.dto.response;

import lombok.Data;

@Data
public class ExamSectionRuleResponse {
    private Long id;
    private Long poolId;
    private String poolName;
    private Integer countToPull;
    private Integer pointsPerQuestion;
}
