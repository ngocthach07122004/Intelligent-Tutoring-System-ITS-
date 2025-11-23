package ITS.com.vn.assessment_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Data
public class ExamConfigRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Course ID is required")
    private Long courseId;

    private Long lessonId;
    private String policy;
    private Boolean browserLockEnabled;
    private Integer timeLimitMinutes;
    private Instant windowStart;
    private Instant windowEnd;
    private Map<String, Object> policyConfig;

    private List<ExamSectionRuleRequest> sections;
}
