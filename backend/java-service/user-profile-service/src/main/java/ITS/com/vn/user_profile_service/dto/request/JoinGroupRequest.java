package ITS.com.vn.user_profile_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class JoinGroupRequest {
    @NotBlank(message = "Join code is required")
    private String joinCode;
}
