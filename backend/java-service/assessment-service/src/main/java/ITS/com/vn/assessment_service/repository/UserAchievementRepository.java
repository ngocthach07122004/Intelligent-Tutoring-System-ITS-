package ITS.com.vn.assessment_service.repository;

import ITS.com.vn.assessment_service.domain.entity.UserAchievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserAchievementRepository extends JpaRepository<UserAchievement, Long> {

    List<UserAchievement> findByUserId(UUID userId);

    boolean existsByUserIdAndAchievementId(UUID userId, Long achievementId);
}
