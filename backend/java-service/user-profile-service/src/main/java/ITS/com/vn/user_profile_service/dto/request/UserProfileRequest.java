package ITS.com.vn.user_profile_service.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserProfileRequest {
    @Size(max = 500, message = "Bio must be less than 500 characters")
    private String bio;

    private String timezone;
    private String learningStyle;
    private String avatarUrl;
}
