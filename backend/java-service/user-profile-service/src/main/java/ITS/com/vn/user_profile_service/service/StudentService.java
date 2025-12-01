package ITS.com.vn.user_profile_service.service;

import ITS.com.vn.user_profile_service.dto.student.*;

import java.util.List;
import java.util.UUID;

public interface StudentService {
    Student getStudentProfile(UUID studentId);

    Student updateStudentProfile(UUID studentId, Student studentDto);

    List<AcademicRecord> getStudentAcademicHistory(UUID studentId);

    LearningAnalytics getStudentAnalytics(UUID studentId, String timeframe);

    List<CurrentSubject> getStudentSubjects(UUID studentId);

    CurrentSubject getStudentSubject(UUID studentId, String subjectId);

    List<Achievement> getStudentAchievements(UUID studentId);
}
