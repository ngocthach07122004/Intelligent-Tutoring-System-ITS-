package ITS.com.vn.user_profile_service.service;

import ITS.com.vn.user_profile_service.dto.performance.PerformanceSummary;
import ITS.com.vn.user_profile_service.dto.performance.SemesterPerformance;
import ITS.com.vn.user_profile_service.dto.performance.Skill;

import java.util.List;
import java.util.UUID;

public interface PerformanceService {
    PerformanceSummary getPerformanceSummary(UUID studentId);

    List<SemesterPerformance> getSemesterPerformance(UUID studentId);

    List<Skill> getStudentSkills(UUID studentId);
}
