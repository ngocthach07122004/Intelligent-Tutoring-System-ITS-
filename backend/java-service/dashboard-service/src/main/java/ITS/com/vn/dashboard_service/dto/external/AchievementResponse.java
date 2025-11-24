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
    private String id;
    private String title;
    private String description;
    private String icon;
    private String category; // academic|attendance|participation|leadership|special
    private String rarity;   // common|uncommon|rare|legendary
    private boolean isEarned;
    private Instant earnedDate;
    private Progress progress;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Progress {
        private Integer current;
        private Integer target;
    }
}
