package ITS.com.vn.assessment_service.controller;

import ITS.com.vn.assessment_service.domain.enums.DocumentCategory;
import ITS.com.vn.assessment_service.dto.document.DocumentRequest;
import ITS.com.vn.assessment_service.dto.document.DocumentResponse;
import ITS.com.vn.assessment_service.dto.document.DocumentStatisticsResponse;
import ITS.com.vn.assessment_service.dto.document.FavoriteToggleRequest;
import ITS.com.vn.assessment_service.service.DocumentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    @GetMapping("/stats")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DocumentStatisticsResponse> getStatistics() {
        return ResponseEntity.ok(documentService.getStatistics());
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<DocumentResponse>> listDocuments(
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "isFavorite", required = false) Boolean isFavorite,
            @RequestParam(value = "q", required = false) String query
    ) {
        return ResponseEntity.ok(documentService.list(resolveCategory(category), isFavorite, query));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DocumentResponse> createDocument(@Valid @RequestBody DocumentRequest request) {
        DocumentResponse response = documentService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DocumentResponse> getDocument(@PathVariable UUID id) {
        return ResponseEntity.ok(documentService.get(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DocumentResponse> updateDocument(@PathVariable UUID id, @Valid @RequestBody DocumentRequest request) {
        return ResponseEntity.ok(documentService.update(id, request));
    }

    @PatchMapping("/{id}/favorite")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DocumentResponse> toggleFavorite(@PathVariable UUID id, @Valid @RequestBody FavoriteToggleRequest request) {
        return ResponseEntity.ok(documentService.toggleFavorite(id, request.getIsFavorite()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteDocument(@PathVariable UUID id) {
        documentService.delete(id);
        return ResponseEntity.noContent().build();
    }

    private DocumentCategory resolveCategory(String rawCategory) {
        if (rawCategory == null || rawCategory.isBlank()) {
            return null;
        }
        return DocumentCategory.fromValue(rawCategory);
    }
}
