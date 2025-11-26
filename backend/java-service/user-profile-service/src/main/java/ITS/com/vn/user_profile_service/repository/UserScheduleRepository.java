package ITS.com.vn.user_profile_service.repository;

import ITS.com.vn.user_profile_service.domain.entity.UserSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface UserScheduleRepository extends JpaRepository<UserSchedule, Long> {
    List<UserSchedule> findByProfileIdAndStartTimeBetween(Long profileId, Instant from, Instant to);
}
