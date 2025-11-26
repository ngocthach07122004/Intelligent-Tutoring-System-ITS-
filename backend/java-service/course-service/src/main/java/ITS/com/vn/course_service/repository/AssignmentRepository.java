package ITS.com.vn.course_service.repository;

import ITS.com.vn.course_service.domain.entity.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {

    // Find assignments by lesson ID
    List<Assignment> findByLessonId(Long lessonId);
}
