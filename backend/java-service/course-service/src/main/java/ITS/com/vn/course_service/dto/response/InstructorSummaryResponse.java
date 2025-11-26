package ITS.com.vn.course_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InstructorSummaryResponse {
    private Long id;
    private String fullName;
    private String avatarUrl;
}
