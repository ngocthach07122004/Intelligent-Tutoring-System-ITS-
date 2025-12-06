package ITS.com.vn.assessment_service.controller;

import ITS.com.vn.assessment_service.domain.Document;
import ITS.com.vn.assessment_service.domain.enums.DocumentCategory;
import ITS.com.vn.assessment_service.repository.DocumentRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class DocumentControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DocumentRepository documentRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private UUID currentUser;

    @BeforeEach
    void setup() {
        reset(documentRepository);
        currentUser = UUID.fromString("00000000-0000-0000-0000-000000000001");
    }

    @Test
    void createListAndFavoriteFlow() throws Exception {
        // Create
        when(documentRepository.save(any(Document.class))).thenAnswer(invocation -> {
            Document doc = invocation.getArgument(0);
            doc.setCreatedAt(Instant.now());
            doc.setUpdatedAt(doc.getCreatedAt());
            return doc;
        });

        String createPayload = """
                { "title": "Doc 1", "content": "body", "category": "note", "tags": ["a","b"] }
                """;

        mockMvc.perform(post("/api/v1/documents")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(createPayload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Doc 1"))
                .andExpect(jsonPath("$.isFavorite").value(false));

        // List with filters/search
        Document match = Document.builder()
                .id(UUID.randomUUID())
                .userId(currentUser)
                .title("Doc 1")
                .content("body with python")
                .category(DocumentCategory.NOTE)
                .isFavorite(true)
                .tags(List.of("python"))
                .updatedAt(Instant.now())
                .build();
        Document other = Document.builder()
                .id(UUID.randomUUID())
                .userId(currentUser)
                .title("Other")
                .content("irrelevant")
                .category(DocumentCategory.ASSIGNMENT)
                .isFavorite(false)
                .updatedAt(Instant.now())
                .build();
        when(documentRepository.findByUserId(eq(currentUser), any(Sort.class))).thenReturn(List.of(match, other));

        mockMvc.perform(get("/api/v1/documents")
                        .param("category", "note")
                        .param("isFavorite", "true")
                        .param("q", "python"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Doc 1"));

        // Toggle favorite
        when(documentRepository.findByIdAndUserId(eq(match.getId()), eq(currentUser))).thenReturn(Optional.of(match));
        when(documentRepository.save(any(Document.class))).thenAnswer(invocation -> invocation.getArgument(0));

        mockMvc.perform(patch("/api/v1/documents/{id}/favorite", match.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"isFavorite\":false}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isFavorite").value(false));
    }

    @Test
    void getUpdateDeleteFlow() throws Exception {
        UUID docId = UUID.randomUUID();
        Document existing = Document.builder()
                .id(docId)
                .userId(currentUser)
                .title("Original")
                .content("Body")
                .category(DocumentCategory.PROJECT)
                .isFavorite(false)
                .updatedAt(Instant.now())
                .build();

        when(documentRepository.findByIdAndUserId(eq(docId), eq(currentUser))).thenReturn(Optional.of(existing));
        when(documentRepository.save(any(Document.class))).thenAnswer(invocation -> invocation.getArgument(0));

        mockMvc.perform(get("/api/v1/documents/{id}", docId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Original"));

        String updatePayload = """
                { "title": "Updated", "content": "New body", "category": "project" }
                """;

        mockMvc.perform(put("/api/v1/documents/{id}", docId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updatePayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated"));

        mockMvc.perform(delete("/api/v1/documents/{id}", docId))
                .andExpect(status().isNoContent());
    }

    @Test
    void statsReturnsCounts() throws Exception {
        when(documentRepository.countByUserId(any())).thenReturn(3L);
        when(documentRepository.countByUserIdAndCategory(any(), eq(DocumentCategory.NOTE))).thenReturn(1L);
        when(documentRepository.countByUserIdAndCategory(any(), eq(DocumentCategory.ASSIGNMENT))).thenReturn(1L);
        when(documentRepository.countByUserIdAndCategory(any(), eq(DocumentCategory.REFERENCE))).thenReturn(0L);
        when(documentRepository.countByUserIdAndCategory(any(), eq(DocumentCategory.PROJECT))).thenReturn(1L);
        when(documentRepository.countByUserIdAndIsFavoriteTrue(any())).thenReturn(2L);

        mockMvc.perform(get("/api/v1/documents/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalDocuments").value(3))
                .andExpect(jsonPath("$.favoritesCount").value(2));
    }
}
