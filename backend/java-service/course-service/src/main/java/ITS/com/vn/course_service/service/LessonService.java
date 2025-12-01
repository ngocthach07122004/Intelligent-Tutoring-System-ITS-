package ITS.com.vn.course_service.service;

import ITS.com.vn.course_service.domain.entity.Chapter;
import ITS.com.vn.course_service.domain.entity.Course;
import ITS.com.vn.course_service.domain.entity.Lesson;
import ITS.com.vn.course_service.dto.request.CreateLessonRequest;
import ITS.com.vn.course_service.dto.response.LessonResponse;
import ITS.com.vn.course_service.exception.ResourceNotFoundException;
import ITS.com.vn.course_service.exception.UnauthorizedException;
import ITS.com.vn.course_service.mapper.CourseMapper;
import ITS.com.vn.course_service.repository.ChapterRepository;
import ITS.com.vn.course_service.repository.LessonRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Lesson Service - Manages lesson CRUD operations
 * Follows SRP - handles only lesson-related business logic
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class LessonService {

    private final LessonRepository lessonRepository;
    private final ChapterRepository chapterRepository;
    private final CourseMapper courseMapper;

    /**
     * Create a new lesson in a chapter
     */
    @Transactional
    public LessonResponse createLesson(Long chapterId, CreateLessonRequest request, String instructorId) {
        log.info("Creating new lesson for chapter: {}", chapterId);

        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new ResourceNotFoundException("Chapter", "id", chapterId));

        // Check authorization
        Course course = chapter.getVersion().getCourse();
        if (!course.getInstructorId().equals(instructorId)) {
            throw new UnauthorizedException("You are not authorized to add lessons to this chapter");
        }

        // Map request to entity
        Lesson lesson = courseMapper.toEntity(request);
        lesson.setChapter(chapter);

        // Set default mastery threshold if not provided
        if (lesson.getMasteryThreshold() == null) {
            lesson.setMasteryThreshold(0.8); // Default 80%
        }

        // Set sequence (next available)
        Integer maxSequence = lessonRepository.getMaxSequenceByChapterId(chapterId);
        lesson.setSequence(maxSequence + 1);

        Lesson savedLesson = lessonRepository.save(lesson);
        log.info("Lesson created successfully with ID: {}", savedLesson.getId());

        return courseMapper.toResponse(savedLesson);
    }

    /**
     * Get lesson by ID
     */
    public LessonResponse getLessonById(Long id) {
        log.info("Fetching lesson with ID: {}", id);

        Lesson lesson = lessonRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson", "id", id));

        LessonResponse response = courseMapper.toResponse(lesson);

        // Set next lesson ID if exists
        Optional<Lesson> nextLesson = lessonRepository.findNextLesson(
                lesson.getChapter().getId(),
                lesson.getSequence());
        nextLesson.ifPresent(value -> response.setNextLessonId(value.getId()));

        // TODO: Set isCompleted based on user progress (requires integration with
        // progress tracking)
        response.setIsCompleted(false);

        return response;
    }

    /**
     * Get all lessons for a chapter
     */
    public List<LessonResponse> getLessonsByChapter(Long chapterId) {
        log.info("Fetching lessons for chapter: {}", chapterId);

        if (!chapterRepository.existsById(chapterId)) {
            throw new ResourceNotFoundException("Chapter", "id", chapterId);
        }

        List<Lesson> lessons = lessonRepository.findByChapterIdOrderBySequenceAsc(chapterId);
        return courseMapper.toLessonResponseList(lessons);
    }

    /**
     * Update lesson
     */
    @Transactional
    public LessonResponse updateLesson(Long id, CreateLessonRequest request, String instructorId) {
        log.info("Updating lesson with ID: {}", id);

        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson", "id", id));

        // Check authorization
        Course course = lesson.getChapter().getVersion().getCourse();
        if (!course.getInstructorId().equals(instructorId)) {
            throw new UnauthorizedException("You are not authorized to update this lesson");
        }

        // Update fields
        if (request.getTitle() != null) {
            lesson.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            lesson.setDescription(request.getDescription());
        }
        if (request.getType() != null) {
            lesson.setType(request.getType());
        }
        if (request.getMasteryThreshold() != null) {
            lesson.setMasteryThreshold(request.getMasteryThreshold());
        }
        if (request.getContent() != null) {
            lesson.setContent(request.getContent());
        }
        if (request.getEstimatedDuration() != null) {
            lesson.setEstimatedDuration(request.getEstimatedDuration());
        }

        Lesson updatedLesson = lessonRepository.save(lesson);
        log.info("Lesson updated successfully with ID: {}", updatedLesson.getId());

        return courseMapper.toResponse(updatedLesson);
    }

    /**
     * Delete lesson
     */
    @Transactional
    public void deleteLesson(Long id, String instructorId) {
        log.info("Deleting lesson with ID: {}", id);

        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson", "id", id));

        // Check authorization
        Course course = lesson.getChapter().getVersion().getCourse();
        if (!course.getInstructorId().equals(instructorId)) {
            throw new UnauthorizedException("You are not authorized to delete this lesson");
        }

        lessonRepository.delete(lesson);
        log.info("Lesson deleted successfully with ID: {}", id);
    }
}
