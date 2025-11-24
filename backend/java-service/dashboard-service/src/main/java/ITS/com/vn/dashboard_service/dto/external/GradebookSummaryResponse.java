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

    private Double overallGpa;
    private Integer totalCredits;
    private Integer completedCourses;
    private Integer inProgressCourses;
    private Integer rank;
    private String semester;
    
    private List<CourseGradeDetail> courseGrades;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CourseGradeDetail {
        private Long courseId;
        private String courseName;
        private String courseCode;
        private Double finalScore;
        private String grade;
        private Double gpa;
        private String status;
    }
}
