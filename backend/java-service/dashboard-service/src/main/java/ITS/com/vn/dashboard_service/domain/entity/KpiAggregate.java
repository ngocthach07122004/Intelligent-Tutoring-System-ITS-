package ITS.com.vn.dashboard_service.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "kpi_aggregate")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class KpiAggregate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "kpi_code")
    private KpiDefinition kpiDefinition;

    @Column(name = "entity_id", length = 50)
    private String entityId; // CourseID or 'GLOBAL'

    @Column(name = "period_type", length = 20)
    private String periodType; // DAILY, WEEKLY

    @Column(name = "period_start")
    private LocalDate periodStart;

    private Double value;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;
}
