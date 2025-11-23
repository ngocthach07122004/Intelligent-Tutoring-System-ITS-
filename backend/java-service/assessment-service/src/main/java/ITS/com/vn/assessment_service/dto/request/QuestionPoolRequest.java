package ITS.com.vn.assessment_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class QuestionPoolRequest {
    @NotBlank(message = "Pool name is required")
    private String name;

    private String difficulty;
    private Boolean isPublic;
}
