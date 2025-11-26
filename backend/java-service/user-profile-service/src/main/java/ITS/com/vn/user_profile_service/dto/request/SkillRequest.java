package ITS.com.vn.user_profile_service.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillRequest {

    @NotBlank(message = "Skill name is required")
    private String skillName;

    private String category; // TECHNICAL, SOFT_SKILL, LANGUAGE

    @NotNull(message = "Level is required")
    @Min(value = 0, message = "Level must be between 0 and 100")
    @Max(value = 100, message = "Level must be between 0 and 100")
    private Integer level;

    private String description;
}
