package ITS.com.vn.assessment_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssessmentSkillResponse {
    private Map<String, Double> mastery;
}
