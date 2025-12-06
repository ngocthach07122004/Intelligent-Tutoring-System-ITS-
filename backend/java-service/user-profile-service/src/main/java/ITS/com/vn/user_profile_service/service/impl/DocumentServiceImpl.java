package ITS.com.vn.user_profile_service.service.impl;

import ITS.com.vn.user_profile_service.domain.entity.Document;
import ITS.com.vn.user_profile_service.domain.enums.DocumentCategory;
import ITS.com.vn.user_profile_service.dto.document.DocumentRequest;
import ITS.com.vn.user_profile_service.dto.document.DocumentResponse;
import ITS.com.vn.user_profile_service.dto.document.DocumentStatisticsResponse;
import ITS.com.vn.user_profile_service.mapper.DocumentMapper;
import ITS.com.vn.user_profile_service.repository.DocumentRepository;
import ITS.com.vn.user_profile_service.service.DocumentService;
import ITS.com.vn.user_profile_service.util.JwtUtil;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRepository documentRepository;
    private final DocumentMapper documentMapper;

    @Override
    @Transactional(readOnly = true)
    public DocumentStatisticsResponse getStatistics() {
        UUID userId = JwtUtil.getUserIdFromJwt();
        long total = documentRepository.countByUserId(userId);
        return DocumentStatisticsResponse.builder()
                .totalDocuments(total)
                .notesCount(documentRepository.countByUserIdAndCategory(userId, DocumentCategory.NOTE))
                .assignmentsCount(documentRepository.countByUserIdAndCategory(userId, DocumentCategory.ASSIGNMENT))
                .referencesCount(documentRepository.countByUserIdAndCategory(userId, DocumentCategory.REFERENCE))
                .projectsCount(documentRepository.countByUserIdAndCategory(userId, DocumentCategory.PROJECT))
                .favoritesCount(documentRepository.countByUserIdAndIsFavoriteTrue(userId))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentResponse> getDocuments(DocumentCategory category, Boolean isFavorite, String query) {
        UUID userId = JwtUtil.getUserIdFromJwt();
        List<Document> documents = documentRepository.findByUserId(userId, Sort.by(Sort.Direction.DESC, "updatedAt"));

        return documents.stream()
                .filter(doc -> category == null || doc.getCategory() == category)
                .filter(doc -> isFavorite == null || doc.isFavorite() == isFavorite)
                .filter(doc -> matchesQuery(doc, query))
                .map(documentMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public DocumentResponse create(DocumentRequest request) {
        UUID userId = JwtUtil.getUserIdFromJwt();
        Document entity = documentMapper.toEntity(request);
        entity.setId(UUID.randomUUID());
        entity.setUserId(userId);
        entity.setFavorite(false);
        normalizeTags(entity);
        Document saved = documentRepository.save(entity);
        return documentMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public DocumentResponse getById(UUID id) {
        UUID userId = JwtUtil.getUserIdFromJwt();
        Document document = requireOwnedDocument(id, userId);
        return documentMapper.toResponse(document);
    }

    @Override
    public DocumentResponse update(UUID id, DocumentRequest request) {
        UUID userId = JwtUtil.getUserIdFromJwt();
        Document document = requireOwnedDocument(id, userId);
        documentMapper.updateEntityFromDto(request, document);
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

    private Document requireOwnedDocument(UUID id, UUID userId) {
        return documentRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new EntityNotFoundException("Document not found"));
    }

    private void normalizeTags(Document document) {
        if (document.getTags() == null) {
            document.setTags(List.of());
        }
    }
}
