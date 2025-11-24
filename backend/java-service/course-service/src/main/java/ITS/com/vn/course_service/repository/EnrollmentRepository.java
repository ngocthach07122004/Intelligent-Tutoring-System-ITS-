package ITS.com.vn.course_service.repository;

import ITS.com.vn.course_service.domain.entity.Enrollment;
import ITS.com.vn.course_service.domain.enums.EnrollmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    /**
     * Tìm enrollment theo course ID và student ID
     */
    Optional<Enrollment> findByCourseIdAndStudentId(Long courseId, Long studentId);

    /**
     * Kiểm tra student đã enroll vào course chưa
     */
    boolean existsByCourseIdAndStudentId(Long courseId, Long studentId);

    /**
     * Lấy tất cả enrollments của một student
     */
    List<Enrollment> findByStudentId(Long studentId);

    /**
     * Lấy enrollments của student theo status
     */
    List<Enrollment> findByStudentIdAndStatus(Long studentId, EnrollmentStatus status);

    /**
     * Lấy tất cả enrollments của một course
     */
    List<Enrollment> findByCourseId(Long courseId);

    /**
     * Lấy enrollments của course theo status
     */
    List<Enrollment> findByCourseIdAndStatus(Long courseId, EnrollmentStatus status);

    /**
     * Đếm tổng enrollments của course
     */
    Long countByCourseId(Long courseId);

    /**
     * Đếm số lượng enrollments của course (active only)
     */
    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.course.id = :courseId AND e.status = 'ACTIVE'")
    Long countActiveByCourseId(@Param("courseId") Long courseId);

    /**
     * Đếm số lượng enrollments hoàn thành
     */
    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.course.id = :courseId AND e.status = 'COMPLETED'")
    Long countCompletedByCourseId(@Param("courseId") Long courseId);

    /**
     * Lấy average progress của course
     */
    @Query("SELECT AVG(e.progress) FROM Enrollment e WHERE e.course.id = :courseId AND e.status = 'ACTIVE'")
    Double getAverageProgressByCourseId(@Param("courseId") Long courseId);
}
