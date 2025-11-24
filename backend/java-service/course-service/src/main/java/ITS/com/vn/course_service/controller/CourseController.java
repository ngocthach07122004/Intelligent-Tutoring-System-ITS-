package ITS.com.vn.course_service.controller;

import ITS.com.vn.course_service.dto.request.CreateCourseRequest;
import ITS.com.vn.course_service.dto.request.UpdateCourseRequest;
import ITS.com.vn.course_service.dto.response.CourseResponse;
import ITS.com.vn.course_service.dto.response.CourseStatsResponse;
import ITS.com.vn.course_service.service.CourseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

/**
 * Course Controller - REST API endpoints for course management
 * Base path: /api/v1/courses
 */
@RestController
@RequestMapping("/api/v1/courses")
@RequiredArgsConstructor
@Slf4j
public class CourseController {

    private final CourseService courseService;

    /**
     * Create a new course
     * POST /api/v1/courses
     */
    @PostMapping
    public ResponseEntity<CourseResponse> createCourse(
            @Valid @RequestBody CreateCourseRequest request,
            Authentication authentication) {

        Long instructorId = extractUserId(authentication, true);
        CourseResponse response = courseService.createCourse(request, instructorId);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get course by ID
     * GET /api/v1/courses/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<CourseResponse> getCourseById(
            @PathVariable Long id,
            Authentication authentication) {
        Long userId = extractUserId(authentication, false);
        CourseResponse response = courseService.getCourseById(id, userId);
        return ResponseEntity.ok(response);
    }

    /**
     * Get all courses with pagination
     * GET /api/v1/courses
     */
    @GetMapping
    public ResponseEntity<Page<CourseResponse>> getAllCourses(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(required = false) String semester,
            Authentication authentication) {

        Long userId = extractUserId(authentication, false);
        Page<CourseResponse> response = courseService.getAllCourses(pageable, userId, semester);
        return ResponseEntity.ok(response);
    }

    /**
     * Get courses by instructor
     * GET /api/v1/courses/instructor/{instructorId}
     */
    @GetMapping("/instructor/{instructorId}")
    public ResponseEntity<Page<CourseResponse>> getCoursesByInstructor(
            @PathVariable Long instructorId,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<CourseResponse> response = courseService.getCoursesByInstructor(instructorId, pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * Get my courses (current instructor)
     * GET /api/v1/courses/my-courses
     */
    @GetMapping("/instructor/my-courses")
    public ResponseEntity<Page<CourseResponse>> getMyCourses(
            Authentication authentication,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        Long instructorId = extractUserId(authentication, true);
        Page<CourseResponse> response = courseService.getCoursesByInstructor(instructorId, pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * Get published courses
     * GET /api/v1/courses/published
     */
    @GetMapping("/published")
    public ResponseEntity<Page<CourseResponse>> getPublishedCourses(
            @PageableDefault(size = 20, sort = "publishedAt", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(required = false) String semester,
            Authentication authentication) {

        Long userId = extractUserId(authentication, false);
        Page<CourseResponse> response = courseService.getPublishedCourses(pageable, userId, semester);
        return ResponseEntity.ok(response);
    }

    /**
     * Search courses by title
     * GET /api/v1/courses/search?keyword=java
     */
    @GetMapping("/search")
    public ResponseEntity<Page<CourseResponse>> searchCourses(
            @RequestParam String keyword,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<CourseResponse> response = courseService.searchCourses(keyword, pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * Update course
     * PUT /api/v1/courses/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<CourseResponse> updateCourse(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCourseRequest request,
            Authentication authentication) {

        Long instructorId = extractUserId(authentication, true);
        CourseResponse response = courseService.updateCourse(id, request, instructorId);

        return ResponseEntity.ok(response);
    }

    /**
     * Publish course
     * POST /api/v1/courses/{id}/publish
     */
    @PostMapping("/{id}/publish")
    public ResponseEntity<CourseResponse> publishCourse(
            @PathVariable Long id,
            Authentication authentication) {

        Long instructorId = extractUserId(authentication, true);
        CourseResponse response = courseService.publishCourse(id, instructorId);

        return ResponseEntity.ok(response);
    }

    /**
     * Archive course
     * POST /api/v1/courses/{id}/archive
     */
    @PostMapping("/{id}/archive")
    public ResponseEntity<CourseResponse> archiveCourse(
            @PathVariable Long id,
            Authentication authentication) {

        Long instructorId = extractUserId(authentication, true);
        CourseResponse response = courseService.archiveCourse(id, instructorId);

        return ResponseEntity.ok(response);
    }

    /**
     * Delete course
     * DELETE /api/v1/courses/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(
            @PathVariable Long id,
            Authentication authentication) {

        Long instructorId = extractUserId(authentication, true);
        courseService.deleteCourse(id, instructorId);

        return ResponseEntity.noContent().build();
    }

    /**
     * Get course statistics
     * GET /api/v1/courses/{id}/stats
     */
    @GetMapping("/{id}/stats")
    @PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
    public ResponseEntity<CourseStatsResponse> getCourseStats(@PathVariable Long id) {
        CourseStatsResponse stats = courseService.getCourseStats(id);
        return ResponseEntity.ok(stats);
    }

    /**
     * Extract user ID from JWT token
     */
    private Long extractUserId(Authentication authentication, boolean required) {
        if (authentication != null && authentication.getPrincipal() instanceof Jwt jwt) {
            String userId = jwt.getClaimAsString("sub");
            try {
                return Long.parseLong(userId);
            } catch (NumberFormatException ex) {
                log.warn("User id in JWT is not numeric: {}", userId);
                if (required) {
                    throw new RuntimeException("User ID in token is not numeric");
                }
                return null;
            }
        }
        if (required) {
            throw new RuntimeException("Unable to extract user ID from authentication");
        }
        return null;
    }
}
