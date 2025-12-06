package ITS.com.vn.user_profile_service.dto.student;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Achievement {
    private String id;
    private String title;
    private String description;
    private String icon;
    private String category; // 'academic' | 'attendance' | 'participation'
    private String rarity; // 'common' | 'uncommon' | 'rare' | 'legendary'
    private Boolean isEarned;
    private String earnedDate;
    private ProgressInfo progress;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProgressInfo {
        private Integer current;
        private Integer target;
    }
}
