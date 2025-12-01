package ITS.com.vn.course_service.repository;

import ITS.com.vn.course_service.domain.entity.Course;
import ITS.com.vn.course_service.domain.enums.CourseStatus;
import ITS.com.vn.course_service.domain.enums.CourseVisibility;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

        // Find by instructor
        Page<Course> findByInstructorId(String instructorId, Pageable pageable);

        // Find by status
        Page<Course> findByStatus(CourseStatus status, Pageable pageable);

        // Find by semester
        Page<Course> findBySemester(String semester, Pageable pageable);

        // Find by visibility
        Page<Course> findByVisibility(CourseVisibility visibility, Pageable pageable);

        // Find published and public courses
        Page<Course> findByStatusAndVisibility(CourseStatus status, CourseVisibility visibility, Pageable pageable);

        // Find by instructor and status
        Page<Course> findByInstructorIdAndStatus(String instructorId, CourseStatus status, Pageable pageable);

        // Search by title
        @Query("SELECT c FROM Course c WHERE LOWER(c.title) LIKE LOWER(CONCAT('%', :keyword, '%'))")
        Page<Course> searchByTitle(@Param("keyword") String keyword, Pageable pageable);

        // Search published courses by title
        @Query("SELECT c FROM Course c WHERE c.status = :status AND LOWER(c.title) LIKE LOWER(CONCAT('%', :keyword, '%'))")
        Page<Course> searchByTitleAndStatus(@Param("keyword") String keyword, @Param("status") CourseStatus status,
                        Pageable pageable);

        @Query("SELECT c FROM Course c WHERE c.status = :status AND c.semester = :semester")
        Page<Course> findByStatusAndSemester(@Param("status") CourseStatus status,
                        @Param("semester") String semester, Pageable pageable);

        Page<Course> findByIdIn(List<Long> ids, Pageable pageable);

        Page<Course> findByIdInAndSemester(List<Long> ids, String semester, Pageable pageable);

        // Find courses with tags
        @Query("SELECT DISTINCT c FROM Course c JOIN c.courseTags ct WHERE ct.tag.id IN :tagIds")
        Page<Course> findByTagIds(@Param("tagIds") List<Long> tagIds, Pageable pageable);

        // Check if course exists and belongs to instructor
        boolean existsByIdAndInstructorId(Long id, String instructorId);

        // Find course with all relationships eagerly loaded
        @Query("SELECT c FROM Course c " +
                        "LEFT JOIN FETCH c.versions v " +
                        "LEFT JOIN FETCH v.chapters ch " +
                        "LEFT JOIN FETCH ch.lessons " +
                        "WHERE c.id = :id")
        Optional<Course> findByIdWithDetails(@Param("id") Long id);
}
