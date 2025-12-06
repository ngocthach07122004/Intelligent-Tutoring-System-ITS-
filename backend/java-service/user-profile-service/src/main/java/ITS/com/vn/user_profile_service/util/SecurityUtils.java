package ITS.com.vn.user_profile_service.util;

import java.util.UUID;

public class SecurityUtils {

    public static UUID getCurrentUserId() {
        return JwtUtil.getUserIdFromJwt();
    }
}
