package ITS.com.vn.assessment_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response cho Gradebook Summary API
 * Phục vụ Dashboard Performance page
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GradebookSummaryResponse {

    private Double overallGpa;
    private Integer totalCredits;
    private Integer completedCourses;
    private Integer inProgressCourses;
    private Integer rank; // Thứ hạng (optional)
    private String semester; // Học kỳ hiện tại

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
