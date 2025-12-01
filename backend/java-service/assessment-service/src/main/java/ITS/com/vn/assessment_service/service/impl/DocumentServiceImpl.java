package ITS.com.vn.assessment_service.service.impl;

import ITS.com.vn.assessment_service.domain.Document;
import ITS.com.vn.assessment_service.domain.enums.DocumentCategory;
import ITS.com.vn.assessment_service.dto.document.DocumentRequest;
import ITS.com.vn.assessment_service.dto.document.DocumentResponse;
import ITS.com.vn.assessment_service.dto.document.DocumentStatisticsResponse;
import ITS.com.vn.assessment_service.mapper.DocumentMapper;
import ITS.com.vn.assessment_service.repository.DocumentRepository;
import ITS.com.vn.assessment_service.service.DocumentService;
import ITS.com.vn.assessment_service.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRepository documentRepository;
    private final DocumentMapper documentMapper;

    @Override
    @Transactional(readOnly = true)
    public DocumentStatisticsResponse getStatistics() {
        UUID userId = JwtUtil.getUserIdFromJwt();
        return DocumentStatisticsResponse.builder()
                .totalDocuments(documentRepository.countByUserId(userId))
                .notesCount(documentRepository.countByUserIdAndCategory(userId, DocumentCategory.NOTE))
                .assignmentsCount(documentRepository.countByUserIdAndCategory(userId, DocumentCategory.ASSIGNMENT))
                .referencesCount(documentRepository.countByUserIdAndCategory(userId, DocumentCategory.REFERENCE))
                .projectsCount(documentRepository.countByUserIdAndCategory(userId, DocumentCategory.PROJECT))
                .favoritesCount(documentRepository.countByUserIdAndIsFavoriteTrue(userId))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentResponse> list(DocumentCategory category, Boolean isFavorite, String query) {
        UUID userId = JwtUtil.getUserIdFromJwt();
        List<Document> docs = documentRepository.findByUserId(userId, Sort.by(Sort.Direction.DESC, "updatedAt"));
        return docs.stream()
                .filter(doc -> category == null || doc.getCategory() == category)
                .filter(doc -> isFavorite == null || doc.isFavorite() == isFavorite)
                .filter(doc -> matchesQuery(doc, query))
                .map(documentMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public DocumentResponse create(DocumentRequest request) {
        UUID userId = JwtUtil.getUserIdFromJwt();
        Document document = Document.builder()
                .id(UUID.randomUUID())
                .userId(userId)
                .title(request.getTitle())
                .content(request.getContent())
                .category(request.getCategory())
                .course(request.getCourse())
                .tags(request.getTags())
                .isFavorite(false)
                .build();
        normalizeTags(document);
        Document saved = documentRepository.save(document);
        return documentMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public DocumentResponse get(UUID id) {
        UUID userId = JwtUtil.getUserIdFromJwt();
        Document document = requireOwnedDocument(id, userId);
        return documentMapper.toResponse(document);
    }

    @Override
    public DocumentResponse update(UUID id, DocumentRequest request) {
        UUID userId = JwtUtil.getUserIdFromJwt();
        Document document = requireOwnedDocument(id, userId);
        documentMapper.updateEntity(request, document);
        normalizeTags(document);
        Document saved = documentRepository.save(document);
        return documentMapper.toResponse(saved);
    }

    @Override
    public DocumentResponse toggleFavorite(UUID id, boolean isFavorite) {
        UUID userId = JwtUtil.getUserIdFromJwt();
        Document document = requireOwnedDocument(id, userId);
        document.setFavorite(isFavorite);
        Document saved = documentRepository.save(document);
        return documentMapper.toResponse(saved);
    }

    @Override
    public void delete(UUID id) {
        UUID userId = JwtUtil.getUserIdFromJwt();
        Document document = requireOwnedDocument(id, userId);
        documentRepository.delete(document);
    }

    private Document requireOwnedDocument(UUID id, UUID userId) {
        return documentRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Document not found"));
    }

    private boolean matchesQuery(Document doc, String query) {
        if (!StringUtils.hasText(query)) {
            return true;
        }
        String needle = query.toLowerCase(Locale.ROOT);
        boolean inTitle = doc.getTitle() != null && doc.getTitle().toLowerCase(Locale.ROOT).contains(needle);
        boolean inContent = doc.getContent() != null && doc.getContent().toLowerCase(Locale.ROOT).contains(needle);
        boolean inTags = doc.getTags() != null && doc.getTags().stream().anyMatch(tag -> tag != null && tag.toLowerCase(Locale.ROOT).contains(needle));
        return inTitle || inContent || inTags;
    }

    private void normalizeTags(Document document) {
        if (document.getTags() == null) {
            document.setTags(List.of());
        }
    }
}
