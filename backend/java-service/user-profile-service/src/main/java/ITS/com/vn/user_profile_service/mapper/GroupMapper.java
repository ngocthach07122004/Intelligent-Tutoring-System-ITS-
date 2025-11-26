package ITS.com.vn.user_profile_service.mapper;

import ITS.com.vn.user_profile_service.domain.entity.ClassGroup;
import ITS.com.vn.user_profile_service.domain.entity.GroupMember;
import ITS.com.vn.user_profile_service.dto.request.GroupRequest;
import ITS.com.vn.user_profile_service.dto.response.GroupMemberResponse;
import ITS.com.vn.user_profile_service.dto.response.GroupResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface GroupMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "joinCode", ignore = true)
    @Mapping(target = "creatorId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "members", ignore = true)
    ClassGroup toEntity(GroupRequest request);

    @Mapping(target = "role", ignore = true) // Set manually
    @Mapping(target = "memberCount", expression = "java(entity.getMembers() != null ? entity.getMembers().size() : 0)")
    GroupResponse toResponse(ClassGroup entity);

    GroupMemberResponse toMemberResponse(GroupMember entity);
}
