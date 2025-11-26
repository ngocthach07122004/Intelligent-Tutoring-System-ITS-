package ITS.com.vn.assessment_service.repository;

import ITS.com.vn.assessment_service.domain.entity.Gradebook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GradebookRepository extends JpaRepository<Gradebook, Long> {
    Page<Gradebook> findByCourseId(Long courseId, Pageable pageable);

    Page<Gradebook> findByCourseIdAndStudentId(Long courseId, UUID studentId, Pageable pageable);

    List<Gradebook> findByStudentId(UUID studentId);
}
