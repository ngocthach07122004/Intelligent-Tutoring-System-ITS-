package ITS.com.vn.assessment_service.repository;

import ITS.com.vn.assessment_service.domain.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByPoolId(Long poolId);

    @Query(value = "SELECT * FROM question WHERE pool_id = :poolId ORDER BY RANDOM() LIMIT :limit", nativeQuery = true)
    List<Question> findRandomQuestionsByPoolId(Long poolId, int limit);
}
