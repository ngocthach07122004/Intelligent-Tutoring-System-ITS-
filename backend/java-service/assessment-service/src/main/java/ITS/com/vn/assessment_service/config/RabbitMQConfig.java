package ITS.com.vn.assessment_service.config;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    // Queue names - must match Course Service configuration
    public static final String STUDENT_ENROLLED_QUEUE = "student.enrolled.queue";

    @Bean
    public Queue studentEnrolledQueue() {
        return new Queue(STUDENT_ENROLLED_QUEUE, true);
    }

    /**
     * JSON Message Converter for deserializing events
     */
    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
