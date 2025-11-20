package ITS.com.vn.identity_service.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

import java.io.Serializable;

/**
 * DTO ánh xạ phản hồi từ Keycloak token endpoint.
 * Ví dụ JSON:
 * {
 *   "access_token": "...",
 *   "expires_in": 300,
 *   "refresh_expires_in": 1800,
 *   "refresh_token": "...",
 *   "token_type": "Bearer",
 *   "id_token": "...",
 *   "not-before-policy": 0,
 *   "session_state": "...",
 *   "scope": "openid email"
 * }
 */
@Data
@Builder
public class KeycloakTokenResponse implements Serializable {

    private static final long serialVersionUID = 1L;

    @JsonProperty("access_token")
    private String accessToken;

    @JsonProperty("refresh_token")
    private String refreshToken;

    @JsonProperty("expires_in")
    private Long expiresIn;

    @JsonProperty("refresh_expires_in")
    private Long refreshExpiresIn;

    @JsonProperty("token_type")
    private String tokenType;

    @JsonProperty("id_token")
    private String idToken;

    @JsonProperty("scope")
    private String scope;

    @Override
    public String toString() {
        return "KeycloakTokenResponse{" +
                "accessToken='" + (accessToken != null ? "[REDACTED]" : null) + '\'' +
                ", refreshToken='" + (refreshToken != null ? "[REDACTED]" : null) + '\'' +
                ", expiresIn=" + expiresIn +
                ", refreshExpiresIn=" + refreshExpiresIn +
                ", tokenType='" + tokenType + '\'' +
                ", idToken='" + (idToken != null ? "[REDACTED]" : null) + '\'' +
                ", scope='" + scope + '\'' +
                '}';
    }
}
