package ITS.com.vn.course_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseProgressResponse {
    private Long courseId;
    private Integer progressPercent;
}
