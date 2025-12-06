package ITS.com.vn.assessment_service.service.impl;

import ITS.com.vn.assessment_service.domain.Document;
import ITS.com.vn.assessment_service.domain.enums.DocumentCategory;
import ITS.com.vn.assessment_service.dto.document.DocumentRequest;
import ITS.com.vn.assessment_service.dto.document.DocumentResponse;
import ITS.com.vn.assessment_service.dto.document.DocumentStatisticsResponse;
import ITS.com.vn.assessment_service.mapper.DocumentMapper;
import ITS.com.vn.assessment_service.repository.DocumentRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DocumentServiceImplTest {

    @Mock
    private DocumentRepository documentRepository;

    private DocumentServiceImpl documentService;

    private final DocumentMapper documentMapper = new DocumentMapper();
    private final UUID currentUser = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        documentService = new DocumentServiceImpl(documentRepository, documentMapper);
        setAuthentication(currentUser);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void createDocumentSetsOwnerAndDefaults() {
        DocumentRequest request = DocumentRequest.builder()
                .title("New Doc")
                .content("Content body")
                .category(DocumentCategory.NOTE)
                .tags(List.of("tag1"))
                .build();

        when(documentRepository.save(any(Document.class))).thenAnswer(invocation -> {
            Document doc = invocation.getArgument(0);
            doc.setCreatedAt(Instant.now());
            doc.setUpdatedAt(doc.getCreatedAt());
            return doc;
        });

        DocumentResponse response = documentService.create(request);

        ArgumentCaptor<Document> captor = ArgumentCaptor.forClass(Document.class);
        verify(documentRepository).save(captor.capture());
        Document saved = captor.getValue();

        assertThat(saved.getUserId()).isEqualTo(currentUser);
        assertThat(saved.isFavorite()).isFalse();
        assertThat(response.getId()).isNotNull();
        assertThat(response.getCategory()).isEqualTo(DocumentCategory.NOTE);
        assertThat(response.getTags()).containsExactly("tag1");
    }

    @Test
    void toggleFavoriteUpdatesState() {
        UUID docId = UUID.randomUUID();
        Document existing = Document.builder()
                .id(docId)
                .userId(currentUser)
                .title("Doc")
                .content("Body")
                .category(DocumentCategory.NOTE)
                .isFavorite(false)
                .build();

        when(documentRepository.findByIdAndUserId(docId, currentUser)).thenReturn(Optional.of(existing));
        when(documentRepository.save(any(Document.class))).thenAnswer(invocation -> invocation.getArgument(0));

        DocumentResponse response = documentService.toggleFavorite(docId, true);

        assertThat(response.isFavorite()).isTrue();
        verify(documentRepository).save(any(Document.class));
    }

    @Test
    void listDocumentsFiltersByCategoryFavoriteAndQuery() {
        Document match = Document.builder()
                .id(UUID.randomUUID())
                .userId(currentUser)
                .title("Python notes")
                .content("Learning python basics")
                .category(DocumentCategory.NOTE)
                .isFavorite(true)
                .tags(List.of("python", "study"))
                .updatedAt(Instant.now())
                .build();
        Document other = Document.builder()
                .id(UUID.randomUUID())
                .userId(currentUser)
                .title("Math assignment")
                .content("Algebra")
                .category(DocumentCategory.ASSIGNMENT)
                .isFavorite(false)
                .updatedAt(Instant.now().minusSeconds(60))
                .build();

        when(documentRepository.findByUserId(eq(currentUser), any())).thenReturn(List.of(match, other));

        List<DocumentResponse> results = documentService.list(DocumentCategory.NOTE, true, "python");

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getTitle()).isEqualTo("Python notes");
        verify(documentRepository, times(1)).findByUserId(eq(currentUser), any());
    }

    @Test
    void getStatisticsCountsPerCategoryAndFavorites() {
        when(documentRepository.countByUserId(currentUser)).thenReturn(3L);
        when(documentRepository.countByUserIdAndCategory(currentUser, DocumentCategory.NOTE)).thenReturn(1L);
        when(documentRepository.countByUserIdAndCategory(currentUser, DocumentCategory.ASSIGNMENT)).thenReturn(1L);
        when(documentRepository.countByUserIdAndCategory(currentUser, DocumentCategory.REFERENCE)).thenReturn(0L);
        when(documentRepository.countByUserIdAndCategory(currentUser, DocumentCategory.PROJECT)).thenReturn(1L);
        when(documentRepository.countByUserIdAndIsFavoriteTrue(currentUser)).thenReturn(2L);

        DocumentStatisticsResponse stats = documentService.getStatistics();

        assertThat(stats.getTotalDocuments()).isEqualTo(3);
        assertThat(stats.getAssignmentsCount()).isEqualTo(1);
        assertThat(stats.getFavoritesCount()).isEqualTo(2);
    }

    @Test
    void deleteNonOwnedDocumentThrows() {
        UUID docId = UUID.randomUUID();
        when(documentRepository.findByIdAndUserId(docId, currentUser)).thenReturn(Optional.empty());

        assertThrows(org.springframework.web.server.ResponseStatusException.class, () -> documentService.delete(docId));
    }

    private void setAuthentication(UUID userId) {
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                userId.toString(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
}
