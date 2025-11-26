package ITS.com.vn.assessment_service.dto.response;

import lombok.Data;
import java.util.List;

@Data
public class AttemptResultResponse {
    private Long attemptId;
    private Double score;
    private Double maxScore;
    private Boolean passed;
    private String feedback;
    private List<AnswerResultResponse> answers;
}
