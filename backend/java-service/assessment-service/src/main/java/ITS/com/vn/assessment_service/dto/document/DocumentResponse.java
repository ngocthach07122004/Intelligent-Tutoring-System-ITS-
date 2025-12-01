package ITS.com.vn.assessment_service.dto.document;

import ITS.com.vn.assessment_service.domain.enums.DocumentCategory;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentResponse {
    private UUID id;
    private String title;
    private String content;
    private DocumentCategory category;
    private String course;
    private List<String> tags;
    @JsonProperty("isFavorite")
    private boolean isFavorite;
    private Instant createdAt;
    private Instant updatedAt;
}
