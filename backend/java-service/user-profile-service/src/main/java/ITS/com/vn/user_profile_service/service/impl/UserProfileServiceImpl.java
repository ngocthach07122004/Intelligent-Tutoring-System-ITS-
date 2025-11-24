package ITS.com.vn.user_profile_service.service.impl;

import ITS.com.vn.user_profile_service.domain.entity.UserProfile;
import ITS.com.vn.user_profile_service.dto.request.UserProfileRequest;
import ITS.com.vn.user_profile_service.dto.response.UserProfileResponse;
import ITS.com.vn.user_profile_service.mapper.UserProfileMapper;
import ITS.com.vn.user_profile_service.repository.UserProfileRepository;
import ITS.com.vn.user_profile_service.service.UserProfileService;
import ITS.com.vn.user_profile_service.util.JwtUtil;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class UserProfileServiceImpl implements UserProfileService {

    private final UserProfileRepository userProfileRepository;
    private final UserProfileMapper userProfileMapper;

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getMyProfile() {
        UUID userId = JwtUtil.getUserIdFromJwt();
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Profile not found for user: " + userId));
        return userProfileMapper.toResponse(profile);
    }

    @Override
    public UserProfileResponse updateMyProfile(UserProfileRequest request) {
        UUID userId = JwtUtil.getUserIdFromJwt();
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Profile not found for user: " + userId));

        userProfileMapper.updateEntityFromRequest(request, profile);
        profile = userProfileRepository.save(profile);
        return userProfileMapper.toResponse(profile);
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getProfile(UUID userId) {
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Profile not found for user: " + userId));
        return userProfileMapper.toResponse(profile);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserProfileResponse> getProfiles(List<UUID> userIds) {
        log.debug("Getting profiles for {} users", userIds.size());

        // Find all profiles by user IDs
        List<UserProfile> profiles = userIds.stream()
                .map(userId -> userProfileRepository.findByUserId(userId).orElse(null))
                .filter(profile -> profile != null)
                .collect(Collectors.toList());

        log.debug("Found {} profiles out of {} requested", profiles.size(), userIds.size());

        return profiles.stream()
                .map(userProfileMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void createProfile(UUID userId) {
        if (userProfileRepository.existsByUserId(userId)) {
            return; // Idempotency
        }
        UserProfile profile = UserProfile.builder()
                .userId(userId)
                .timezone("UTC")
                .build();
        userProfileRepository.save(profile);
    }
}
