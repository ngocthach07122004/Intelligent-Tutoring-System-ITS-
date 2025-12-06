package ITS.com.vn.assessment_service.mapper;

import ITS.com.vn.assessment_service.domain.Document;
import ITS.com.vn.assessment_service.dto.document.DocumentRequest;
import ITS.com.vn.assessment_service.dto.document.DocumentResponse;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

@Component
public class DocumentMapper {

    public DocumentResponse toResponse(Document document) {
        if (document == null) {
            return null;
        }
        return DocumentResponse.builder()
                .id(document.getId())
                .title(document.getTitle())
                .content(document.getContent())
                .category(document.getCategory())
                .course(document.getCourse())
                .tags(document.getTags())
                .isFavorite(document.isFavorite())
                .createdAt(document.getCreatedAt())
                .updatedAt(document.getUpdatedAt())
                .build();
    }

    public void updateEntity(DocumentRequest request, Document document) {
        document.setTitle(request.getTitle());
        document.setContent(request.getContent());
        document.setCategory(request.getCategory());
        document.setCourse(request.getCourse());
        document.setTags(request.getTags() == null ? new ArrayList<>() : new ArrayList<>(request.getTags()));
    }
}
