package ITS.com.vn.assessment_service.dto.response;

import lombok.Data;
import java.time.Instant;

@Data
public class QuestionPoolResponse {
    private Long id;
    private String name;
    private String difficulty;
    private Boolean isPublic;
    private String instructorId;
    private Instant createdAt;
}
