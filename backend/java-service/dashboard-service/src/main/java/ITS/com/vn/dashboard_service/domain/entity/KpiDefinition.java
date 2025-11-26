package ITS.com.vn.dashboard_service.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "kpi_definition")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KpiDefinition {

    @Id
    @Column(length = 50)
    private String code;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "calculation_rule", columnDefinition = "TEXT")
    private String calculationRule;
}
