package ITS.com.vn.dashboard_service.repository;

import ITS.com.vn.dashboard_service.domain.entity.KpiAggregate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KpiAggregateRepository extends JpaRepository<KpiAggregate, Long> {
    List<KpiAggregate> findByEntityId(String entityId);
}
