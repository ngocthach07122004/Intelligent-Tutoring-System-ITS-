package ITS.com.vn.assessment_service.domain.entity;

import io.hypersistence.utils.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Type;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "exam_config")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class ExamConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(name = "course_id")
    private Long courseId;

    @Column(name = "lesson_id")
    private Long lessonId; // Nullable - for lesson quiz mapping

    private String policy; // RANDOMIZED, LINEAR

    @Column(name = "browser_lock_enabled")
    @Builder.Default
    private Boolean browserLockEnabled = false;

    @Column(name = "time_limit_minutes")
    private Integer timeLimitMinutes;

    @Column(name = "window_start")
    private Instant windowStart;

    @Column(name = "window_end")
    private Instant windowEnd;

    @Type(JsonBinaryType.class)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> policyConfig; // Additional policy settings

    @Column(name = "instructor_id")
    private String instructorId;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @OneToMany(mappedBy = "examConfig", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ExamSectionRule> sections = new ArrayList<>();

    @OneToMany(mappedBy = "examConfig", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Attempt> attempts = new ArrayList<>();
}
