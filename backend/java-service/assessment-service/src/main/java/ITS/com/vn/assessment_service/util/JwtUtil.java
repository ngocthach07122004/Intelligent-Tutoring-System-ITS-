package ITS.com.vn.assessment_service.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.UUID;

public class JwtUtil {

    /**
     * Extract user ID from SecurityContext
     * 
     * @return UUID from the authentication principal
     * @throws IllegalStateException    if no authentication or principal is not a
     *                                  valid UUID string
     * @throws IllegalArgumentException if principal string is not a valid UUID
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

    /**
     * Extract user ID as String (for flexibility)
     */
    public static String getUserIdString() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("No authenticated user found");
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof String userIdStr) {
            return userIdStr;
        }

        throw new IllegalStateException(
                "Principal is not a String (User ID). Found: " + principal.getClass().getName());
    }
}
