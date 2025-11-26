package ITS.com.vn.user_profile_service.mapper;

import ITS.com.vn.user_profile_service.domain.entity.UserSchedule;
import ITS.com.vn.user_profile_service.dto.request.ScheduleRequest;
import ITS.com.vn.user_profile_service.dto.response.ScheduleResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ScheduleMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "profile", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    UserSchedule toEntity(ScheduleRequest request);

    ScheduleResponse toResponse(UserSchedule entity);
}
