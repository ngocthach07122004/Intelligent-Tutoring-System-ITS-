package ITS.com.vn.assessment_service.dto.response;

import lombok.Data;
import java.time.Instant;
import java.util.List;
import java.util.Map;

@Data
public class ExamConfigResponse {
    private Long id;
    private String title;
    private Long courseId;
    private Long lessonId;
    private String policy;
    private Boolean browserLockEnabled;
    private Integer timeLimitMinutes;
    private Instant windowStart;
    private Instant windowEnd;
    private Map<String, Object> policyConfig;
    private String instructorId;
    private Instant createdAt;
    private List<ExamSectionRuleResponse> sections;
}
