package ITS.com.vn.dashboard_service.client;

import ITS.com.vn.dashboard_service.dto.external.UserProfileResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "user-profile-service", url = "${application.config.user-profile-url}")
public interface UserProfileClient {

    @GetMapping("/api/v1/profile/me")
    UserProfileResponse getMyProfile();
    
    @GetMapping("/api/v1/profile/{userId}")
    UserProfileResponse getUserProfile(@PathVariable("userId") String userId);
}
