package ITS.com.vn.user_profile_service.service.impl;

import ITS.com.vn.user_profile_service.domain.entity.ClassGroup;
import ITS.com.vn.user_profile_service.domain.entity.GroupMember;
import ITS.com.vn.user_profile_service.domain.enums.GroupRole;
import ITS.com.vn.user_profile_service.dto.request.GroupRequest;
import ITS.com.vn.user_profile_service.dto.response.GroupMemberResponse;
import ITS.com.vn.user_profile_service.dto.response.GroupResponse;
import ITS.com.vn.user_profile_service.mapper.GroupMapper;
import ITS.com.vn.user_profile_service.repository.ClassGroupRepository;
import ITS.com.vn.user_profile_service.repository.GroupMemberRepository;
import ITS.com.vn.user_profile_service.service.GroupService;
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
public class GroupServiceImpl implements GroupService {

    private final ClassGroupRepository classGroupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final GroupMapper groupMapper;

    @Override
    public GroupResponse createGroup(GroupRequest request) {
        UUID userId = getCurrentUserId();
        // Role check (TEACHER) should be done via PreAuthorize or similar, assuming
        // handled by Controller/Security config

        ClassGroup group = groupMapper.toEntity(request);
        group.setCreatorId(userId);
        group.setJoinCode(generateJoinCode());
        group = classGroupRepository.save(group);

        // Add creator as LEADER
        GroupMember member = GroupMember.builder()
                .group(group)
                .studentId(userId)
                .role(GroupRole.LEADER)
                .joinedAt(Instant.now())
                .build();
        groupMemberRepository.save(member);

        GroupResponse response = groupMapper.toResponse(group);
        response.setRole(GroupRole.LEADER);
        return response;
    }

    @Override
    public void joinGroup(String joinCode) {
        UUID userId = getCurrentUserId();
        ClassGroup group = classGroupRepository.findByJoinCode(joinCode)
                .orElseThrow(() -> new EntityNotFoundException("Group not found with code: " + joinCode));

        if (groupMemberRepository.existsByGroupIdAndStudentId(group.getId(), userId)) {
            throw new IllegalStateException("You are already a member of this group");
        }

        GroupMember member = GroupMember.builder()
                .group(group)
                .studentId(userId)
                .role(GroupRole.MEMBER)
                .joinedAt(Instant.now())
                .build();
        groupMemberRepository.save(member);

        // TODO: Publish GROUP_JOINED event
    }

    @Override
    @Transactional(readOnly = true)
    public List<GroupResponse> getMyGroups(GroupRole role) {
        UUID userId = getCurrentUserId();
        List<GroupMember> memberships;
        if (role != null) {
            memberships = groupMemberRepository.findByStudentIdAndRole(userId, role);
        } else {
            memberships = groupMemberRepository.findByStudentId(userId);
        }

        return memberships.stream()
                .map(m -> {
                    GroupResponse res = groupMapper.toResponse(m.getGroup());
                    res.setRole(m.getRole());
                    return res;
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<GroupMemberResponse> getGroupMembers(Long groupId) {
        UUID userId = getCurrentUserId();
        // Check if user is member of the group
        if (!groupMemberRepository.existsByGroupIdAndStudentId(groupId, userId)) {
            throw new SecurityException("You are not a member of this group");
        }

        return groupMemberRepository.findByGroupId(groupId).stream()
                .map(groupMapper::toMemberResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void removeMember(Long groupId, UUID memberId) {
        UUID currentUserId = getCurrentUserId();
        GroupMember currentMember = groupMemberRepository.findByGroupIdAndStudentId(groupId, currentUserId)
                .orElseThrow(() -> new SecurityException("You are not a member of this group"));

        if (currentMember.getRole() != GroupRole.LEADER) {
            throw new SecurityException("Only leaders can remove members");
        }

        GroupMember targetMember = groupMemberRepository.findByGroupIdAndStudentId(groupId, memberId)
                .orElseThrow(() -> new EntityNotFoundException("Member not found in group"));

        groupMemberRepository.delete(targetMember);
    }

    @Override
    public void promoteMember(Long groupId, UUID memberId, GroupRole role) {
        UUID currentUserId = getCurrentUserId();
        GroupMember currentMember = groupMemberRepository.findByGroupIdAndStudentId(groupId, currentUserId)
                .orElseThrow(() -> new SecurityException("You are not a member of this group"));

        if (currentMember.getRole() != GroupRole.LEADER) {
            throw new SecurityException("Only leaders can promote members");
        }

        GroupMember targetMember = groupMemberRepository.findByGroupIdAndStudentId(groupId, memberId)
                .orElseThrow(() -> new EntityNotFoundException("Member not found in group"));

        targetMember.setRole(role);
        groupMemberRepository.save(targetMember);
    }

    private String generateJoinCode() {
        return UUID.randomUUID().toString().substring(0, 8).toUpperCase();
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
