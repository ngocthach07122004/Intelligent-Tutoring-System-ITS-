package ITS.com.vn.user_profile_service.dto.response;

import ITS.com.vn.user_profile_service.domain.enums.GroupRole;
import lombok.Data;

@Data
public class GroupResponse {
    private Long id;
    private String name;
    private String description;
    private String joinCode;
    private GroupRole role; // Role of the current user in this group
    private Integer memberCount;
}
