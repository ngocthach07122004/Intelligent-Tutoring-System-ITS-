package ITS.com.vn.dashboard_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Collections;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentAnalyticsResponse {

    private AcademicProgress academicProgress;
    private List<SubjectPerformance> subjectPerformance;
    private Double attendanceRate;
    private Double assignmentCompletion;
    private List<ExamScore> examScores;
    private List<LearningTime> learningTime;
    private List<String> strengths;
    private List<String> improvements;

    public static StudentAnalyticsResponse empty() {
        return StudentAnalyticsResponse.builder()
                .academicProgress(AcademicProgress.empty())
                .subjectPerformance(Collections.emptyList())
                .attendanceRate(0.0)
                .assignmentCompletion(0.0)
                .examScores(Collections.emptyList())
                .learningTime(Collections.emptyList())
                .strengths(Collections.emptyList())
                .improvements(Collections.emptyList())
                .build();
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AcademicProgress {
        private Double currentGPA;
        private Double previousGPA;
        private String trend; // up|down|stable
        private Double percentChange;

        public static AcademicProgress empty() {
            return AcademicProgress.builder()
                    .currentGPA(0.0)
                    .previousGPA(0.0)
                    .trend("stable")
                    .percentChange(0.0)
                    .build();
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubjectPerformance {
        private String name;
        private Double currentScore;
        private Double previousScore;
        private String trend; // up|down|stable
        private Double percentChange;
        private String color;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ExamScore {
        private String month;
        private Double score;
        private Double average;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LearningTime {
        private String week;
        private Double hours;
    }
}
