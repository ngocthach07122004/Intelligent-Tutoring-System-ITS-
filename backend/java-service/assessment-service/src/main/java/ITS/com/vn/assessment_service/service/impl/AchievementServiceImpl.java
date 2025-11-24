package ITS.com.vn.assessment_service.service.impl;

import ITS.com.vn.assessment_service.domain.entity.Achievement;
import ITS.com.vn.assessment_service.domain.entity.UserAchievement;
import ITS.com.vn.assessment_service.dto.response.AchievementResponse;
import ITS.com.vn.assessment_service.repository.AchievementRepository;
import ITS.com.vn.assessment_service.repository.UserAchievementRepository;
import ITS.com.vn.assessment_service.service.AchievementService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class AchievementServiceImpl implements AchievementService {

    private final AchievementRepository achievementRepository;
    private final UserAchievementRepository userAchievementRepository;

    @Override
    public List<AchievementResponse> getUserAchievements(UUID userId) {
        log.debug("Getting achievements for user {}", userId);

        // Lấy tất cả achievements
        List<Achievement> allAchievements = achievementRepository.findAll();

        // Lấy achievements đã đạt được
        List<UserAchievement> userAchievements = userAchievementRepository.findByUserId(userId);
        Map<Long, UserAchievement> earnedMap = userAchievements.stream()
                .collect(Collectors.toMap(
                        ua -> ua.getAchievement().getId(),
                        ua -> ua
                ));

        // Map to response
        return allAchievements.stream()
                .map(achievement -> {
                    UserAchievement userAchievement = earnedMap.get(achievement.getId());
                    boolean earned = userAchievement != null;
                    Integer progress = userAchievement != null ? userAchievement.getProgress() : 0;
                    return AchievementResponse.builder()
                            .id(achievement.getId())
                            .code(achievement.getCode())
                            .name(achievement.getName())
                            .description(achievement.getDescription())
                            .iconUrl(achievement.getIconUrl())
                            .icon(achievement.getIconUrl())
                            .points(achievement.getPoints())
                            .category(achievement.getCategory())
                            .rarity("common")
                            .earned(earned)
                            .isEarned(earned)
                            .earnedAt(earned ? userAchievement.getEarnedAt() : null)
                            .progress(progress)
                            .progressDetail(new AchievementResponse.AchievementProgress(progress, 100))
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void awardAchievement(UUID userId, String achievementCode) {
        log.info("Awarding achievement {} to user {}", achievementCode, userId);

        Achievement achievement = achievementRepository.findByCode(achievementCode)
                .orElseThrow(() -> new IllegalArgumentException("Achievement not found: " + achievementCode));

        // Check if already awarded
        if (userAchievementRepository.existsByUserIdAndAchievementId(userId, achievement.getId())) {
            log.info("User {} already has achievement {}", userId, achievementCode);
            return;
        }

        // Award achievement
        UserAchievement userAchievement = UserAchievement.builder()
                .userId(userId)
                .achievement(achievement)
                .progress(100)
                .build();

        userAchievementRepository.save(userAchievement);
        log.info("Awarded achievement {} to user {}", achievementCode, userId);
    }
}
