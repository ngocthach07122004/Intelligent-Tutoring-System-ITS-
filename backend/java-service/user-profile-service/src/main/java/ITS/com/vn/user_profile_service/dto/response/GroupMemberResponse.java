package ITS.com.vn.user_profile_service.dto.response;

import ITS.com.vn.user_profile_service.domain.enums.GroupRole;
import lombok.Data;
import java.time.Instant;
import java.util.UUID;

@Data
public class GroupMemberResponse {
    private UUID studentId;
    private GroupRole role;
    private Instant joinedAt;
}
