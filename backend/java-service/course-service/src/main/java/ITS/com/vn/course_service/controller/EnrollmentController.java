package ITS.com.vn.course_service.controller;

import ITS.com.vn.course_service.dto.response.CourseStatistics;
import ITS.com.vn.course_service.dto.response.EnrollmentResponse;
import ITS.com.vn.course_service.security.SecurityUtils;
import ITS.com.vn.course_service.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    /**
     * Đăng ký học khóa học
     * POST /api/v1/courses/{courseId}/enroll
     */
    @PostMapping("/courses/{courseId}/enroll")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<EnrollmentResponse> enrollCourse(
            @PathVariable Long courseId,
            Authentication authentication) { // From JWT via filter

        String studentId = SecurityUtils.getUserId(authentication, true);
        log.info("Student {} enrolling in course {}", studentId, courseId);

        EnrollmentResponse response = enrollmentService.enrollStudent(courseId, studentId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Lấy tất cả khóa học của student hiện tại
     * GET /api/v1/courses/my-courses
     */
    @GetMapping("/courses/my-courses")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<EnrollmentResponse>> getMyCourses(
            Authentication authentication,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String q) { // Search query

        String studentId = SecurityUtils.getUserId(authentication, true);
        log.debug("Getting courses for student {}, status filter: {}, query: {}", studentId, status, q);

        List<EnrollmentResponse> enrollments = enrollmentService.getMyEnrollments(studentId);

        // Filter by status if provided
        if (status != null && !status.isEmpty()) {
            enrollments = enrollments.stream()
                    .filter(e -> e.getStatus().name().equalsIgnoreCase(status))
                    .toList();
        }

        // Filter by query if provided
        if (q != null && !q.isEmpty()) {
            String lowerQ = q.toLowerCase();
            enrollments = enrollments.stream()
                    .filter(e -> e.getCourseTitle().toLowerCase().contains(lowerQ) ||
                            e.getCourseCode().toLowerCase().contains(lowerQ))
                    .toList();
        }

        return ResponseEntity.ok(enrollments);
    }

    /**
     * Get course statistics for current user
     * GET /api/v1/courses/my-courses/stats
     */
    @GetMapping("/courses/my-courses/stats")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<CourseStatistics> getMyCourseStats(Authentication authentication) {
        String studentId = SecurityUtils.getUserId(authentication, true);
        return ResponseEntity.ok(enrollmentService.getCourseStatistics(studentId));
    }

    /**
     * Lấy danh sách sinh viên đã enroll vào course (Teacher only)
     * GET /api/v1/courses/{courseId}/enrollments
     */
    @GetMapping("/courses/{courseId}/enrollments")
    @PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
    public ResponseEntity<List<EnrollmentResponse>> getCourseEnrollments(
            @PathVariable Long courseId,
            @RequestParam(required = false) String status) {

        log.debug("Getting enrollments for course {}, status filter: {}", courseId, status);

        List<EnrollmentResponse> enrollments = enrollmentService.getCourseEnrollments(courseId);

        // Filter by status if provided
        if (status != null && !status.isEmpty()) {
            enrollments = enrollments.stream()
                    .filter(e -> e.getStatus().name().equalsIgnoreCase(status))
                    .toList();
        }

        return ResponseEntity.ok(enrollments);
    }

    /**
     * Cập nhật tiến độ học tập
     * PATCH /api/v1/enrollments/{enrollmentId}/progress
     */
    @PatchMapping("/enrollments/{enrollmentId}/progress")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<EnrollmentResponse> updateProgress(
            @PathVariable Long enrollmentId,
            @RequestBody Map<String, Integer> request,
            Authentication authentication) {

        String studentId = SecurityUtils.getUserId(authentication, true);
        Integer progress = request.get("progress");
        if (progress == null) {
            throw new IllegalArgumentException("Progress is required");
        }

        log.info("Updating progress for enrollment {} to {}%", enrollmentId, progress);

        EnrollmentResponse response = enrollmentService.updateProgress(enrollmentId, progress, studentId);
        return ResponseEntity.ok(response);
    }

    /**
     * Bỏ học (drop enrollment)
     * DELETE /api/v1/enrollments/{enrollmentId}
     */
    @DeleteMapping("/enrollments/{enrollmentId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Void> dropEnrollment(
            @PathVariable Long enrollmentId,
            Authentication authentication) {

        String studentId = SecurityUtils.getUserId(authentication, true);
        log.info("Student {} dropping enrollment {}", studentId, enrollmentId);

        enrollmentService.dropEnrollment(enrollmentId, studentId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Lấy thông tin enrollment cụ thể
     * GET /api/v1/enrollments/{enrollmentId}
     */
    @GetMapping("/enrollments/{enrollmentId}")
    public ResponseEntity<EnrollmentResponse> getEnrollment(@PathVariable Long enrollmentId) {
        log.debug("Getting enrollment {}", enrollmentId);

        EnrollmentResponse response = enrollmentService.getEnrollment(enrollmentId);
        return ResponseEntity.ok(response);
    }

    /**
     * Kiểm tra student đã enroll vào course chưa
     * GET /api/v1/courses/{courseId}/is-enrolled
     */
    @GetMapping("/courses/{courseId}/is-enrolled")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Map<String, Boolean>> isEnrolled(
            @PathVariable Long courseId,
            Authentication authentication) {

        String studentId = SecurityUtils.getUserId(authentication, true);
        boolean enrolled = enrollmentService.isEnrolled(courseId, studentId);
        return ResponseEntity.ok(Map.of("enrolled", enrolled));
    }

    /**
     * Lấy tất cả enrollments của một student cụ thể (Admin/System/Teacher)
     * GET /api/v1/enrollments/student/{studentId}
     */
    @GetMapping("/enrollments/student/{studentId}")
    @PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
    public ResponseEntity<List<EnrollmentResponse>> getStudentEnrollments(
            @PathVariable String studentId) {
        log.debug("Getting enrollments for student {}", studentId);
        return ResponseEntity.ok(enrollmentService.getMyEnrollments(studentId));
    }
}
