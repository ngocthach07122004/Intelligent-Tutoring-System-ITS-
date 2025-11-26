package ITS.com.vn.user_profile_service.service;

import ITS.com.vn.user_profile_service.dto.request.SkillRequest;
import ITS.com.vn.user_profile_service.dto.response.SkillResponse;

import java.util.List;

public interface SkillService {

    /**
     * Lấy tất cả skills của một profile
     */
    List<SkillResponse> getSkillsByProfileId(Long profileId);

    /**
     * Lấy skills theo category
     */
    List<SkillResponse> getSkillsByProfileIdAndCategory(Long profileId, String category);

    /**
     * Thêm skill mới cho profile
     */
    SkillResponse addSkill(Long profileId, SkillRequest request);

    /**
     * Cập nhật skill
     */
    SkillResponse updateSkill(Long profileId, Long skillId, SkillRequest request);

    /**
     * Xóa skill
     */
    void deleteSkill(Long profileId, Long skillId);
}
