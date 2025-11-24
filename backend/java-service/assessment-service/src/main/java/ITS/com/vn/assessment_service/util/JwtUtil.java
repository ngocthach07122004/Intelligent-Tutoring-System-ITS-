package ITS.com.vn.assessment_service.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.UUID;

public class JwtUtil {

    /**
     * Extract user ID from JWT token's 'sub' claim as UUID
     * 
     * @return UUID from the 'sub' claim
     * @throws IllegalStateException    if no authentication or not a JWT
     * @throws IllegalArgumentException if 'sub' is not a valid UUID
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

    /**
     * Extract user ID as String (for flexibility)
     */
    public static String getUserIdString() {
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

        return subject;
    }
}
