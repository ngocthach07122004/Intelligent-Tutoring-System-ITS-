package ITS.com.vn.course_service.controller;

import ITS.com.vn.course_service.dto.request.CreateChapterRequest;
import ITS.com.vn.course_service.dto.request.ReorderChaptersRequest;
import ITS.com.vn.course_service.dto.response.ChapterResponse;
import ITS.com.vn.course_service.security.SecurityUtils;
import ITS.com.vn.course_service.service.ChapterService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Chapter Controller - REST API endpoints for chapter management
 * Base path: /api/v1/courses/{courseId}/chapters
 */
@RestController
@RequestMapping("/api/v1/courses/{courseId}/chapters")
@RequiredArgsConstructor
@Slf4j
public class ChapterController {

    private final ChapterService chapterService;

    /**
     * Create a new chapter
     * POST /api/v1/courses/{courseId}/chapters
     */
    @PostMapping
    public ResponseEntity<ChapterResponse> createChapter(
            @PathVariable Long courseId,
            @Valid @RequestBody CreateChapterRequest request,
            Authentication authentication) {

        String instructorId = SecurityUtils.getUserId(authentication, true);
        ChapterResponse response = chapterService.createChapter(courseId, request, instructorId);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get all chapters for a course
     * GET /api/v1/courses/{courseId}/chapters
     */
    @GetMapping
    public ResponseEntity<List<ChapterResponse>> getChaptersByCourse(@PathVariable Long courseId) {
        List<ChapterResponse> response = chapterService.getChaptersByCourse(courseId);
        return ResponseEntity.ok(response);
    }

    /**
     * Get chapter by ID
     * GET /api/v1/chapters/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ChapterResponse> getChapterById(@PathVariable Long id) {
        ChapterResponse response = chapterService.getChapterById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Update chapter
     * PUT /api/v1/chapters/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ChapterResponse> updateChapter(
            @PathVariable Long id,
            @Valid @RequestBody CreateChapterRequest request,
            Authentication authentication) {

        String instructorId = SecurityUtils.getUserId(authentication, true);
        ChapterResponse response = chapterService.updateChapter(id, request, instructorId);

        return ResponseEntity.ok(response);
    }

    /**
     * Reorder chapters
     * PUT /api/v1/courses/{courseId}/chapters/reorder
     */
    @PutMapping("/reorder")
    public ResponseEntity<List<ChapterResponse>> reorderChapters(
            @PathVariable Long courseId,
            @Valid @RequestBody ReorderChaptersRequest request,
            Authentication authentication) {

        String instructorId = SecurityUtils.getUserId(authentication, true);
        List<ChapterResponse> response = chapterService.reorderChapters(courseId, request, instructorId);

        return ResponseEntity.ok(response);
    }

    /**
     * Delete chapter
     * DELETE /api/v1/chapters/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChapter(
            @PathVariable Long id,
            Authentication authentication) {

        String instructorId = SecurityUtils.getUserId(authentication, true);
        chapterService.deleteChapter(id, instructorId);

        return ResponseEntity.noContent().build();
    }
}
