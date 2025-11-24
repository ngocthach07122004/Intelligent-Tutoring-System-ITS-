package ITS.com.vn.dashboard_service.dto.external;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GradebookSummaryResponse {

    private String studentId;
    private List<SemesterSummary> semesters;
    private OverallSummary overall;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SemesterSummary {
        private String semester;
        private Double gpa;
        private Integer totalCredits;
        private Integer rank;
        private Integer totalStudents;
        private Integer achievements;
        private Double attendance;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OverallSummary {
        private Double gpa;
        private Integer totalCredits;
    }
}
