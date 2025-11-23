package ITS.com.vn.course_service.repository;

import ITS.com.vn.course_service.domain.entity.Lesson;
import ITS.com.vn.course_service.domain.enums.LessonType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {

    // Find lessons by chapter ID
    List<Lesson> findByChapterIdOrderBySequenceAsc(Long chapterId);

    // Find lessons by type
    List<Lesson> findByType(LessonType type);

    // Find lesson with all relationships
    @Query("SELECT l FROM Lesson l " +
            "LEFT JOIN FETCH l.assets " +
            "LEFT JOIN FETCH l.assignments " +
            "LEFT JOIN FETCH l.adaptiveRules " +
            "WHERE l.id = :id")
    Optional<Lesson> findByIdWithDetails(@Param("id") Long id);

    // Get max sequence for a chapter
    @Query("SELECT COALESCE(MAX(l.sequence), 0) FROM Lesson l WHERE l.chapter.id = :chapterId")
    Integer getMaxSequenceByChapterId(@Param("chapterId") Long chapterId);

    // Find next lesson in sequence
    @Query("SELECT l FROM Lesson l WHERE l.chapter.id = :chapterId AND l.sequence > :currentSequence ORDER BY l.sequence ASC")
    Optional<Lesson> findNextLesson(@Param("chapterId") Long chapterId,
            @Param("currentSequence") Integer currentSequence);
}
