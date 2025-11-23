package ITS.com.vn.course_service.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "asset_metadata")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssetMetadata {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    @Column(nullable = false, length = 500)
    private String storageUrl; // s3://bucket/video.mp4 or MinIO URL

    @Column(nullable = false, length = 100)
    private String mimeType; // video/mp4, application/pdf, etc.

    @Column
    private Long sizeBytes;

    @Column(length = 255)
    private String checksum; // sha256:...

    @Column(length = 255)
    private String originalFileName;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime uploadedAt;
}
