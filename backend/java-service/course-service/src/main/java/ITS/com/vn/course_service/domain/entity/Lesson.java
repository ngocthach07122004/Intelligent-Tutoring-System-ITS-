package ITS.com.vn.course_service.domain.entity;

import ITS.com.vn.course_service.domain.enums.LessonType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "lessons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chapter_id", nullable = false)
    private Chapter chapter;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private LessonType type; // VIDEO, TEXT, QUIZ

    @Column(nullable = false)
    private Integer sequence;

    @Column(nullable = false)
    @Builder.Default
    private Double masteryThreshold = 0.8; // Default 80%

    @Column(columnDefinition = "TEXT")
    private String content; // For TEXT type lessons

    @Column
    private Integer estimatedDuration; // in minutes

    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<AssetMetadata> assets = new ArrayList<>();

    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Assignment> assignments = new ArrayList<>();

    @OneToMany(mappedBy = "sourceLesson", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<AdaptiveRule> adaptiveRules = new ArrayList<>();

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // Helper methods
    public void addAsset(AssetMetadata asset) {
        assets.add(asset);
        asset.setLesson(this);
    }

    public void removeAsset(AssetMetadata asset) {
        assets.remove(asset);
        asset.setLesson(null);
    }

    public void addAssignment(Assignment assignment) {
        assignments.add(assignment);
        assignment.setLesson(this);
    }

    public void removeAssignment(Assignment assignment) {
        assignments.remove(assignment);
        assignment.setLesson(null);
    }

    public void addAdaptiveRule(AdaptiveRule rule) {
        adaptiveRules.add(rule);
        rule.setSourceLesson(this);
    }

    public void removeAdaptiveRule(AdaptiveRule rule) {
        adaptiveRules.remove(rule);
        rule.setSourceLesson(null);
    }
}
