package ITS.com.vn.course_service.service;

import ITS.com.vn.course_service.dto.event.StudentEnrolledEvent;

/**
 * Service để publish events qua RabbitMQ
 */
public interface EventPublisherService {

    /**
     * Publish StudentEnrolled event
     * 
     * @param event StudentEnrolledEvent
     */
    void publishStudentEnrolled(StudentEnrolledEvent event);
}
