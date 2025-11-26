package ITS.com.vn.course_service.service;

import ITS.com.vn.course_service.dto.request.EnrollmentRequest;
import ITS.com.vn.course_service.dto.response.EnrollmentResponse;

import java.util.List;

public interface EnrollmentService {

    /**
     * Đăng ký học khóa học
     * @param courseId ID của khóa học
     * @param studentId ID của sinh viên (từ JWT)
     * @return EnrollmentResponse
     * @throws IllegalStateException nếu đã enroll hoặc course đầy
     */
    EnrollmentResponse enrollStudent(Long courseId, Long studentId);

    /**
     * Lấy tất cả enrollments của student hiện tại
     * @param studentId ID của sinh viên
     * @return List of EnrollmentResponse
     */
    List<EnrollmentResponse> getMyEnrollments(Long studentId);

    /**
     * Lấy tất cả enrollments của một course (cho teacher)
     * @param courseId ID của khóa học
     * @return List of EnrollmentResponse
     */
    List<EnrollmentResponse> getCourseEnrollments(Long courseId);

    /**
     * Cập nhật tiến độ học tập
     * @param enrollmentId ID của enrollment
     * @param progress Tiến độ mới (0-100)
     * @param studentId ID của sinh viên (để verify ownership)
     * @return EnrollmentResponse
     */
    EnrollmentResponse updateProgress(Long enrollmentId, Integer progress, Long studentId);

    /**
     * Bỏ học (drop enrollment)
     * @param enrollmentId ID của enrollment
     * @param studentId ID của sinh viên (để verify ownership)
     */
    void dropEnrollment(Long enrollmentId, Long studentId);

    /**
     * Lấy enrollment cụ thể
     * @param enrollmentId ID của enrollment
     * @return EnrollmentResponse
     */
    EnrollmentResponse getEnrollment(Long enrollmentId);

    /**
     * Kiểm tra student đã enroll vào course chưa
     * @param courseId ID của khóa học
     * @param studentId ID của sinh viên
     * @return true nếu đã enroll
     */
    boolean isEnrolled(Long courseId, Long studentId);
}
