package ITS.com.vn.course_service.service.impl;

import ITS.com.vn.course_service.config.RabbitMQConfig;
import ITS.com.vn.course_service.dto.event.StudentEnrolledEvent;
import ITS.com.vn.course_service.service.EventPublisherService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventPublisherServiceImpl implements EventPublisherService {

    private final RabbitTemplate rabbitTemplate;

    @Override
    public void publishStudentEnrolled(StudentEnrolledEvent event) {
        try {
            log.info("Publishing StudentEnrolled event: enrollmentId={}, courseId={}, studentId={}",
                    event.getEnrollmentId(), event.getCourseId(), event.getStudentId());

            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.COURSE_EXCHANGE,
                    RabbitMQConfig.STUDENT_ENROLLED_ROUTING_KEY,
                    event);

            log.info("Successfully published StudentEnrolled event for enrollment {}", event.getEnrollmentId());
        } catch (Exception e) {
            log.error("Failed to publish StudentEnrolled event for enrollment {}: {}",
                    event.getEnrollmentId(), e.getMessage(), e);
            // Don't throw exception - enrollment already saved
            // Event publishing failure should not rollback the transaction
        }
    }
}
