package ITS.com.vn.dashboard_service.dto.client;

import lombok.Data;
import java.util.Map;

@Data
public class AssessmentSkillDTO {
    private Map<String, Double> mastery; // Skill -> Score
}
