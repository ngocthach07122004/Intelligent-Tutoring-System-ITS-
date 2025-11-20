package ITS.com.vn.identity_service.dto.request;

import lombok.Builder;
import lombok.Data;

import java.io.Serializable;

@Data
@Builder
public class ResetPasswordRequest implements Serializable {
        private String email;
        private String oldPassword;
        private String newPassword;
}
