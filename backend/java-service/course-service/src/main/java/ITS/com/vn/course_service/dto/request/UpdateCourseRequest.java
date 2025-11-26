package ITS.com.vn.course_service.dto.request;

import ITS.com.vn.course_service.domain.enums.CourseVisibility;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateCourseRequest {

    @Size(max = 255, message = "Title must not exceed 255 characters")
    private String title;

    @Size(max = 5000, message = "Description must not exceed 5000 characters")
    private String description;

    private CourseVisibility visibility;

    @Size(max = 20, message = "Course code must not exceed 20 characters")
    private String code;

    private Integer credits;

    @Size(max = 50, message = "Semester must not exceed 50 characters")
    private String semester;

    @Size(max = 255, message = "Schedule must not exceed 255 characters")
    private String schedule;

    private Integer maxStudents;

    private java.time.LocalDate startDate;

    private java.time.LocalDate endDate;

    @Size(max = 500, message = "Thumbnail URL must not exceed 500 characters")
    private String thumbnailUrl;

    @Size(max = 5000, message = "Objectives must not exceed 5000 characters")
    private String objectives;

    private List<Long> tagIds;

    private List<Long> prerequisiteCourseIds;
}
