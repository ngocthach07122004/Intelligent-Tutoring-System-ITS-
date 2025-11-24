package ITS.com.vn.course_service.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;

/**
 * Utility helpers for extracting user context from Authentication/JWT.
 */
public final class SecurityUtils {

    private static final Logger log = LoggerFactory.getLogger(SecurityUtils.class);

    private SecurityUtils() {
    }

    public static String getUserId(Authentication authentication) {
        return getUserId(authentication, false);
    }

    public static String getUserId(Authentication authentication, boolean required) {
        if (authentication != null) {
            if (authentication.getPrincipal() instanceof Jwt jwt) {
                String userId = jwt.getClaimAsString("sub");
                if (userId != null && !userId.isBlank()) {
                    return userId;
                }
            }
            String name = authentication.getName();
            if (name != null && !name.isBlank()) {
                return name;
            }
        }

        if (required) {
            throw new RuntimeException("Unable to extract user ID from authentication");
        }
        return null;
    }

    public static Long getUserIdAsLong(Authentication authentication) {
        return getUserIdAsLong(authentication, false);
    }

    public static Long getUserIdAsLong(Authentication authentication, boolean required) {
        String userId = getUserId(authentication, required);
        if (userId == null) {
            return null;
        }
        try {
            return Long.parseLong(userId);
        } catch (NumberFormatException ex) {
            log.warn("User id in JWT is not numeric: {}", userId);
            if (required) {
                throw new RuntimeException("User ID in token is not numeric");
            }
            return null;
        }
    }
}
