package ITS.com.vn.user_profile_service.dto.response;

import lombok.Data;
import java.time.Instant;

@Data
public class ScheduleResponse {
    private Long id;
    private String title;
    private Instant startTime;
    private Instant endTime;
    private Boolean isRecurring;
    private String recurrenceRule;
}
