package ITS.com.vn.user_profile_service.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.UUID;

public class JwtUtil {

    /**
     * Extract user ID from JWT token's 'sub' claim as UUID
     */
    public static UUID getUserIdFromJwt() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("No authenticated user found");
        }

        if (!(authentication.getPrincipal() instanceof Jwt jwt)) {
            throw new IllegalStateException("Principal is not a JWT token");
        }

        String subject = jwt.getSubject();
        if (subject == null || subject.isEmpty()) {
            throw new IllegalStateException("JWT token does not contain 'sub' claim");
        }

        try {
            return UUID.fromString(subject);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("'sub' claim is not a valid UUID: " + subject, e);
        }
    }
}
