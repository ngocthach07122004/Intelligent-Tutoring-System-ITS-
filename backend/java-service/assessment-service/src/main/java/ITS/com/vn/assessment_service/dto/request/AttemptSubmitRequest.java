package ITS.com.vn.assessment_service.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import java.util.List;

@Data
public class AttemptSubmitRequest {
    @NotEmpty(message = "Answers cannot be empty")
    private List<AnswerRequest> answers;
}
