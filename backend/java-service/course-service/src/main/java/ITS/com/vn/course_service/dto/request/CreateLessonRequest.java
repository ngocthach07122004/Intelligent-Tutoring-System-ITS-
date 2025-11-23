package ITS.com.vn.course_service.dto.request;

import ITS.com.vn.course_service.domain.enums.LessonType;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateLessonRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must not exceed 255 characters")
    private String title;

    @Size(max = 5000, message = "Description must not exceed 5000 characters")
    private String description;

    @NotNull(message = "Lesson type is required")
    private LessonType type;

    @DecimalMin(value = "0.0", message = "Mastery threshold must be at least 0")
    @DecimalMax(value = "1.0", message = "Mastery threshold must not exceed 1.0")
    private Double masteryThreshold;

    private String content; // For TEXT type lessons

    private Integer estimatedDuration; // in minutes
}
