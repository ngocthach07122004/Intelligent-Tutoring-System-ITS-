package ITS.com.vn.user_profile_service.config;

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
    public static final String QUEUE_PROFILE_CREATE = "q.profile.create";
    public static final String ROUTING_KEY_USER_REGISTERED = "identity.user.registered";

    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(EXCHANGE_NAME);
    }

    @Bean
    public Queue profileCreateQueue() {
        return QueueBuilder.durable(QUEUE_PROFILE_CREATE).build();
    }

    @Bean
    public Binding bindingProfileCreate(Queue profileCreateQueue, TopicExchange exchange) {
        return BindingBuilder.bind(profileCreateQueue).to(exchange).with(ROUTING_KEY_USER_REGISTERED);
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
