package ITS.com.vn.course_service.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReorderChaptersRequest {

    @NotEmpty(message = "Chapter IDs list cannot be empty")
    private List<Long> chapterIds;
}
