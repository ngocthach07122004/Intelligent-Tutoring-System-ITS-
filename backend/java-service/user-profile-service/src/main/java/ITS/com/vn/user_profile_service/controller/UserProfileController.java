package ITS.com.vn.user_profile_service.controller;

import ITS.com.vn.user_profile_service.dto.request.UserProfileRequest;
import ITS.com.vn.user_profile_service.dto.response.UserProfileResponse;
import ITS.com.vn.user_profile_service.service.UserProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/profiles")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService userProfileService;

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getMyProfile() {
        return ResponseEntity.ok(userProfileService.getMyProfile());
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileResponse> updateMyProfile(@Valid @RequestBody UserProfileRequest request) {
        return ResponseEntity.ok(userProfileService.updateMyProfile(request));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserProfileResponse> getProfile(@PathVariable UUID userId) {
        return ResponseEntity.ok(userProfileService.getProfile(userId));
    }

    /**
     * Bulk get user profiles by user IDs
     * Example: GET /api/v1/profiles/users?ids=uuid1,uuid2,uuid3
     */
    @GetMapping("/users")
    public ResponseEntity<List<UserProfileResponse>> getProfiles(@RequestParam List<UUID> ids) {
        return ResponseEntity.ok(userProfileService.getProfiles(ids));
    }
}
