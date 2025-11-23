package ITS.com.vn.user_profile_service.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "learning_attribute")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearningAttribute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id")
    private UserProfile profile;

    @Column(name = "attribute_key", length = 50)
    private String attributeKey;

    @Column(name = "attribute_value", length = 100)
    private String attributeValue;
}
