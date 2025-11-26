package ITS.com.vn.user_profile_service.repository;

import ITS.com.vn.user_profile_service.domain.entity.UserSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserSkillRepository extends JpaRepository<UserSkill, Long> {

    List<UserSkill> findByProfileId(Long profileId);

    List<UserSkill> findByProfileIdAndCategory(Long profileId, String category);

    void deleteByProfileIdAndId(Long profileId, Long id);
}
