package ITS.com.vn.assessment_service.repository;

import ITS.com.vn.assessment_service.domain.entity.Attempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AttemptRepository extends JpaRepository<Attempt, Long> {
    List<Attempt> findByStudentIdAndExamConfigId(UUID studentId, Long examConfigId);

    List<Attempt> findByExamConfigId(Long examConfigId);
}
