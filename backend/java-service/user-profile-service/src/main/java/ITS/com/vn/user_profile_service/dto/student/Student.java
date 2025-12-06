package ITS.com.vn.user_profile_service.dto.student;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Student {
    private String id;
    private String studentId;
    private String name;
    private String email;
    private String phone;
    private String dateOfBirth;
    private String address;
    private String className; // "class" is a reserved keyword
    private String academicYear;
    private String enrollmentDate;
    private String avatar;
    private String emergencyContact;
    private String bloodType;
    private String medicalNotes;
    private String parentName;
    private String parentPhone;
    private String parentEmail;
}
