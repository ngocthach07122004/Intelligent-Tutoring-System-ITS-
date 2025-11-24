package ITS.com.vn.course_service.service.impl;

import ITS.com.vn.course_service.domain.entity.Course;
import ITS.com.vn.course_service.domain.entity.Enrollment;
import ITS.com.vn.course_service.domain.enums.EnrollmentStatus;
import ITS.com.vn.course_service.dto.event.StudentEnrolledEvent;
import ITS.com.vn.course_service.dto.request.EnrollmentRequest;
import ITS.com.vn.course_service.dto.response.EnrollmentResponse;
import ITS.com.vn.course_service.repository.CourseRepository;
import ITS.com.vn.course_service.repository.EnrollmentRepository;
import ITS.com.vn.course_service.service.EnrollmentService;
import ITS.com.vn.course_service.service.EventPublisherService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class EnrollmentServiceImpl implements EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final EventPublisherService eventPublisherService;

    @Override
    public EnrollmentResponse enrollStudent(Long courseId, Long studentId) {
        log.info("Enrolling student {} to course {}", studentId, courseId);

        // 1. Kiểm tra course tồn tại
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new EntityNotFoundException("Course not found with ID: " + courseId));

        // 2. Kiểm tra đã enroll chưa
        if (enrollmentRepository.existsByCourseIdAndStudentId(courseId, studentId)) {
            throw new IllegalStateException("Student already enrolled in this course");
        }

        // 3. Kiểm tra course đã đầy chưa (nếu có maxStudents)
        if (course.getMaxStudents() != null) {
            Long currentEnrollments = enrollmentRepository.countActiveByCourseId(courseId);
            if (currentEnrollments >= course.getMaxStudents()) {
                throw new IllegalStateException("Course is full. Maximum students: " + course.getMaxStudents());
            }
        }

        // 4. Tạo enrollment mới
        Enrollment enrollment = Enrollment.builder()
                .course(course)
                .studentId(studentId)
                .status(EnrollmentStatus.ACTIVE)
                .progress(0)
                .build();

        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);
        log.info("Successfully enrolled student {} to course {}. Enrollment ID: {}",
                studentId, courseId, savedEnrollment.getId());

        // 5. Publish StudentEnrolled event
        StudentEnrolledEvent event = StudentEnrolledEvent.builder()
                .enrollmentId(savedEnrollment.getId())
                .courseId(course.getId())
                .courseCode(course.getCode())
                .courseTitle(course.getTitle())
                .studentId(studentId)
                .enrolledAt(savedEnrollment.getEnrolledAt())
                .eventType("STUDENT_ENROLLED")
                .timestamp(LocalDateTime.now())
                .build();

        eventPublisherService.publishStudentEnrolled(event);

        return mapToResponse(savedEnrollment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EnrollmentResponse> getMyEnrollments(Long studentId) {
        log.debug("Getting enrollments for student {}", studentId);

        List<Enrollment> enrollments = enrollmentRepository.findByStudentId(studentId);

        return enrollments.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EnrollmentResponse> getCourseEnrollments(Long courseId) {
        log.debug("Getting enrollments for course {}", courseId);

        // Verify course exists
        if (!courseRepository.existsById(courseId)) {
            throw new EntityNotFoundException("Course not found with ID: " + courseId);
        }

        List<Enrollment> enrollments = enrollmentRepository.findByCourseId(courseId);

        return enrollments.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public EnrollmentResponse updateProgress(Long enrollmentId, Integer progress, Long studentId) {
        log.debug("Updating progress for enrollment {} to {}%", enrollmentId, progress);

        // Validate progress range
        if (progress < 0 || progress > 100) {
            throw new IllegalArgumentException("Progress must be between 0 and 100");
        }

        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new EntityNotFoundException("Enrollment not found with ID: " + enrollmentId));

        // Verify ownership
        if (!enrollment.getStudentId().equals(studentId)) {
            throw new IllegalStateException("Enrollment does not belong to student ID: " + studentId);
        }

        // Update progress (helper method handles auto-completion)
        enrollment.updateProgress(progress);

        Enrollment updatedEnrollment = enrollmentRepository.save(enrollment);
        log.info("Updated progress for enrollment {} to {}%. Status: {}",
                enrollmentId, progress, updatedEnrollment.getStatus());

        return mapToResponse(updatedEnrollment);
    }

    @Override
    public void dropEnrollment(Long enrollmentId, Long studentId) {
        log.info("Dropping enrollment {} for student {}", enrollmentId, studentId);

        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new EntityNotFoundException("Enrollment not found with ID: " + enrollmentId));

        // Verify ownership
        if (!enrollment.getStudentId().equals(studentId)) {
            throw new IllegalStateException("Enrollment does not belong to student ID: " + studentId);
        }

        // Check if already dropped or completed
        if (enrollment.getStatus() == EnrollmentStatus.DROPPED) {
            throw new IllegalStateException("Enrollment already dropped");
        }

        if (enrollment.getStatus() == EnrollmentStatus.COMPLETED) {
            throw new IllegalStateException("Cannot drop a completed course");
        }

        enrollment.drop();
        enrollmentRepository.save(enrollment);

        log.info("Successfully dropped enrollment {}", enrollmentId);
    }

    @Override
    @Transactional(readOnly = true)
    public EnrollmentResponse getEnrollment(Long enrollmentId) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new EntityNotFoundException("Enrollment not found with ID: " + enrollmentId));

        return mapToResponse(enrollment);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isEnrolled(Long courseId, Long studentId) {
        return enrollmentRepository.existsByCourseIdAndStudentId(courseId, studentId);
    }

    // Helper method to map entity to response
    private EnrollmentResponse mapToResponse(Enrollment enrollment) {
        Course course = enrollment.getCourse();

        return EnrollmentResponse.builder()
                .id(enrollment.getId())
                .courseId(course.getId())
                .courseTitle(course.getTitle())
                .courseCode(course.getCode())
                .courseSemester(course.getSemester())
                .courseSchedule(course.getSchedule())
                .courseCredits(course.getCredits())
                .courseMaxStudents(course.getMaxStudents())
                .courseThumbnailUrl(course.getThumbnailUrl())
                .studentId(enrollment.getStudentId())
                .status(enrollment.getStatus())
                .progress(enrollment.getProgress())
                .enrolledAt(enrollment.getEnrolledAt())
                .completedAt(enrollment.getCompletedAt())
                .lastAccessAt(enrollment.getLastAccessAt())
                .updatedAt(enrollment.getUpdatedAt())
                .build();
    }
}
