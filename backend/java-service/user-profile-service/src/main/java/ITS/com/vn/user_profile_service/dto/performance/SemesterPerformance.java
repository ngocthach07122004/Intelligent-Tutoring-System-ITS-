package ITS.com.vn.user_profile_service.dto.performance;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SemesterPerformance {
    private String semester;
    private Double gpa;
    private Integer totalCredits;
    private Integer rank;
    private Integer totalStudents;
    private Integer achievements;
    private Double attendance;
}
