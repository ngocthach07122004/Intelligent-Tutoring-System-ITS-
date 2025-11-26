package ITS.com.vn.dashboard_service.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String EXCHANGE_NAME = "its.topic.exchange";
    public static final String QUEUE_DASHBOARD_ANALYTICS = "q.dashboard.analytics";
    public static final String ROUTING_KEY_EXAM_GRADED = "assessment.exam.graded";
    public static final String ROUTING_KEY_LESSON_COMPLETED = "course.lesson.completed";

    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(EXCHANGE_NAME);
    }

    @Bean
    public Queue dashboardQueue() {
        return QueueBuilder.durable(QUEUE_DASHBOARD_ANALYTICS).build();
    }

    @Bean
    public Binding bindingExamGraded(Queue dashboardQueue, TopicExchange exchange) {
        return BindingBuilder.bind(dashboardQueue).to(exchange).with(ROUTING_KEY_EXAM_GRADED);
    }

    @Bean
    public Binding bindingLessonCompleted(Queue dashboardQueue, TopicExchange exchange) {
        return BindingBuilder.bind(dashboardQueue).to(exchange).with(ROUTING_KEY_LESSON_COMPLETED);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public AmqpTemplate amqpTemplate(ConnectionFactory connectionFactory) {
        final RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(jsonMessageConverter());
        return rabbitTemplate;
    }
}
