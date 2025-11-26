package ITS.com.vn.user_profile_service.dto.request;

import ITS.com.vn.user_profile_service.domain.enums.GroupRole;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PromoteMemberRequest {
    @NotNull(message = "Role is required")
    private GroupRole role;
}
