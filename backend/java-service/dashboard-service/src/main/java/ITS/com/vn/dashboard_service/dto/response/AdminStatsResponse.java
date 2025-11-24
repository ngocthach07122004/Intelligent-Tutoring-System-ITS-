package ITS.com.vn.dashboard_service.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminStatsResponse {
    private Integer activeUsers;
    private Double revenueThisMonth;
    private Integer totalCourses;
    private String systemHealth;
}
