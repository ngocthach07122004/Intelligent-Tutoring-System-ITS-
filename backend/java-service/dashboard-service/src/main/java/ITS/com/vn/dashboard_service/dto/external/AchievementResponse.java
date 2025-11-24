package ITS.com.vn.dashboard_service.dto.external;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AchievementResponse {
    private Long id;
    private String code;
    private String name;
    private String description;
    private String iconUrl;
    private Integer points;
    private String category;
    private boolean earned;
    private Instant earnedAt;
    private Integer progress;
}
