package ITS.com.vn.assessment_service.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "rubric_item")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RubricItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rubric_id")
    private Rubric rubric;

    private String criterion;

    @Column(name = "max_points")
    private Integer maxPoints;

    @Column(columnDefinition = "TEXT")
    private String description;
}
