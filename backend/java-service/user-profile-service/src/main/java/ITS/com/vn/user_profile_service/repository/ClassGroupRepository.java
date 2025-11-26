package ITS.com.vn.user_profile_service.repository;

import ITS.com.vn.user_profile_service.domain.entity.ClassGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClassGroupRepository extends JpaRepository<ClassGroup, Long> {
    Optional<ClassGroup> findByJoinCode(String joinCode);
}
