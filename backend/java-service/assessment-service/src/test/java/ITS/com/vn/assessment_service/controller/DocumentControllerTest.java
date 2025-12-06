package ITS.com.vn.assessment_service.controller;

import ITS.com.vn.assessment_service.domain.enums.DocumentCategory;
import ITS.com.vn.assessment_service.dto.document.DocumentRequest;
import ITS.com.vn.assessment_service.dto.document.DocumentResponse;
import ITS.com.vn.assessment_service.dto.document.DocumentStatisticsResponse;
import ITS.com.vn.assessment_service.dto.document.FavoriteToggleRequest;
import ITS.com.vn.assessment_service.service.DocumentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class DocumentControllerTest {

    @Mock
    private DocumentService documentService;

    @InjectMocks
    private DocumentController documentController;

    private MockMvc mockMvc;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(documentController).build();
    }

    @Test
    void createDocumentReturnsCreated() throws Exception {
        DocumentRequest request = DocumentRequest.builder()
                .title("New Doc")
                .content("Body")
                .category(DocumentCategory.NOTE)
                .build();

        DocumentResponse response = DocumentResponse.builder()
                .id(UUID.randomUUID())
                .title("New Doc")
                .content("Body")
                .category(DocumentCategory.NOTE)
                .isFavorite(false)
                .createdAt(Instant.now())
                .build();

        when(documentService.create(any(DocumentRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/documents")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("New Doc"))
                .andExpect(jsonPath("$.isFavorite").value(false));
    }

    @Test
    void getStatisticsReturnsOk() throws Exception {
        DocumentStatisticsResponse stats = DocumentStatisticsResponse.builder()
                .totalDocuments(3)
                .notesCount(1)
                .assignmentsCount(1)
                .favoritesCount(2)
                .build();

        when(documentService.getStatistics()).thenReturn(stats);

        mockMvc.perform(get("/api/v1/documents/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalDocuments").value(3))
                .andExpect(jsonPath("$.favoritesCount").value(2));
    }

    @Test
    void toggleFavoriteReturnsUpdatedDocument() throws Exception {
        UUID id = UUID.randomUUID();
        FavoriteToggleRequest toggle = new FavoriteToggleRequest(true);

        DocumentResponse response = DocumentResponse.builder()
                .id(id)
                .title("Doc")
                .content("Body")
                .category(DocumentCategory.NOTE)
                .isFavorite(true)
                .updatedAt(Instant.now())
                .build();

        when(documentService.toggleFavorite(any(UUID.class), any(Boolean.class))).thenReturn(response);

        mockMvc.perform(patch("/api/v1/documents/{id}/favorite", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(toggle)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isFavorite").value(true));
    }

    @Test
    void listDocumentsReturnsResults() throws Exception {
        DocumentResponse doc = DocumentResponse.builder()
                .id(UUID.randomUUID())
                .title("Doc One")
                .content("Content")
                .category(DocumentCategory.NOTE)
                .isFavorite(false)
                .build();

        when(documentService.list(any(), any(), any())).thenReturn(List.of(doc));

        mockMvc.perform(get("/api/v1/documents"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Doc One"));
    }

    @Test
    void deleteDocumentReturnsNoContent() throws Exception {
        UUID id = UUID.randomUUID();
        mockMvc.perform(delete("/api/v1/documents/{id}", id))
                .andExpect(status().isNoContent());
    }

    @Test
    void updateDocumentReturnsOk() throws Exception {
        UUID id = UUID.randomUUID();
        DocumentRequest request = DocumentRequest.builder()
                .title("Updated")
                .content("Updated body")
                .category(DocumentCategory.PROJECT)
                .build();
        DocumentResponse response = DocumentResponse.builder()
                .id(id)
                .title("Updated")
                .content("Updated body")
                .category(DocumentCategory.PROJECT)
                .build();

        when(documentService.update(any(UUID.class), any(DocumentRequest.class))).thenReturn(response);

        mockMvc.perform(put("/api/v1/documents/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.category").value("project"));
    }
}
