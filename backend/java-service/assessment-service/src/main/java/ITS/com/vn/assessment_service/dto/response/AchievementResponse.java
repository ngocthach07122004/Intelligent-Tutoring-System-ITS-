package ITS.com.vn.assessment_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * Response cho Achievement API
 */
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
    private boolean earned; // Đã đạt được chưa
    private Instant earnedAt; // Thời điểm đạt được
    private Integer progress; // Tiến độ (0-100)
}
