package ITS.com.vn.user_profile_service.mapper;

import ITS.com.vn.user_profile_service.domain.entity.UserProfile;
import ITS.com.vn.user_profile_service.dto.request.UserProfileRequest;
import ITS.com.vn.user_profile_service.dto.response.UserProfileResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserProfileMapper {
    UserProfileResponse toResponse(UserProfile entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "learningAttributes", ignore = true)
    @Mapping(target = "schedules", ignore = true)
    void updateEntityFromRequest(UserProfileRequest request, @MappingTarget UserProfile entity);
}
