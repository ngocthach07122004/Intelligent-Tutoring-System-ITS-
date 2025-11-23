package ITS.com.vn.course_service.domain.entity;

import ITS.com.vn.course_service.domain.enums.VersionStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "course_versions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseVersion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;
    
    @Column(nullable = false, length = 20)
    private String version; // e.g., "1.0.0"
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private VersionStatus status = VersionStatus.DRAFT;
    
    @Column(columnDefinition = "TEXT")
    private String changeLog;
    
    @OneToMany(mappedBy = "version", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sequence ASC")
    @Builder.Default
    private List<Chapter> chapters = new ArrayList<>();
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    @Column
    private LocalDateTime publishedAt;
    
    // Helper methods
    public void addChapter(Chapter chapter) {
        chapters.add(chapter);
        chapter.setVersion(this);
    }
    
    public void removeChapter(Chapter chapter) {
        chapters.remove(chapter);
        chapter.setVersion(null);
    }
    
    public void publish() {
        this.status = VersionStatus.PUBLISHED;
        this.publishedAt = LocalDateTime.now();
    }
    
    public void archive() {
        this.status = VersionStatus.ARCHIVED;
    }
}
