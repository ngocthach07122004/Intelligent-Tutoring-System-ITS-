package ITS.com.vn.assessment_service.dto.response;

import ITS.com.vn.assessment_service.domain.enums.QuestionType;
import lombok.Data;

import java.util.Map;

@Data
public class QuestionResponse {
    private Long id;
    private Long poolId;
    private QuestionType type;
    private String content;
    private Map<String, Object> metadata;
    private Double weight;
    private String skillTag;
}
