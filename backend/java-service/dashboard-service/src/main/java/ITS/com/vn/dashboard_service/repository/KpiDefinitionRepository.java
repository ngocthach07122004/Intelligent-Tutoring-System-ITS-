package ITS.com.vn.dashboard_service.repository;

import ITS.com.vn.dashboard_service.domain.entity.KpiDefinition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KpiDefinitionRepository extends JpaRepository<KpiDefinition, String> {
}
