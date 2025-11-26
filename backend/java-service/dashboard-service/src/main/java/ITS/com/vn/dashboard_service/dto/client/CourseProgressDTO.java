package ITS.com.vn.dashboard_service.dto.client;

import lombok.Data;

@Data
public class CourseProgressDTO {
    private Long courseId;
    private Integer progressPercent;
    // Add other fields as needed
}
