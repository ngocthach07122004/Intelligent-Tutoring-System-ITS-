package ITS.com.vn.assessment_service.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "exam_section_rule")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamSectionRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "config_id")
    private ExamConfig examConfig;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pool_id")
    private QuestionPool pool;

    @Column(name = "count_to_pull", nullable = false)
    private Integer countToPull;

    @Column(name = "points_per_question")
    @Builder.Default
    private Integer pointsPerQuestion = 1;
}
