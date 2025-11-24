package ITS.com.vn.user_profile_service.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "user_profile")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private UUID userId;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(nullable = false)
    @Builder.Default
    private String timezone = "UTC";

    @Column(name = "avatar_url", length = 512)
    private String avatarUrl;

    @Column(name = "learning_style", length = 50)
    private String learningStyle; // VISUAL, AUDITORY, etc.

    // ========== Thông tin cá nhân ==========
    @Column(name = "student_id", unique = true, length = 50)
    private String studentId; // Mã số sinh viên

    @Column(name = "full_name", length = 255)
    private String fullName;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "address", length = 500)
    private String address;

    @Column(name = "gender", length = 20)
    private String gender; // MALE, FEMALE, OTHER

    // ========== Thông tin học vụ ==========
    @Column(name = "class_id", length = 50)
    private String classId; // Lớp sinh hoạt

    @Column(name = "class_name", length = 100)
    private String className;

    @Column(name = "academic_year", length = 20)
    private String academicYear; // "2023-2024"

    @Column(name = "enrollment_date")
    private LocalDate enrollmentDate; // Ngày nhập học

    // ========== Thông tin phụ huynh ==========
    @Column(name = "parent_name", length = 255)
    private String parentName;

    @Column(name = "parent_phone", length = 20)
    private String parentPhone;

    @Column(name = "parent_email", length = 255)
    private String parentEmail;

    // ========== Thông tin y tế/khẩn cấp ==========
    @Column(name = "emergency_contact", length = 20)
    private String emergencyContact; // SĐT khẩn cấp

    @Column(name = "blood_type", length = 10)
    private String bloodType;

    @Column(name = "medical_notes", columnDefinition = "TEXT")
    private String medicalNotes; // Ghi chú y tế

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private Instant updatedAt;

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<LearningAttribute> learningAttributes = new ArrayList<>();

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<UserSchedule> schedules = new ArrayList<>();

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<UserSkill> skills = new ArrayList<>();
}
