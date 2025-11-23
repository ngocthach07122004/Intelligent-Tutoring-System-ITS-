package ITS.com.vn.course_service.dto.response;

import ITS.com.vn.course_service.domain.enums.PrerequisiteType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrerequisiteResponse {

    private Long id;
    private Long requiredCourseId;
    private String requiredCourseTitle;
    private PrerequisiteType type;
    private String description;
}
