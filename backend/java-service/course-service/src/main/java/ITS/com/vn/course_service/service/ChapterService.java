package ITS.com.vn.course_service.service;

import ITS.com.vn.course_service.domain.entity.Chapter;
import ITS.com.vn.course_service.domain.entity.Course;
import ITS.com.vn.course_service.domain.entity.CourseVersion;
import ITS.com.vn.course_service.domain.enums.VersionStatus;
import ITS.com.vn.course_service.dto.request.CreateChapterRequest;
import ITS.com.vn.course_service.dto.request.ReorderChaptersRequest;
import ITS.com.vn.course_service.dto.response.ChapterResponse;
import ITS.com.vn.course_service.exception.BadRequestException;
import ITS.com.vn.course_service.exception.ResourceNotFoundException;
import ITS.com.vn.course_service.exception.UnauthorizedException;
import ITS.com.vn.course_service.mapper.CourseMapper;
import ITS.com.vn.course_service.repository.ChapterRepository;
import ITS.com.vn.course_service.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Chapter Service - Manages chapter CRUD operations
 * Follows SRP - handles only chapter-related business logic
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ChapterService {

    private final ChapterRepository chapterRepository;
    private final CourseRepository courseRepository;
    private final CourseMapper courseMapper;

    /**
     * Create a new chapter in a course
     */
    @Transactional
    public ChapterResponse createChapter(Long courseId, CreateChapterRequest request, Long instructorId) {
        log.info("Creating new chapter for course: {}", courseId);

        Course course = courseRepository.findByIdWithDetails(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));

        // Check authorization
        if (!course.getInstructorId().equals(instructorId)) {
            throw new UnauthorizedException("You are not authorized to add chapters to this course");
        }

        // Get or create active version
        CourseVersion activeVersion = course.getVersions().stream()
                .filter(v -> v.getStatus() == VersionStatus.DRAFT)
                .findFirst()
                .orElseGet(() -> {
                    CourseVersion newVersion = CourseVersion.builder()
                            .course(course)
                            .version("1.0.0")
                            .status(VersionStatus.DRAFT)
                            .build();
                    course.addVersion(newVersion);
                    return newVersion;
                });

        // Map request to entity
        Chapter chapter = courseMapper.toEntity(request);
        chapter.setVersion(activeVersion);

        // Set sequence (next available)
        Integer maxSequence = chapterRepository.getMaxSequenceByVersionId(activeVersion.getId());
        chapter.setSequence(maxSequence + 1);

        Chapter savedChapter = chapterRepository.save(chapter);
        log.info("Chapter created successfully with ID: {}", savedChapter.getId());

        return courseMapper.toResponse(savedChapter);
    }

    /**
     * Get chapter by ID
     */
    public ChapterResponse getChapterById(Long id) {
        log.info("Fetching chapter with ID: {}", id);

        Chapter chapter = chapterRepository.findByIdWithLessons(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chapter", "id", id));

        return courseMapper.toResponse(chapter);
    }

    /**
     * Get all chapters for a course version
     */
    public List<ChapterResponse> getChaptersByCourse(Long courseId) {
        log.info("Fetching chapters for course: {}", courseId);

        Course course = courseRepository.findByIdWithDetails(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));

        // Get active version
        CourseVersion activeVersion = course.getVersions().stream()
                .filter(v -> v.getStatus() == VersionStatus.DRAFT || v.getStatus() == VersionStatus.PUBLISHED)
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("No active version found for course: " + courseId));

        List<Chapter> chapters = chapterRepository.findByVersionIdOrderBySequenceAsc(activeVersion.getId());
        return courseMapper.toChapterResponseList(chapters);
    }

    /**
     * Update chapter
     */
    @Transactional
    public ChapterResponse updateChapter(Long id, CreateChapterRequest request, Long instructorId) {
        log.info("Updating chapter with ID: {}", id);

        Chapter chapter = chapterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chapter", "id", id));

        // Check authorization
        Course course = chapter.getVersion().getCourse();
        if (!course.getInstructorId().equals(instructorId)) {
            throw new UnauthorizedException("You are not authorized to update this chapter");
        }

        // Update fields
        if (request.getTitle() != null) {
            chapter.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            chapter.setDescription(request.getDescription());
        }

        Chapter updatedChapter = chapterRepository.save(chapter);
        log.info("Chapter updated successfully with ID: {}", updatedChapter.getId());

        return courseMapper.toResponse(updatedChapter);
    }

    /**
     * Reorder chapters within a course
     */
    @Transactional
    public List<ChapterResponse> reorderChapters(Long courseId, ReorderChaptersRequest request, Long instructorId) {
        log.info("Reordering chapters for course: {}", courseId);

        Course course = courseRepository.findByIdWithDetails(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));

        // Check authorization
        if (!course.getInstructorId().equals(instructorId)) {
            throw new UnauthorizedException("You are not authorized to reorder chapters in this course");
        }

        // Get active version
        CourseVersion activeVersion = course.getVersions().stream()
                .filter(v -> v.getStatus() == VersionStatus.DRAFT)
                .findFirst()
                .orElseThrow(() -> new BadRequestException("Cannot reorder chapters in a published course"));

        // Fetch all chapters
        List<Chapter> chapters = chapterRepository.findByVersionIdOrderBySequenceAsc(activeVersion.getId());

        // Validate that all chapter IDs are provided
        if (chapters.size() != request.getChapterIds().size()) {
            throw new BadRequestException("All chapter IDs must be provided for reordering");
        }

        // Update sequences
        for (int i = 0; i < request.getChapterIds().size(); i++) {
            Long chapterId = request.getChapterIds().get(i);
            Chapter chapter = chapters.stream()
                    .filter(c -> c.getId().equals(chapterId))
                    .findFirst()
                    .orElseThrow(() -> new BadRequestException("Chapter not found with ID: " + chapterId));

            chapter.setSequence(i + 1);
        }

        chapterRepository.saveAll(chapters);
        log.info("Chapters reordered successfully for course: {}", courseId);

        return courseMapper.toChapterResponseList(
                chapterRepository.findByVersionIdOrderBySequenceAsc(activeVersion.getId()));
    }

    /**
     * Delete chapter
     */
    @Transactional
    public void deleteChapter(Long id, Long instructorId) {
        log.info("Deleting chapter with ID: {}", id);

        Chapter chapter = chapterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chapter", "id", id));

        // Check authorization
        Course course = chapter.getVersion().getCourse();
        if (!course.getInstructorId().equals(instructorId)) {
            throw new UnauthorizedException("You are not authorized to delete this chapter");
        }

        // Only allow deletion in DRAFT version
        if (chapter.getVersion().getStatus() != VersionStatus.DRAFT) {
            throw new BadRequestException("Cannot delete chapters from a published version");
        }

        chapterRepository.delete(chapter);
        log.info("Chapter deleted successfully with ID: {}", id);
    }
}
