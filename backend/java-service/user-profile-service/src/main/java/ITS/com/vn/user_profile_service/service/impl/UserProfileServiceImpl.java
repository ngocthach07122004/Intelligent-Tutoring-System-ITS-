package ITS.com.vn.user_profile_service.service.impl;

import ITS.com.vn.user_profile_service.domain.entity.UserProfile;
import ITS.com.vn.user_profile_service.dto.request.UserProfileRequest;
import ITS.com.vn.user_profile_service.dto.response.UserProfileResponse;
import ITS.com.vn.user_profile_service.mapper.UserProfileMapper;
import ITS.com.vn.user_profile_service.repository.UserProfileRepository;
import ITS.com.vn.user_profile_service.service.UserProfileService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class UserProfileServiceImpl implements UserProfileService {

    private final UserProfileRepository userProfileRepository;
    private final UserProfileMapper userProfileMapper;

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getMyProfile() {
        UUID userId = getCurrentUserId();
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Profile not found for user: " + userId));
        return userProfileMapper.toResponse(profile);
    }

    @Override
    public UserProfileResponse updateMyProfile(UserProfileRequest request) {
        UUID userId = getCurrentUserId();
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

    private UUID getCurrentUserId() {
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            try {
                return UUID.fromString(SecurityContextHolder.getContext().getAuthentication().getName());
            } catch (IllegalArgumentException e) {
                // For testing or system calls
                return UUID.randomUUID();
            }
        }
        throw new IllegalStateException("No authenticated user found");
    }
}
