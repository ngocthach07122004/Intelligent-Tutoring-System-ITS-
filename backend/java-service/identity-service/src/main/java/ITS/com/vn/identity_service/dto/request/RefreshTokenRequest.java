package ITS.com.vn.identity_service.dto.request;

import lombok.Builder;
import lombok.Data;

import java.io.Serializable;

@Data
@Builder
public class RefreshTokenRequest implements Serializable {
    private static final long serialVersionUID = 1L;

    private String refreshToken;
}