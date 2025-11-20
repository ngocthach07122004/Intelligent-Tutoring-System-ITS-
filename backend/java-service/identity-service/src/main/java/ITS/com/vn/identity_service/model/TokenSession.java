package ITS.com.vn.identity_service.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;

@Entity
@Table(name = "token_session")
@Data

public class TokenSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
     Long id;

     String keycloakUserId;
     String username;

    @Column(length = 4000)
     String accessToken;

    @Column(length = 4000)
     String refreshToken;
     Instant accessTokenExpiry;
     Instant refreshTokenExpiry;
     String clientId;
     Instant createdAt = Instant.now();

    // getters/setters
}
