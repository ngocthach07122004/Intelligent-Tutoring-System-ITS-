package ITS.com.vn.course_service.repository;

import ITS.com.vn.course_service.domain.entity.Chapter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChapterRepository extends JpaRepository<Chapter, Long> {

    // Find chapters by version ID
    List<Chapter> findByVersionIdOrderBySequenceAsc(Long versionId);

    // Find chapter with lessons
    @Query("SELECT c FROM Chapter c LEFT JOIN FETCH c.lessons WHERE c.id = :id")
    Optional<Chapter> findByIdWithLessons(@Param("id") Long id);

    // Get max sequence for a version
    @Query("SELECT COALESCE(MAX(c.sequence), 0) FROM Chapter c WHERE c.version.id = :versionId")
    Integer getMaxSequenceByVersionId(@Param("versionId") Long versionId);
}
