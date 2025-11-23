package ITS.com.vn.course_service.mapper;

import ITS.com.vn.course_service.domain.entity.*;
import ITS.com.vn.course_service.dto.request.CreateChapterRequest;
import ITS.com.vn.course_service.dto.request.CreateCourseRequest;
import ITS.com.vn.course_service.dto.request.CreateLessonRequest;
import ITS.com.vn.course_service.dto.response.*;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CourseMapper {

    // Course mappings
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "versions", ignore = true)
    @Mapping(target = "courseTags", ignore = true)
    @Mapping(target = "prerequisites", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "publishedAt", ignore = true)
    Course toEntity(CreateCourseRequest request);

    @Mapping(target = "tags", source = "courseTags")
    @Mapping(target = "prerequisites", source = "prerequisites")
    CourseResponse toResponse(Course course);

    List<CourseResponse> toResponseList(List<Course> courses);

    // CourseTag to TagResponse
    @Mapping(target = "id", source = "tag.id")
    @Mapping(target = "name", source = "tag.name")
    @Mapping(target = "type", source = "tag.type")
    @Mapping(target = "description", source = "tag.description")
    TagResponse courseTagToTagResponse(CourseTag courseTag);

    // Prerequisite mappings
    @Mapping(target = "requiredCourseTitle", ignore = true)
    PrerequisiteResponse toPrerequisiteResponse(Prerequisite prerequisite);

    // Chapter mappings
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "sequence", ignore = true)
    @Mapping(target = "lessons", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Chapter toEntity(CreateChapterRequest request);

    @Mapping(target = "lessons", source = "lessons")
    ChapterResponse toResponse(Chapter chapter);

    List<ChapterResponse> toChapterResponseList(List<Chapter> chapters);

    // Lesson mappings
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "chapter", ignore = true)
    @Mapping(target = "sequence", ignore = true)
    @Mapping(target = "assets", ignore = true)
    @Mapping(target = "assignments", ignore = true)
    @Mapping(target = "adaptiveRules", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Lesson toEntity(CreateLessonRequest request);

    @Mapping(target = "isCompleted", ignore = true)
    @Mapping(target = "nextLessonId", ignore = true)
    LessonResponse toResponse(Lesson lesson);

    List<LessonResponse> toLessonResponseList(List<Lesson> lessons);

    // Tag mappings
    TagResponse toResponse(Tag tag);

    List<TagResponse> toTagResponseList(List<Tag> tags);
}
