package ITS.com.vn.identity_service.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "users")
@Data
@Builder
@FieldDefaults(level =  AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    Long id;
    @Column(nullable = false, unique = true)
    String gmail;
    @Column(nullable = false)
    String password;
    String keycloakId;
    String userName;
}
