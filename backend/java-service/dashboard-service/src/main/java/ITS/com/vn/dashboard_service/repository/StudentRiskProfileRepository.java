package ITS.com.vn.dashboard_service.repository;

import ITS.com.vn.dashboard_service.domain.entity.StudentRiskProfile;
import ITS.com.vn.dashboard_service.domain.enums.RiskLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface StudentRiskProfileRepository extends JpaRepository<StudentRiskProfile, UUID> {
    List<StudentRiskProfile> findByRiskLevel(RiskLevel riskLevel);
}
