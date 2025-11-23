package ITS.com.vn.user_profile_service.repository;

import ITS.com.vn.user_profile_service.domain.entity.GroupMember;
import ITS.com.vn.user_profile_service.domain.enums.GroupRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface GroupMemberRepository extends JpaRepository<GroupMember, Long> {
    List<GroupMember> findByStudentId(UUID studentId);

    List<GroupMember> findByStudentIdAndRole(UUID studentId, GroupRole role);

    Optional<GroupMember> findByGroupIdAndStudentId(Long groupId, UUID studentId);

    List<GroupMember> findByGroupId(Long groupId);

    boolean existsByGroupIdAndStudentId(Long groupId, UUID studentId);
}
