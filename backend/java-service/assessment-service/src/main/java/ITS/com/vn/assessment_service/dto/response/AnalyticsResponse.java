package ITS.com.vn.assessment_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsResponse {
    private List<ExamScorePoint> examScores;
    private List<LearningTimePoint> learningTime;
    private List<String> strengths;
    private List<String> improvements;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ExamScorePoint {
        private String month;
        private Double score;
        private Double average;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LearningTimePoint {
        private String week;
        private Integer hours;
    }
}
