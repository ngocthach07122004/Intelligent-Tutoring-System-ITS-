package ITS.com.vn.course_service.client;

import ITS.com.vn.course_service.dto.external.UserProfileResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "user-profile-service", url = "${application.config.user-profile-url}")
public interface ProfileClient {

    @GetMapping("/api/v1/profile/{userId}")
    UserProfileResponse getProfile(@PathVariable("userId") String userId);
}
