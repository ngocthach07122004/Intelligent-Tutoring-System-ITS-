package ITS.com.vn.identity_service.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String EXCHANGE = "user.events";
    public static final String QUEUE = "user.created.queue";
    public static final String ROUTING_KEY = "user.created";

    @Bean
    public TopicExchange userEventsExchange() {
        return new TopicExchange(EXCHANGE);
    }

    @Bean
    public Queue userCreatedQueue() {
        return new Queue(QUEUE, true);
    }

    @Bean
    public Binding binding(Queue userCreatedQueue, TopicExchange userEventsExchange) {
        return BindingBuilder
                .bind(userCreatedQueue)
                .to(userEventsExchange)
                .with(ROUTING_KEY);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter());
        return template;
    }
}
