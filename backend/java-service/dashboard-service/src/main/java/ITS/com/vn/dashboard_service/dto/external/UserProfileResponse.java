package ITS.com.vn.dashboard_service.dto.external;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {
    private UUID id;
    private UUID userId;
    private String fullName;
    private String email;
    private String avatarUrl;
    private String bio;
    private String phone;
    private LocalDate dateOfBirth;
    private String address;
    private String gender;
    private String classId;
    private String className;
    private String academicYear;
}
