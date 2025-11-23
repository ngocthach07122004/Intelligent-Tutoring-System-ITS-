package ITS.com.vn.user_profile_service.service.impl;

import ITS.com.vn.user_profile_service.domain.entity.UserProfile;
import ITS.com.vn.user_profile_service.domain.entity.UserSchedule;
import ITS.com.vn.user_profile_service.dto.request.ScheduleRequest;
import ITS.com.vn.user_profile_service.dto.response.ScheduleResponse;
import ITS.com.vn.user_profile_service.mapper.ScheduleMapper;
import ITS.com.vn.user_profile_service.repository.UserProfileRepository;
import ITS.com.vn.user_profile_service.repository.UserScheduleRepository;
import ITS.com.vn.user_profile_service.service.ScheduleService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ScheduleServiceImpl implements ScheduleService {

    private final UserScheduleRepository userScheduleRepository;
    private final UserProfileRepository userProfileRepository;
    private final ScheduleMapper scheduleMapper;

    @Override
    @Transactional(readOnly = true)
    public List<ScheduleResponse> getMySchedule(Instant from, Instant to) {
        UUID userId = getCurrentUserId();
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Profile not found"));

        return userScheduleRepository.findByProfileIdAndStartTimeBetween(profile.getId(), from, to).stream()
                .map(scheduleMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ScheduleResponse createSlot(ScheduleRequest request) {
        UUID userId = getCurrentUserId();
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Profile not found"));

        if (request.getStartTime().isAfter(request.getEndTime())) {
            throw new IllegalArgumentException("Start time must be before end time");
        }

        UserSchedule schedule = scheduleMapper.toEntity(request);
        schedule.setProfile(profile);
        schedule = userScheduleRepository.save(schedule);
        return scheduleMapper.toResponse(schedule);
    }

    @Override
    public void deleteSlot(Long id) {
        UUID userId = getCurrentUserId();
        UserSchedule schedule = userScheduleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Schedule slot not found"));

        if (!schedule.getProfile().getUserId().equals(userId)) {
            throw new SecurityException("You are not authorized to delete this slot");
        }

        userScheduleRepository.deleteById(id);
    }

    private UUID getCurrentUserId() {
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            try {
                return UUID.fromString(SecurityContextHolder.getContext().getAuthentication().getName());
            } catch (IllegalArgumentException e) {
                return UUID.randomUUID();
            }
        }
        throw new IllegalStateException("No authenticated user found");
    }
}
