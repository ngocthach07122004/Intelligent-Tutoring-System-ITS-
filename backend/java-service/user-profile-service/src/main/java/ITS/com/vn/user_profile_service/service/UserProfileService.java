package ITS.com.vn.user_profile_service.service;

import ITS.com.vn.user_profile_service.dto.request.UserProfileRequest;
import ITS.com.vn.user_profile_service.dto.response.UserProfileResponse;

import java.util.List;
import java.util.UUID;

public interface UserProfileService {
    UserProfileResponse getMyProfile();

    UserProfileResponse updateMyProfile(UserProfileRequest request);

    UserProfileResponse getProfile(UUID userId);

    List<UserProfileResponse> getProfiles(List<UUID> userIds);

    void createProfile(UUID userId); // For internal use / event consumer
}

