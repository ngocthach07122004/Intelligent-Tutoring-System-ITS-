package ITS.com.vn.user_profile_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillResponse {

    private Long id;
    private String skillName;
    private String category;
    private Integer level;
    private String description;
    private Instant createdAt;
    private Instant updatedAt;
}
