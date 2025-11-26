package ITS.com.vn.assessment_service.consumer;

import ITS.com.vn.assessment_service.dto.event.StudentEnrolledEvent;
import ITS.com.vn.assessment_service.service.GradebookService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

/**
 * Consumer lắng nghe StudentEnrolled events từ Course Service
 * Tạo Gradebook entry khi student enroll vào course
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class EnrollmentEventConsumer {

    private final GradebookService gradebookService;

    /**
     * Listen to student.enrolled.queue
     * Automatically creates gradebook entry when student enrolls
     */
    @RabbitListener(queues = "student.enrolled.queue")
    public void handleStudentEnrolled(StudentEnrolledEvent event) {
        log.info("Received StudentEnrolled event: enrollmentId={}, courseId={}, studentId={}, courseCode={}",
                event.getEnrollmentId(), event.getCourseId(), event.getStudentId(), event.getCourseCode());

        try {
            // Create gradebook entry for the enrolled student
            gradebookService.createGradebookForEnrollment(
                    event.getCourseId(),
                    event.getStudentId(),
                    event.getEnrolledAt());

            log.info("Successfully created gradebook for student {} in course {} ({})",
                    event.getStudentId(), event.getCourseId(), event.getCourseCode());

        } catch (Exception e) {
            log.error("Failed to create gradebook for student {} in course {}: {}",
                    event.getStudentId(), event.getCourseId(), e.getMessage(), e);

            // Rethrow exception to trigger retry or send to DLQ
            throw new RuntimeException("Failed to process StudentEnrolled event", e);
        }
    }
}
