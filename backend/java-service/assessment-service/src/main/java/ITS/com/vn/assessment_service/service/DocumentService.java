package ITS.com.vn.assessment_service.service;

import ITS.com.vn.assessment_service.domain.enums.DocumentCategory;
import ITS.com.vn.assessment_service.dto.document.DocumentRequest;
import ITS.com.vn.assessment_service.dto.document.DocumentResponse;
import ITS.com.vn.assessment_service.dto.document.DocumentStatisticsResponse;

import java.util.List;
import java.util.UUID;

public interface DocumentService {
    DocumentStatisticsResponse getStatistics();

    List<DocumentResponse> list(DocumentCategory category, Boolean isFavorite, String query);

    DocumentResponse create(DocumentRequest request);

    DocumentResponse get(UUID id);

    DocumentResponse update(UUID id, DocumentRequest request);

    DocumentResponse toggleFavorite(UUID id, boolean isFavorite);

    void delete(UUID id);
}
