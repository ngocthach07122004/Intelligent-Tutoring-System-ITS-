package ITS.com.vn.course_service.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    // Exchange names
    public static final String COURSE_EXCHANGE = "course.exchange";

    // Queue names
    public static final String STUDENT_ENROLLED_QUEUE = "student.enrolled.queue";

    // Routing keys
    public static final String STUDENT_ENROLLED_ROUTING_KEY = "student.enrolled";

    /**
     * Topic Exchange for course events
     */
    @Bean
    public TopicExchange courseExchange() {
        return new TopicExchange(COURSE_EXCHANGE);
    }

    /**
     * Queue for StudentEnrolled events
     * Assessment Service will consume from this queue
     */
    @Bean
    public Queue studentEnrolledQueue() {
        return QueueBuilder.durable(STUDENT_ENROLLED_QUEUE)
                .withArgument("x-dead-letter-exchange", COURSE_EXCHANGE + ".dlx")
                .withArgument("x-dead-letter-routing-key", "student.enrolled.dlq")
                .build();
    }

    /**
     * Binding: studentEnrolledQueue -> courseExchange with routing key
     */
    @Bean
    public Binding studentEnrolledBinding(Queue studentEnrolledQueue, TopicExchange courseExchange) {
        return BindingBuilder
                .bind(studentEnrolledQueue)
                .to(courseExchange)
                .with(STUDENT_ENROLLED_ROUTING_KEY);
    }

    /**
     * Dead Letter Queue for failed messages
     */
    @Bean
    public Queue studentEnrolledDLQ() {
        return new Queue(STUDENT_ENROLLED_QUEUE + ".dlq");
    }

    /**
     * Dead Letter Exchange
     */
    @Bean
    public DirectExchange deadLetterExchange() {
        return new DirectExchange(COURSE_EXCHANGE + ".dlx");
    }

    /**
     * Binding DLQ to DLX
     */
    @Bean
    public Binding deadLetterBinding(Queue studentEnrolledDLQ, DirectExchange deadLetterExchange) {
        return BindingBuilder
                .bind(studentEnrolledDLQ)
                .to(deadLetterExchange)
                .with("student.enrolled.dlq");
    }

    /**
     * JSON Message Converter
     */
    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    /**
     * RabbitTemplate with JSON converter
     */
    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(jsonMessageConverter());
        return rabbitTemplate;
    }
}
