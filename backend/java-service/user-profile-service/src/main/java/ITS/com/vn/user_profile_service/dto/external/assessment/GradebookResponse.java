package ITS.com.vn.user_profile_service.dto.external.assessment;

import lombok.Data;
import java.time.Instant;

@Data
public class GradebookResponse {
    private String studentId;
    private String studentName;
    private Long examId;
    private String examTitle;
    private Double score;
    private String status;
    private Instant gradedAt;
}
