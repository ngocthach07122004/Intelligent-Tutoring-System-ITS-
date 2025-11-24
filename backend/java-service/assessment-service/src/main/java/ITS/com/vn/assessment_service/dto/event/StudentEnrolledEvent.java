package ITS.com.vn.assessment_service.dto.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Event nhận từ Course Service khi student enroll
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentEnrolledEvent {

    private Long enrollmentId;
    private Long courseId;
    private String courseCode;
    private String courseTitle;
    private Long studentId;
    private LocalDateTime enrolledAt;
    private String eventType;
    private LocalDateTime timestamp;
}
