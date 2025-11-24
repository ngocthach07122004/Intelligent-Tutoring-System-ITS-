package ITS.com.vn.dashboard_service.domain.entity;

import ITS.com.vn.dashboard_service.domain.enums.RiskLevel;
import io.hypersistence.utils.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Type;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "student_risk_profile")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class StudentRiskProfile {

    @Id
    @Column(name = "student_id")
    private UUID studentId;

    @Enumerated(EnumType.STRING)
    @Column(name = "risk_level", length = 20)
    private RiskLevel riskLevel;

    @Column(name = "overall_score")
    private Double overallScore;

    @Type(JsonBinaryType.class)
    @Column(name = "risk_factors", columnDefinition = "jsonb")
    @Builder.Default
    private List<String> riskFactors = new ArrayList<>();

    @LastModifiedDate
    @Column(name = "last_updated")
    private Instant lastUpdated;
}
