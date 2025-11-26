package ITS.com.vn.course_service.dto.response;

import ITS.com.vn.course_service.domain.enums.CourseStatus;
import ITS.com.vn.course_service.domain.enums.CourseVisibility;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseResponse {

    private Long id;
    private String title;
    private String description;
    private CourseStatus status;
    private CourseVisibility visibility;
    private Long instructorId;
    private String instructorName;
    private String instructorAvatarUrl;
    private String thumbnailUrl;
    private String objectives;
    private String code;
    private Integer credits;
    private String semester;
    private String schedule;
    private Integer maxStudents;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer currentStudents;
    private Boolean enrolled;
    private Integer progress;
    private InstructorSummaryResponse instructor;
    private List<TagResponse> tags;
    private List<PrerequisiteResponse> prerequisites;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime publishedAt;
}
