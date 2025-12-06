package ITS.com.vn.course_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseStatistics {
    private Integer totalCourses;
    private Integer activeCourses;
    private Integer totalCredits;
    private Double averageProgress;
}
