package ITS.com.vn.course_service.domain.entity;

import ITS.com.vn.course_service.domain.enums.CourseStatus;
import ITS.com.vn.course_service.domain.enums.CourseVisibility;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "courses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 255)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private CourseStatus status = CourseStatus.DRAFT;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private CourseVisibility visibility = CourseVisibility.PRIVATE;
    
    @Column(nullable = false)
    private Long instructorId;
    
    @Column(length = 500)
    private String thumbnailUrl;
    
    @Column(columnDefinition = "TEXT")
    private String objectives;
    
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<CourseVersion> versions = new ArrayList<>();
    
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<CourseTag> courseTags = new HashSet<>();
    
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Prerequisite> prerequisites = new HashSet<>();
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    @Column
    private LocalDateTime publishedAt;
    
    // Helper methods
    public void addVersion(CourseVersion version) {
        versions.add(version);
        version.setCourse(this);
    }
    
    public void removeVersion(CourseVersion version) {
        versions.remove(version);
        version.setCourse(null);
    }
    
    public void addTag(CourseTag courseTag) {
        courseTags.add(courseTag);
        courseTag.setCourse(this);
    }
    
    public void removeTag(CourseTag courseTag) {
        courseTags.remove(courseTag);
        courseTag.setCourse(null);
    }
    
    public void addPrerequisite(Prerequisite prerequisite) {
        prerequisites.add(prerequisite);
        prerequisite.setCourse(this);
    }
    
    public void removePrerequisite(Prerequisite prerequisite) {
        prerequisites.remove(prerequisite);
        prerequisite.setCourse(null);
    }
    
    public boolean canPublish() {
        // Must have at least one version with at least one chapter and one lesson
        return versions.stream()
                .anyMatch(v -> !v.getChapters().isEmpty() && 
                              v.getChapters().stream()
                                      .anyMatch(c -> !c.getLessons().isEmpty()));
    }
    
    public void publish() {
        if (!canPublish()) {
            throw new IllegalStateException("Course must have at least one chapter with one lesson to be published");
        }
        this.status = CourseStatus.PUBLISHED;
        this.publishedAt = LocalDateTime.now();
    }
    
    public void archive() {
        this.status = CourseStatus.ARCHIVED;
    }
}
