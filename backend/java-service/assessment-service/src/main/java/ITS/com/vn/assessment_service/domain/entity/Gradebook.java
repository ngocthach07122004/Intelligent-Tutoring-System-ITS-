package ITS.com.vn.assessment_service.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "gradebook")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class Gradebook {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private UUID studentId;

    @Column(name = "course_id")
    private Long courseId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_id")
    private ExamConfig examConfig;

    @Column(name = "final_score")
    private Double finalScore;

    @Column(length = 10)
    private String grade; // A, B, C, F

    @Column(name = "gpa")
    private Double gpa; // GPA for this course (0.0 - 4.0)

    @Column(length = 20)
    private String status; // IN_PROGRESS, PASSED, FAILED

    @CreatedDate
    @Column(name = "graded_at")
    private Instant gradedAt;
}
