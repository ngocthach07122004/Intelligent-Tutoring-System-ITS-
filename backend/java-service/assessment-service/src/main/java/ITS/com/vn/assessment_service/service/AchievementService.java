package ITS.com.vn.assessment_service.service;

import ITS.com.vn.assessment_service.dto.response.AchievementResponse;

import java.util.List;
import java.util.UUID;

public interface AchievementService {

    /**
     * Lấy tất cả achievements của user
     * @param userId User ID
     * @return List of achievements (earned + available)
     */
    List<AchievementResponse> getUserAchievements(UUID userId);

    /**
     * Award achievement to user
     * @param userId User ID
     * @param achievementCode Achievement code
     */
    void awardAchievement(UUID userId, String achievementCode);
}
