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
public class AssessmentAnalyticsResponse {

    private List<ExamScore> examScores;
    private List<LearningTime> learningTime;
    private List<String> strengths;
    private List<String> improvements;

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
