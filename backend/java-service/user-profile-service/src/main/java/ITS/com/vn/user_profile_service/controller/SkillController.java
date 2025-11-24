package ITS.com.vn.user_profile_service.controller;

import ITS.com.vn.user_profile_service.dto.request.SkillRequest;
import ITS.com.vn.user_profile_service.dto.response.SkillResponse;
import ITS.com.vn.user_profile_service.repository.UserProfileRepository;
import ITS.com.vn.user_profile_service.service.SkillService;
import ITS.com.vn.user_profile_service.util.JwtUtil;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/profile")
@RequiredArgsConstructor
@Slf4j
public class SkillController {

    private final SkillService skillService;
    private final UserProfileRepository userProfileRepository;

    /**
     * Lấy skills của user hiện tại
     */
    @GetMapping("/skills")
    public ResponseEntity<List<SkillResponse>> getMySkills() {
        UUID userId = JwtUtil.getUserIdFromJwt();
        log.debug("Getting skills for current user: {}", userId);
        
        Long profileId = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Profile not found for user: " + userId))
                .getId();
        
        List<SkillResponse> skills = skillService.getSkillsByProfileId(profileId);
        return ResponseEntity.ok(skills);
    }

    /**
     * Lấy skills của user khác (public endpoint)
     */
    @GetMapping("/{userId}/skills")
    public ResponseEntity<List<SkillResponse>> getUserSkills(
            @PathVariable UUID userId,
            @RequestParam(required = false) String category) {
        
        log.debug("Getting skills for user: {}, category: {}", userId, category);
        
        Long profileId = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Profile not found for user: " + userId))
                .getId();
        
        List<SkillResponse> skills;
        if (category != null && !category.isEmpty()) {
            skills = skillService.getSkillsByProfileIdAndCategory(profileId, category);
        } else {
            skills = skillService.getSkillsByProfileId(profileId);
        }
        
        return ResponseEntity.ok(skills);
    }

    /**
     * Thêm skill mới
     */
    @PostMapping("/skills")
    public ResponseEntity<SkillResponse> addSkill(@Valid @RequestBody SkillRequest request) {
        UUID userId = JwtUtil.getUserIdFromJwt();
        log.debug("Adding skill for user: {}", userId);
        
        Long profileId = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Profile not found for user: " + userId))
                .getId();
        
        SkillResponse response = skillService.addSkill(profileId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Cập nhật skill
     */
    @PutMapping("/skills/{skillId}")
    public ResponseEntity<SkillResponse> updateSkill(
            @PathVariable Long skillId,
            @Valid @RequestBody SkillRequest request) {
        
        UUID userId = JwtUtil.getUserIdFromJwt();
        log.debug("Updating skill ID: {} for user: {}", skillId, userId);
        
        Long profileId = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Profile not found for user: " + userId))
                .getId();
        
        SkillResponse response = skillService.updateSkill(profileId, skillId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Xóa skill
     */
    @DeleteMapping("/skills/{skillId}")
    public ResponseEntity<Void> deleteSkill(@PathVariable Long skillId) {
        UUID userId = JwtUtil.getUserIdFromJwt();
        log.debug("Deleting skill ID: {} for user: {}", skillId, userId);
        
        Long profileId = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Profile not found for user: " + userId))
                .getId();
        
        skillService.deleteSkill(profileId, skillId);
        return ResponseEntity.noContent().build();
    }
}
