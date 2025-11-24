package ITS.com.vn.dashboard_service.client;

import ITS.com.vn.dashboard_service.dto.client.UserProfileDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;

@FeignClient(name = "user-profile-service", path = "/api/v1/profiles")
public interface ProfileClient {
    @GetMapping("/{userId}")
    UserProfileDTO getProfile(@PathVariable("userId") UUID userId);
}
