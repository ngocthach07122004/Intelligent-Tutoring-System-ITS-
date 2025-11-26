package ITS.com.vn.assessment_service.domain.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Achievement entity - Gamification
 * Định nghĩa các thành tích có thể đạt được
 */
@Entity
@Table(name = "achievements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Achievement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code", unique = true, nullable = false, length = 50)
    private String code; // VD: "MATH_MASTER", "PERFECT_SCORE"

    @Column(nullable = false, length = 255)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "icon_url", length = 512)
    private String iconUrl;

    @Column(name = "criteria", columnDefinition = "TEXT")
    private String criteria; // JSON - Điều kiện đạt achievement

    @Column(name = "points")
    private Integer points; // Điểm thưởng khi đạt

    @Column(name = "category", length = 50)
    private String category; // ACADEMIC, PARTICIPATION, SPECIAL
}
