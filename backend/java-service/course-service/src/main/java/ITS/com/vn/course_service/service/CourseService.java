package ITS.com.vn.course_service.service;

import ITS.com.vn.course_service.domain.entity.*;
import ITS.com.vn.course_service.domain.enums.CourseStatus;
import ITS.com.vn.course_service.domain.enums.PrerequisiteType;
import ITS.com.vn.course_service.dto.request.CreateCourseRequest;
import ITS.com.vn.course_service.dto.request.UpdateCourseRequest;
import ITS.com.vn.course_service.dto.response.CourseResponse;
import ITS.com.vn.course_service.exception.BadRequestException;
import ITS.com.vn.course_service.exception.ResourceNotFoundException;
import ITS.com.vn.course_service.exception.UnauthorizedException;
import ITS.com.vn.course_service.mapper.CourseMapper;
import ITS.com.vn.course_service.repository.CourseRepository;
import ITS.com.vn.course_service.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Course Service - Implements CRUD operations for courses
 * Follows Single Responsibility Principle (SRP) - handles only course business
 * logic
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class CourseService {

    private final CourseRepository courseRepository;
    private final TagRepository tagRepository;
    private final CourseMapper courseMapper;

    /**
     * Create a new course
     * 
     * @param request      Course creation request
     * @param instructorId ID of the instructor creating the course
     * @return Created course response
     */
    @Transactional
    public CourseResponse createCourse(CreateCourseRequest request, Long instructorId) {
        log.info("Creating new course: {} for instructor: {}", request.getTitle(), instructorId);

        // Map request to entity
        Course course = courseMapper.toEntity(request);
        course.setInstructorId(instructorId);
        course.setStatus(CourseStatus.DRAFT);

        // Handle tags
        if (request.getTagIds() != null && !request.getTagIds().isEmpty()) {
            List<Tag> tags = tagRepository.findAllById(request.getTagIds());
            for (Tag tag : tags) {
                CourseTag courseTag = CourseTag.builder()
                        .course(course)
                        .tag(tag)
                        .build();
                course.addTag(courseTag);
            }
        }

        // Handle prerequisites
        if (request.getPrerequisiteCourseIds() != null && !request.getPrerequisiteCourseIds().isEmpty()) {
            for (Long prereqId : request.getPrerequisiteCourseIds()) {
                // Verify prerequisite course exists
                if (!courseRepository.existsById(prereqId)) {
                    throw new BadRequestException("Prerequisite course not found with ID: " + prereqId);
                }

                Prerequisite prerequisite = Prerequisite.builder()
                        .course(course)
                        .requiredCourseId(prereqId)
                        .type(PrerequisiteType.HARD)
                        .build();
                course.addPrerequisite(prerequisite);
            }
        }

        Course savedCourse = courseRepository.save(course);
        log.info("Course created successfully with ID: {}", savedCourse.getId());

        return courseMapper.toResponse(savedCourse);
    }

    /**
     * Get course by ID
     * 
     * @param id Course ID
     * @return Course response
     */
    public CourseResponse getCourseById(Long id) {
        log.info("Fetching course with ID: {}", id);

        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));

        return courseMapper.toResponse(course);
    }

    /**
     * Get all courses with pagination
     * 
     * @param pageable Pagination parameters
     * @return Page of course responses
     */
    public Page<CourseResponse> getAllCourses(Pageable pageable) {
        log.info("Fetching all courses with pagination");

        Page<Course> courses = courseRepository.findAll(pageable);
        return courses.map(courseMapper::toResponse);
    }

    /**
     * Get courses by instructor
     * 
     * @param instructorId Instructor ID
     * @param pageable     Pagination parameters
     * @return Page of course responses
     */
    public Page<CourseResponse> getCoursesByInstructor(Long instructorId, Pageable pageable) {
        log.info("Fetching courses for instructor: {}", instructorId);

        Page<Course> courses = courseRepository.findByInstructorId(instructorId, pageable);
        return courses.map(courseMapper::toResponse);
    }

    /**
     * Get published courses
     * 
     * @param pageable Pagination parameters
     * @return Page of published course responses
     */
    public Page<CourseResponse> getPublishedCourses(Pageable pageable) {
        log.info("Fetching published courses");

        Page<Course> courses = courseRepository.findByStatus(CourseStatus.PUBLISHED, pageable);
        return courses.map(courseMapper::toResponse);
    }

    /**
     * Search courses by title
     * 
     * @param keyword  Search keyword
     * @param pageable Pagination parameters
     * @return Page of matching course responses
     */
    public Page<CourseResponse> searchCourses(String keyword, Pageable pageable) {
        log.info("Searching courses with keyword: {}", keyword);

        Page<Course> courses = courseRepository.searchByTitle(keyword, pageable);
        return courses.map(courseMapper::toResponse);
    }

    /**
     * Update course
     * 
     * @param id           Course ID
     * @param request      Update request
     * @param instructorId ID of the instructor updating the course
     * @return Updated course response
     */
    @Transactional
    public CourseResponse updateCourse(Long id, UpdateCourseRequest request, Long instructorId) {
        log.info("Updating course with ID: {} by instructor: {}", id, instructorId);

        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));

        // Check authorization
        if (!course.getInstructorId().equals(instructorId)) {
            throw new UnauthorizedException("You are not authorized to update this course");
        }

        // Update fields if provided
        if (request.getTitle() != null) {
            course.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            course.setDescription(request.getDescription());
        }
        if (request.getVisibility() != null) {
            course.setVisibility(request.getVisibility());
        }
        if (request.getThumbnailUrl() != null) {
            course.setThumbnailUrl(request.getThumbnailUrl());
        }
        if (request.getObjectives() != null) {
            course.setObjectives(request.getObjectives());
        }

        // Update tags if provided
        if (request.getTagIds() != null) {
            // Clear existing tags
            course.getCourseTags().clear();

            // Add new tags
            List<Tag> tags = tagRepository.findAllById(request.getTagIds());
            for (Tag tag : tags) {
                CourseTag courseTag = CourseTag.builder()
                        .course(course)
                        .tag(tag)
                        .build();
                course.addTag(courseTag);
            }
        }

        // Update prerequisites if provided
        if (request.getPrerequisiteCourseIds() != null) {
            // Clear existing prerequisites
            course.getPrerequisites().clear();

            // Add new prerequisites
            for (Long prereqId : request.getPrerequisiteCourseIds()) {
                if (!courseRepository.existsById(prereqId)) {
                    throw new BadRequestException("Prerequisite course not found with ID: " + prereqId);
                }

                Prerequisite prerequisite = Prerequisite.builder()
                        .course(course)
                        .requiredCourseId(prereqId)
                        .type(PrerequisiteType.HARD)
                        .build();
                course.addPrerequisite(prerequisite);
            }
        }

        Course updatedCourse = courseRepository.save(course);
        log.info("Course updated successfully with ID: {}", updatedCourse.getId());

        return courseMapper.toResponse(updatedCourse);
    }

    /**
     * Publish a course
     * 
     * @param id           Course ID
     * @param instructorId ID of the instructor publishing the course
     * @return Published course response
     */
    @Transactional
    public CourseResponse publishCourse(Long id, Long instructorId) {
        log.info("Publishing course with ID: {} by instructor: {}", id, instructorId);

        Course course = courseRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));

        // Check authorization
        if (!course.getInstructorId().equals(instructorId)) {
            throw new UnauthorizedException("You are not authorized to publish this course");
        }

        // Publish course (will throw exception if validation fails)
        course.publish();

        Course publishedCourse = courseRepository.save(course);
        log.info("Course published successfully with ID: {}", publishedCourse.getId());

        // TODO: Emit COURSE_PUBLISHED event to RabbitMQ

        return courseMapper.toResponse(publishedCourse);
    }

    /**
     * Archive a course
     * 
     * @param id           Course ID
     * @param instructorId ID of the instructor archiving the course
     * @return Archived course response
     */
    @Transactional
    public CourseResponse archiveCourse(Long id, Long instructorId) {
        log.info("Archiving course with ID: {} by instructor: {}", id, instructorId);

        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));

        // Check authorization
        if (!course.getInstructorId().equals(instructorId)) {
            throw new UnauthorizedException("You are not authorized to archive this course");
        }

        course.archive();

        Course archivedCourse = courseRepository.save(course);
        log.info("Course archived successfully with ID: {}", archivedCourse.getId());

        return courseMapper.toResponse(archivedCourse);
    }

    /**
     * Delete a course
     * 
     * @param id           Course ID
     * @param instructorId ID of the instructor deleting the course
     */
    @Transactional
    public void deleteCourse(Long id, Long instructorId) {
        log.info("Deleting course with ID: {} by instructor: {}", id, instructorId);

        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));

        // Check authorization
        if (!course.getInstructorId().equals(instructorId)) {
            throw new UnauthorizedException("You are not authorized to delete this course");
        }

        // Only allow deletion of DRAFT courses
        if (course.getStatus() != CourseStatus.DRAFT) {
            throw new BadRequestException(
                    "Only DRAFT courses can be deleted. Please archive published courses instead.");
        }

        courseRepository.delete(course);
        log.info("Course deleted successfully with ID: {}", id);
    }
}
