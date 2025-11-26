package ITS.com.vn.user_profile_service.service;

import ITS.com.vn.user_profile_service.dto.request.ScheduleRequest;
import ITS.com.vn.user_profile_service.dto.response.ScheduleResponse;

import java.time.Instant;
import java.util.List;

public interface ScheduleService {
    List<ScheduleResponse> getMySchedule(Instant from, Instant to);

    ScheduleResponse createSlot(ScheduleRequest request);

    void deleteSlot(Long id);
}
