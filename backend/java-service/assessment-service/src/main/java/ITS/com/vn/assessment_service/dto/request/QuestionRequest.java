package ITS.com.vn.assessment_service.dto.request;

import ITS.com.vn.assessment_service.domain.enums.QuestionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Map;

@Data
public class QuestionRequest {
    @NotNull(message = "Pool ID is required")
    private Long poolId;

    @NotNull(message = "Question type is required")
    private QuestionType type;

    @NotBlank(message = "Content is required")
    private String content;

    private Map<String, Object> metadata;
    private Double weight;
    private String skillTag;
}
