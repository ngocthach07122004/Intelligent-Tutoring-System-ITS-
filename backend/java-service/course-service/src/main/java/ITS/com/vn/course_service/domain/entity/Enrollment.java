package ITS.com.vn.course_service.domain.entity;

import ITS.com.vn.course_service.domain.enums.EnrollmentStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Entity quản lý việc sinh viên đăng ký học khóa học
 * Đây là entity QUAN TRỌNG cho MVP - tracking enrollment và progress
 */
@Entity
@Table(name = "enrollments", uniqueConstraints = @UniqueConstraint(columnNames = { "course_id", "student_id" }))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(name = "student_id", nullable = false)
    private String studentId; // User ID từ Identity Service

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private EnrollmentStatus status = EnrollmentStatus.ACTIVE;

    @Column(name = "progress", nullable = false)
    @Builder.Default
    private Integer progress = 0; // 0-100, cache tiến độ để query nhanh

    @Column(name = "last_access_at")
    private LocalDateTime lastAccessAt; // Lần truy cập cuối

    @CreationTimestamp
    @Column(name = "enrolled_at", nullable = false, updatable = false)
    private LocalDateTime enrolledAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt; // Thời điểm hoàn thành khóa học

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // Helper methods
    public void updateProgress(Integer newProgress) {
        this.progress = Math.min(100, Math.max(0, newProgress));
        this.lastAccessAt = LocalDateTime.now();

        // Auto complete if progress reaches 100%
        if (this.progress == 100 && this.status == EnrollmentStatus.ACTIVE) {
            this.status = EnrollmentStatus.COMPLETED;
            this.completedAt = LocalDateTime.now();
        }
    }

    public void markAsCompleted() {
        this.status = EnrollmentStatus.COMPLETED;
        this.progress = 100;
        this.completedAt = LocalDateTime.now();
    }

    public void drop() {
        this.status = EnrollmentStatus.DROPPED;
    }

    public boolean isActive() {
        return this.status == EnrollmentStatus.ACTIVE;
    }

    public boolean isCompleted() {
        return this.status == EnrollmentStatus.COMPLETED;
    }
}
