package ITS.com.vn.user_profile_service.dto.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentStatisticsResponse {
    private long totalDocuments;
    private long notesCount;
    private long assignmentsCount;
    private long referencesCount;
    private long projectsCount;
    private long favoritesCount;
}
