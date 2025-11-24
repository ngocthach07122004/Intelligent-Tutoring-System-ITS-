package ITS.com.vn.course_service.controller;

import ITS.com.vn.course_service.dto.request.CreateLessonRequest;
import ITS.com.vn.course_service.dto.response.LessonResponse;
import ITS.com.vn.course_service.security.SecurityUtils;
import ITS.com.vn.course_service.service.LessonService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Lesson Controller - REST API endpoints for lesson management
 * Base path: /api/v1/chapters/{chapterId}/lessons
 */
@RestController
@RequestMapping("/api/v1/chapters/{chapterId}/lessons")
@RequiredArgsConstructor
@Slf4j
public class LessonController {

    private final LessonService lessonService;

    /**
     * Create a new lesson
     * POST /api/v1/chapters/{chapterId}/lessons
     */
    @PostMapping
    public ResponseEntity<LessonResponse> createLesson(
            @PathVariable Long chapterId,
            @Valid @RequestBody CreateLessonRequest request,
            Authentication authentication) {

        Long instructorId = SecurityUtils.getUserIdAsLong(authentication, true);
        LessonResponse response = lessonService.createLesson(chapterId, request, instructorId);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get all lessons for a chapter
     * GET /api/v1/chapters/{chapterId}/lessons
     */
    @GetMapping
    public ResponseEntity<List<LessonResponse>> getLessonsByChapter(@PathVariable Long chapterId) {
        List<LessonResponse> response = lessonService.getLessonsByChapter(chapterId);
        return ResponseEntity.ok(response);
    }

    /**
     * Get lesson by ID
     * GET /api/v1/lessons/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<LessonResponse> getLessonById(@PathVariable Long id) {
        LessonResponse response = lessonService.getLessonById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Update lesson
     * PUT /api/v1/lessons/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<LessonResponse> updateLesson(
            @PathVariable Long id,
            @Valid @RequestBody CreateLessonRequest request,
            Authentication authentication) {

        Long instructorId = SecurityUtils.getUserIdAsLong(authentication, true);
        LessonResponse response = lessonService.updateLesson(id, request, instructorId);

        return ResponseEntity.ok(response);
    }

    /**
     * Delete lesson
     * DELETE /api/v1/lessons/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLesson(
            @PathVariable Long id,
            Authentication authentication) {

        Long instructorId = SecurityUtils.getUserIdAsLong(authentication, true);
        lessonService.deleteLesson(id, instructorId);

        return ResponseEntity.noContent().build();
    }
}
