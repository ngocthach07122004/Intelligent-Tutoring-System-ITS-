package ITS.com.vn.user_profile_service.dto.response;

import lombok.Data;
import java.util.UUID;

@Data
public class UserProfileResponse {
    private UUID userId;
    private String bio;
    private String timezone;
    private String learningStyle;
    private String avatarUrl;
}
