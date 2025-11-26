package ITS.com.vn.course_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseStatsResponse {

    private Long courseId;
    private Long totalEnrollments;
    private Long activeEnrollments;
    private Long completedEnrollments;
    private Double averageProgress;
}
