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
public class LearningAnalytics {
    private Object academicProgress; // GPA trend analysis
    private List<Object> subjectPerformance; // Performance trends
    private Double attendanceRate;
    private Double assignmentCompletion;
    private List<Object> examScores;
    private List<Object> learningTime;
    private List<String> strengths;
    private List<String> improvements;
}
