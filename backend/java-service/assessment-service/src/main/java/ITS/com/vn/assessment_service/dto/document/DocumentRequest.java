package ITS.com.vn.assessment_service.dto.document;

import ITS.com.vn.assessment_service.domain.enums.DocumentCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentRequest {

    @NotBlank
    @Size(max = 255)
    private String title;

    @NotBlank
    private String content;

    @NotNull
    private DocumentCategory category;

    @Size(max = 100)
    private String course;

    private List<String> tags;
}
