package ITS.com.vn.user_profile_service.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.Instant;

@Data
public class ScheduleRequest {
    private String title;

    @NotNull(message = "Start time is required")
    private Instant startTime;

    @NotNull(message = "End time is required")
    private Instant endTime;

    private Boolean isRecurring;
    private String recurrenceRule;
}
