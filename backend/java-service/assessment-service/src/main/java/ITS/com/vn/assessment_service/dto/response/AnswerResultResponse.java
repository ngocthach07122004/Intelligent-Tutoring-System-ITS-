package ITS.com.vn.assessment_service.dto.response;

import lombok.Data;

@Data
public class AnswerResultResponse {
    private Long questionId;
    private Object yourAnswer;
    private Boolean correct;
    private Double score;
}
