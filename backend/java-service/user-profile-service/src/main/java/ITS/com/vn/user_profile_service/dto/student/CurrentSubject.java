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
public class CurrentSubject {
    private String id;
    private String name;
    private String code;
    private String teacher;
    private String currentGrade;
    private Double currentScore;
    private Integer credits;
    private Double attendance;
    private AssignmentsInfo assignments;
    private ExamsInfo exams;
    private ProgressInfo progress;
    private NextAssignmentInfo nextAssignment;
    private List<Object> recentActivities; // Keeping as Object for flexibility as per spec

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AssignmentsInfo {
        private Integer total;
        private Integer completed;
        private Double avgScore;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ExamsInfo {
        private Double midterm;
        private Double finalExam; // "final" is a reserved keyword
        private List<Double> quizzes;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProgressInfo {
        private Integer completed;
        private Integer total;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NextAssignmentInfo {
        private String title;
        private String dueDate;
        // Add other fields as needed
    }
}
