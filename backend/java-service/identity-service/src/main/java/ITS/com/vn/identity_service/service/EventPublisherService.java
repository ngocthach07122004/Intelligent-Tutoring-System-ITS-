package ITS.com.vn.identity_service.service;

import ITS.com.vn.identity_service.dto.event.UserCreatedEvent;
import ITS.com.vn.identity_service.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventPublisherService {

    private final RabbitTemplate rabbitTemplate;
    private static final String EXCHANGE = "user.events";
    private static final String ROUTING_KEY = "user.created";

    public void publishUserCreated(User user) {
        UserCreatedEvent event = UserCreatedEvent.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .roles(user.getRoles())
                .createdAt(user.getCreatedAt())
                .build();

        log.info("Publishing UserCreatedEvent for user: {}", user.getUsername());
        rabbitTemplate.convertAndSend(EXCHANGE, ROUTING_KEY, event);
    }
}
