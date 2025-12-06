package ITS.com.vn.assessment_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

/**
 * Lịch sử bảng điểm theo học kỳ/phục vụ StudentProfile & Performance tabs.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GradebookHistoryResponse {

    private UUID studentId;
    private List<AcademicRecord> records;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AcademicRecord {
        private String semester;
        private Double gpa;
        private Integer totalCredits;
        private Integer rank;
        private Integer totalStudents;
        private Integer achievements;
        private Double attendance;
        private List<SubjectRecord> subjects;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubjectRecord {
        private String name;
        private String code;
        private Integer credits;
        private String grade;
        private Double score;
        private String teacher;
    }
}
