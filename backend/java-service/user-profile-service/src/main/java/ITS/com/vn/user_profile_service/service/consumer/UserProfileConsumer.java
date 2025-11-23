package ITS.com.vn.user_profile_service.service.consumer;

import ITS.com.vn.user_profile_service.config.RabbitMQConfig;
import ITS.com.vn.user_profile_service.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserProfileConsumer {

    private final UserProfileService userProfileService;

    @RabbitListener(queues = RabbitMQConfig.QUEUE_PROFILE_CREATE)
    public void handleUserRegistered(Map<String, Object> event) {
        log.info("Received USER_REGISTERED event: {}", event);
        try {
            String userIdStr = (String) event.get("userId");
            if (userIdStr != null) {
                UUID userId = UUID.fromString(userIdStr);
                userProfileService.createProfile(userId);
                log.info("Profile created for user: {}", userId);
            } else {
                log.warn("Event does not contain userId: {}", event);
            }
        } catch (Exception e) {
            log.error("Error processing USER_REGISTERED event", e);
            // Throwing exception to trigger retry/DLQ if configured
            throw e;
        }
    }
}
