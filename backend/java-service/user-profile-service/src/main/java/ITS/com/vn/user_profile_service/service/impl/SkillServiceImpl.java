package ITS.com.vn.user_profile_service.service.impl;

import ITS.com.vn.user_profile_service.domain.entity.UserProfile;
import ITS.com.vn.user_profile_service.domain.entity.UserSkill;
import ITS.com.vn.user_profile_service.dto.request.SkillRequest;
import ITS.com.vn.user_profile_service.dto.response.SkillResponse;
import ITS.com.vn.user_profile_service.repository.UserProfileRepository;
import ITS.com.vn.user_profile_service.repository.UserSkillRepository;
import ITS.com.vn.user_profile_service.service.SkillService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class SkillServiceImpl implements SkillService {

    private final UserSkillRepository userSkillRepository;
    private final UserProfileRepository userProfileRepository;

    @Override
    @Transactional(readOnly = true)
    public List<SkillResponse> getSkillsByProfileId(Long profileId) {
        log.debug("Getting skills for profile ID: {}", profileId);
        List<UserSkill> skills = userSkillRepository.findByProfileId(profileId);
        return skills.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SkillResponse> getSkillsByProfileIdAndCategory(Long profileId, String category) {
        log.debug("Getting skills for profile ID: {} and category: {}", profileId, category);
        List<UserSkill> skills = userSkillRepository.findByProfileIdAndCategory(profileId, category);
        return skills.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public SkillResponse addSkill(Long profileId, SkillRequest request) {
        log.debug("Adding skill for profile ID: {}", profileId);

        UserProfile profile = userProfileRepository.findById(profileId)
                .orElseThrow(() -> new RuntimeException("Profile not found with ID: " + profileId));

        UserSkill skill = UserSkill.builder()
                .profile(profile)
                .skillName(request.getSkillName())
                .category(request.getCategory())
                .level(request.getLevel())
                .description(request.getDescription())
                .build();

        UserSkill savedSkill = userSkillRepository.save(skill);
        log.info("Added skill ID: {} for profile ID: {}", savedSkill.getId(), profileId);

        return mapToResponse(savedSkill);
    }

    @Override
    public SkillResponse updateSkill(Long profileId, Long skillId, SkillRequest request) {
        log.debug("Updating skill ID: {} for profile ID: {}", skillId, profileId);

        UserSkill skill = userSkillRepository.findById(skillId)
                .orElseThrow(() -> new RuntimeException("Skill not found with ID: " + skillId));

        // Verify skill belongs to the profile
        if (!skill.getProfile().getId().equals(profileId)) {
            throw new RuntimeException("Skill does not belong to profile ID: " + profileId);
        }

        skill.setSkillName(request.getSkillName());
        skill.setCategory(request.getCategory());
        skill.setLevel(request.getLevel());
        skill.setDescription(request.getDescription());

        UserSkill updatedSkill = userSkillRepository.save(skill);
        log.info("Updated skill ID: {}", skillId);

        return mapToResponse(updatedSkill);
    }

    @Override
    public void deleteSkill(Long profileId, Long skillId) {
        log.debug("Deleting skill ID: {} for profile ID: {}", skillId, profileId);

        UserSkill skill = userSkillRepository.findById(skillId)
                .orElseThrow(() -> new RuntimeException("Skill not found with ID: " + skillId));

        // Verify skill belongs to the profile
        if (!skill.getProfile().getId().equals(profileId)) {
            throw new RuntimeException("Skill does not belong to profile ID: " + profileId);
        }

        userSkillRepository.delete(skill);
        log.info("Deleted skill ID: {}", skillId);
    }

    private SkillResponse mapToResponse(UserSkill skill) {
        return SkillResponse.builder()
                .id(skill.getId())
                .skillName(skill.getSkillName())
                .category(skill.getCategory())
                .level(skill.getLevel())
                .description(skill.getDescription())
                .createdAt(skill.getCreatedAt())
                .updatedAt(skill.getUpdatedAt())
                .build();
    }
}
