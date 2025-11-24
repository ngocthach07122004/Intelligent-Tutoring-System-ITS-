package ITS.com.vn.user_profile_service.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UserProfileRequest {
    @Size(max = 500, message = "Bio must be less than 500 characters")
    private String bio;

    @Size(max = 50, message = "Timezone must be less than 50 characters")
    private String timezone;

    @Size(max = 50, message = "Learning style must be less than 50 characters")
    private String learningStyle;

    @Size(max = 512, message = "Avatar URL must be less than 512 characters")
    private String avatarUrl;

    // Personal info
    @Size(max = 50, message = "Student ID must be less than 50 characters")
    private String studentId;

    @Size(max = 255, message = "Full name must be less than 255 characters")
    private String fullName;

    @Size(max = 20, message = "Phone number must be less than 20 characters")
    private String phone;

    private LocalDate dateOfBirth;

    @Size(max = 500, message = "Address must be less than 500 characters")
    private String address;

    @Size(max = 20, message = "Gender must be less than 20 characters")
    private String gender;

    // Academic info
    @Size(max = 50, message = "Class ID must be less than 50 characters")
    private String classId;

    @Size(max = 100, message = "Class name must be less than 100 characters")
    private String className;

    @Size(max = 20, message = "Academic year must be less than 20 characters")
    private String academicYear;

    private LocalDate enrollmentDate;

    // Parent info
    @Size(max = 255, message = "Parent name must be less than 255 characters")
    private String parentName;

    @Size(max = 20, message = "Parent phone must be less than 20 characters")
    private String parentPhone;

    @Email(message = "Parent email must be valid")
    @Size(max = 255, message = "Parent email must be less than 255 characters")
    private String parentEmail;

    // Medical/emergency info
    @Size(max = 20, message = "Emergency contact must be less than 20 characters")
    private String emergencyContact;

    @Size(max = 10, message = "Blood type must be less than 10 characters")
    private String bloodType;

    @Size(max = 2000, message = "Medical notes must be less than 2000 characters")
    private String medicalNotes;
}
