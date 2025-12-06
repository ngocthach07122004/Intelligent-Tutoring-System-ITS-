package ITS.com.vn.user_profile_service.dto.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserCreatedEvent {
    private UUID userId;
    private String username;
    private String email;
    private Set<String> roles;
    private Instant createdAt;
}
