package ITS.com.vn.assessment_service.repository;

import ITS.com.vn.assessment_service.domain.entity.QuestionPool;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionPoolRepository extends JpaRepository<QuestionPool, Long> {
    List<QuestionPool> findByInstructorId(String instructorId);
}
