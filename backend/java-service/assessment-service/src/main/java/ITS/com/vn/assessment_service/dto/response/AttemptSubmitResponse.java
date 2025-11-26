package ITS.com.vn.assessment_service.dto.response;

import lombok.Data;
import java.time.Instant;

@Data
public class AttemptSubmitResponse {
    private String message;
    private Instant submittedAt;
}
