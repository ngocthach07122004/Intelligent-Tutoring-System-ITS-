package ITS.com.vn.course_service.dto.response;

import ITS.com.vn.course_service.domain.enums.LessonType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonResponse {

    private Long id;
    private String title;
    private String description;
    private LessonType type;
    private Integer sequence;
    private Double masteryThreshold;
    private String content;
    private Integer estimatedDuration;
    private Boolean isCompleted; // Computed for current user
    private Long nextLessonId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
