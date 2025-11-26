package ITS.com.vn.course_service.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "adaptive_rules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdaptiveRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_lesson_id", nullable = false)
    private Lesson sourceLesson;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_lesson_id")
    private Lesson targetLesson;

    @Column(nullable = false, length = 100)
    private String condition; // e.g., "SCORE < 60%", "SCORE >= 95%"

    @Column(nullable = false, length = 100)
    private String action; // e.g., "REDIRECT_TO_REMEDIATION", "UNLOCK_CHALLENGE"

    @Column(columnDefinition = "TEXT")
    private String description;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
