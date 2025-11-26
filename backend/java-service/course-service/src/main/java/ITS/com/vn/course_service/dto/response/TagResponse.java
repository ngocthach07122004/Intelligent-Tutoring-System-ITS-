package ITS.com.vn.course_service.dto.response;

import ITS.com.vn.course_service.domain.enums.TagType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TagResponse {

    private Long id;
    private String name;
    private TagType type;
    private String description;
}
