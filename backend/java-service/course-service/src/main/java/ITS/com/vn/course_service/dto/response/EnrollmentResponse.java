package ITS.com.vn.course_service.dto.response;

import ITS.com.vn.course_service.domain.enums.EnrollmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentResponse {

    private Long id;
    private Long courseId;
    private String courseTitle;
    private String courseCode;
    private String courseSemester;
    private String courseSchedule;
    private Integer courseCredits;
    private Integer courseMaxStudents;
    private String courseThumbnailUrl;
    private String instructorName;
    private String instructorAvatarUrl;
    private Long studentId;
    private EnrollmentStatus status;
    private Integer progress;
    private LocalDateTime enrolledAt;
    private LocalDateTime completedAt;
    private LocalDateTime lastAccessAt;
    private LocalDateTime updatedAt;
}
