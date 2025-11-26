package ITS.com.vn.user_profile_service.controller;

import ITS.com.vn.user_profile_service.dto.request.ScheduleRequest;
import ITS.com.vn.user_profile_service.dto.response.ScheduleResponse;
import ITS.com.vn.user_profile_service.service.ScheduleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/v1/schedules")
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleService scheduleService;

    @GetMapping
    public ResponseEntity<List<ScheduleResponse>> getMySchedule(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to) {
        return ResponseEntity.ok(scheduleService.getMySchedule(from, to));
    }

    @PostMapping
    public ResponseEntity<ScheduleResponse> createSlot(@Valid @RequestBody ScheduleRequest request) {
        return ResponseEntity.ok(scheduleService.createSlot(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSlot(@PathVariable Long id) {
        scheduleService.deleteSlot(id);
        return ResponseEntity.noContent().build();
    }
}
