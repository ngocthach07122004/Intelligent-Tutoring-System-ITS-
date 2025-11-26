package ITS.com.vn.assessment_service.dto.response;

import lombok.Data;
import java.time.Instant;

@Data
public class GradebookResponse {
    private String studentId;
    private String studentName; // Need to fetch from Profile Service if possible, or just ID
    private Long examId;
    private String examTitle;
    private Double score;
    private String status;
    private Instant gradedAt;
}
