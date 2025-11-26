package ITS.com.vn.user_profile_service.service;

import ITS.com.vn.user_profile_service.domain.enums.GroupRole;
import ITS.com.vn.user_profile_service.dto.request.GroupRequest;
import ITS.com.vn.user_profile_service.dto.response.GroupMemberResponse;
import ITS.com.vn.user_profile_service.dto.response.GroupResponse;

import java.util.List;
import java.util.UUID;

public interface GroupService {
    GroupResponse createGroup(GroupRequest request);

    void joinGroup(String joinCode);

    List<GroupResponse> getMyGroups(GroupRole role);

    List<GroupMemberResponse> getGroupMembers(Long groupId);

    void removeMember(Long groupId, UUID userId);

    void promoteMember(Long groupId, UUID userId, GroupRole role);
}
