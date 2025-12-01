package ITS.com.vn.user_profile_service.mapper;

import ITS.com.vn.user_profile_service.domain.entity.UserProfile;
import ITS.com.vn.user_profile_service.dto.student.Student;
import ITS.com.vn.user_profile_service.dto.student.AcademicRecord;
import ITS.com.vn.user_profile_service.dto.student.LearningAnalytics;
import ITS.com.vn.user_profile_service.dto.student.CurrentSubject;
import ITS.com.vn.user_profile_service.dto.performance.PerformanceSummary;
import ITS.com.vn.user_profile_service.dto.performance.SemesterPerformance;
import ITS.com.vn.user_profile_service.dto.performance.Skill;
import ITS.com.vn.user_profile_service.domain.entity.UserSkill;
import ITS.com.vn.user_profile_service.dto.external.assessment.GradebookHistoryResponse;
import ITS.com.vn.user_profile_service.dto.external.assessment.AnalyticsResponse;
import ITS.com.vn.user_profile_service.dto.external.assessment.GradebookSummaryResponse;
import ITS.com.vn.user_profile_service.dto.external.course.EnrollmentResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface StudentMapper {

    @Mapping(target = "id", expression = "java(entity.getUserId().toString())")
    @Mapping(target = "name", source = "fullName")
    @Mapping(target = "dateOfBirth", source = "dateOfBirth", dateFormat = "yyyy-MM-dd")
    @Mapping(target = "enrollmentDate", source = "enrollmentDate", dateFormat = "yyyy-MM-dd")
    @Mapping(target = "avatar", source = "avatarUrl")
    @Mapping(target = "className", source = "className")
    Student toStudentDto(UserProfile entity);

    @Mapping(target = "id", ignore = true) // ID is not updatable via this DTO usually, or handled in service

    @Mapping(target = "fullName", source = "name")
    @Mapping(target = "dateOfBirth", source = "dateOfBirth", dateFormat = "yyyy-MM-dd")
    @Mapping(target = "avatarUrl", source = "avatar")
    void updateEntityFromDto(Student dto, @MappingTarget UserProfile entity);

    // Map external DTOs to internal DTOs

    // Academic History
    AcademicRecord toAcademicRecord(GradebookHistoryResponse.AcademicRecord external);

    AcademicRecord.SubjectGrade toSubjectGrade(GradebookHistoryResponse.SubjectRecord external);

    List<AcademicRecord> toAcademicRecordList(List<GradebookHistoryResponse.AcademicRecord> externalList);

    // Analytics
    LearningAnalytics toLearningAnalytics(AnalyticsResponse external);

    // Subjects (Enrollment -> CurrentSubject)
    @Mapping(target = "id", source = "courseId") // Using courseId as Subject ID
    @Mapping(target = "name", source = "courseTitle")
    @Mapping(target = "code", source = "courseCode")
    @Mapping(target = "teacher", source = "instructorName")
    @Mapping(target = "credits", source = "courseCredits")
    @Mapping(target = "currentScore", expression = "java(external.getProgress() != null ? external.getProgress().doubleValue() : 0.0)") // Placeholder
                                                                                                                                        // mapping
    @Mapping(target = "attendance", constant = "100.0") // Placeholder
    @Mapping(target = "currentGrade", constant = "N/A") // Placeholder
    @Mapping(target = "progress", expression = "java(mapProgress(external.getProgress()))")
    CurrentSubject toCurrentSubject(EnrollmentResponse external);

    List<CurrentSubject> toCurrentSubjectList(List<EnrollmentResponse> externalList);

    // Performance Mappings
    @Mapping(target = "currentRank.rank", source = "rank")
    @Mapping(target = "currentRank.totalStudents", source = "totalStudents")
    PerformanceSummary toPerformanceSummary(GradebookSummaryResponse external);

    @Mapping(target = "achievements", source = "achievements")
    @Mapping(target = "attendance", source = "attendance")
    @Mapping(target = "totalStudents", source = "totalStudents")
    SemesterPerformance toSemesterPerformance(GradebookHistoryResponse.AcademicRecord external);

    List<SemesterPerformance> toSemesterPerformanceList(List<GradebookHistoryResponse.AcademicRecord> externalList);

    Skill toSkill(UserSkill entity);

    List<Skill> toSkillList(List<UserSkill> entityList);

    default CurrentSubject.ProgressInfo mapProgress(Integer progress) {
        if (progress == null) {
            return null;
        }
        return CurrentSubject.ProgressInfo.builder()
                .completed(progress)
                .total(100)
                .build();
    }
}
