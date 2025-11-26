package ITS.com.vn.assessment_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

/**
 * Summary phục vụ Dashboard/FE v2: danh sách học kỳ + tổng quan.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GradebookSummaryV2Response {

    private UUID studentId;
    private List<SemesterSummary> semesters;
    private OverallStats overall;

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
    public static class OverallStats {
        private Double gpa;
        private Integer totalCredits;
    }
}
