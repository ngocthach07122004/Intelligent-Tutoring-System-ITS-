package ITS.com.vn.dashboard_service.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.UUID;

public class JwtUtil {

    /**
     * Extract user ID from SecurityContext
     */
    public static UUID getUserIdFromJwt() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("No authenticated user found");
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof String userIdStr) {
            try {
                return UUID.fromString(userIdStr);
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Principal is not a valid UUID: " + userIdStr, e);
            }
        }

        throw new IllegalStateException(
                "Principal is not a String (User ID). Found: " + principal.getClass().getName());
    }
}
