package ITS.com.vn.assessment_service.dto.response;

import lombok.Data;
import java.time.Instant;
import java.util.List;

@Data
public class AttemptStartResponse {
    private Long attemptId;
    private List<QuestionResponse> questions;
    private Integer timeLimit;
    private Instant startedAt;
}
