package ITS.com.vn.user_profile_service.controller;

import ITS.com.vn.user_profile_service.domain.enums.GroupRole;
import ITS.com.vn.user_profile_service.dto.request.GroupRequest;
import ITS.com.vn.user_profile_service.dto.request.JoinGroupRequest;
import ITS.com.vn.user_profile_service.dto.request.PromoteMemberRequest;
import ITS.com.vn.user_profile_service.dto.response.GroupMemberResponse;
import ITS.com.vn.user_profile_service.dto.response.GroupResponse;
import ITS.com.vn.user_profile_service.service.GroupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/groups")
@RequiredArgsConstructor
public class GroupController {

    private final GroupService groupService;

    @PostMapping
    public ResponseEntity<GroupResponse> createGroup(@Valid @RequestBody GroupRequest request) {
        return ResponseEntity.ok(groupService.createGroup(request));
    }

    @PostMapping("/join")
    public ResponseEntity<Void> joinGroup(@Valid @RequestBody JoinGroupRequest request) {
        groupService.joinGroup(request.getJoinCode());
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<GroupResponse>> getMyGroups(@RequestParam(required = false) GroupRole role) {
        return ResponseEntity.ok(groupService.getMyGroups(role));
    }

    @GetMapping("/{id}/members")
    public ResponseEntity<List<GroupMemberResponse>> getGroupMembers(@PathVariable Long id) {
        return ResponseEntity.ok(groupService.getGroupMembers(id));
    }

    @DeleteMapping("/{id}/members/{userId}")
    public ResponseEntity<Void> removeMember(@PathVariable Long id, @PathVariable UUID userId) {
        groupService.removeMember(id, userId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/members/{userId}/role")
    public ResponseEntity<Void> promoteMember(
            @PathVariable Long id,
            @PathVariable UUID userId,
            @Valid @RequestBody PromoteMemberRequest request) {
        groupService.promoteMember(id, userId, request.getRole());
        return ResponseEntity.ok().build();
    }
}
