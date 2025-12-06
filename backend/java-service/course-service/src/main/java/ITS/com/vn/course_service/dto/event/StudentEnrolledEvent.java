package ITS.com.vn.course_service.dto.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Event được emit khi student enroll vào course
 * Assessment Service sẽ lắng nghe để tạo Gradebook entry
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
    private String studentId;
    private LocalDateTime enrolledAt;
    private String eventType; // "STUDENT_ENROLLED"
    private LocalDateTime timestamp;
}
