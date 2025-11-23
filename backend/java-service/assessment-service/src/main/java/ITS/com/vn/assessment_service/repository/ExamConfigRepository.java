package ITS.com.vn.assessment_service.repository;

import ITS.com.vn.assessment_service.domain.entity.ExamConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ExamConfigRepository extends JpaRepository<ExamConfig, Long> {
    Optional<ExamConfig> findByLessonId(Long lessonId);
}
