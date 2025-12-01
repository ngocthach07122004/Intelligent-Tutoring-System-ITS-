package ITS.com.vn.user_profile_service.consumer;

import ITS.com.vn.user_profile_service.domain.entity.UserProfile;
import ITS.com.vn.user_profile_service.dto.event.UserCreatedEvent;
import ITS.com.vn.user_profile_service.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ITS.com.vn.user_profile_service.config.RabbitMQConfig;

@Component
@RequiredArgsConstructor
@Slf4j
public class UserCreatedEventConsumer {

    private final UserProfileRepository userProfileRepository;

    @RabbitListener(queues = RabbitMQConfig.QUEUE_PROFILE_CREATE)
    @Transactional
    public void handleUserCreated(UserCreatedEvent event) {
        log.info("Received UserCreatedEvent for user: {}", event.getUsername());

        // Only create profile if user has STUDENT role
        if (event.getRoles() == null || !event.getRoles().contains("STUDENT")) {
            log.debug("User {} does not have STUDENT role, skipping profile creation", event.getUsername());
            return;
        }

        // Check if profile already exists
        if (userProfileRepository.existsByUserId(event.getUserId())) {
            log.warn("User profile already exists for user: {}", event.getUserId());
            return;
        }

        // Create user profile for student
        UserProfile profile = UserProfile.builder()
                .userId(event.getUserId())
                .timezone("UTC")
                .build();

        userProfileRepository.save(profile);
        log.info("Created user profile for student: {} ({})", event.getUsername(), event.getUserId());
    }
}
