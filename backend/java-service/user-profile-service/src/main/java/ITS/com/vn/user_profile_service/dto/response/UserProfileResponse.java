package ITS.com.vn.user_profile_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {

    private Long id;
    private UUID userId;
    private String bio;
    private String timezone;
    private String learningStyle;
    private String avatarUrl;

    // Thông tin cá nhân
    private String studentId;
    private String fullName;
    private String phone;
    private LocalDate dateOfBirth;
    private String address;
    private String gender;

    // Thông tin học vụ
    private String classId;
    private String className;
    private String academicYear;
    private LocalDate enrollmentDate;

    // Thông tin phụ huynh
    private String parentName;
    private String parentPhone;
    private String parentEmail;

    // Thông tin y tế/khẩn cấp
    private String emergencyContact;
    private String bloodType;
    private String medicalNotes;

    // Kỹ năng
    private List<SkillResponse> skills;

    private Instant createdAt;
    private Instant updatedAt;
}
