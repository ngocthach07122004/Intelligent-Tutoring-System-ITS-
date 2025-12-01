package ITS.com.vn.user_profile_service.dto.student;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AcademicRecord {
    private String semester;
    private Double gpa;
    private Integer totalCredits;
    private Integer rank;
    private Integer totalStudents;
    private List<SubjectGrade> subjects;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubjectGrade {
        private String name;
        private String code;
        private Integer credits;
        private String grade;
        private Double score;
        private String teacher;
    }
}
