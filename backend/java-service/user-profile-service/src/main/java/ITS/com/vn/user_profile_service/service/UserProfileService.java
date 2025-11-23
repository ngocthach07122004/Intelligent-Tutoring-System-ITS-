package ITS.com.vn.user_profile_service.service;

import ITS.com.vn.user_profile_service.dto.request.UserProfileRequest;
import ITS.com.vn.user_profile_service.dto.response.UserProfileResponse;

import java.util.UUID;

public interface UserProfileService {
    UserProfileResponse getMyProfile();

    UserProfileResponse updateMyProfile(UserProfileRequest request);

    UserProfileResponse getProfile(UUID userId);

    void createProfile(UUID userId); // For internal use / event consumer
}
