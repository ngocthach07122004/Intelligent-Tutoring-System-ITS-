package ITS.com.vn.user_profile_service.service.impl;

import ITS.com.vn.user_profile_service.client.AssessmentServiceClient;
import ITS.com.vn.user_profile_service.domain.entity.UserProfile;
import ITS.com.vn.user_profile_service.domain.entity.UserSkill;
import ITS.com.vn.user_profile_service.dto.external.assessment.GradebookHistoryResponse;
import ITS.com.vn.user_profile_service.dto.external.assessment.GradebookSummaryResponse;
import ITS.com.vn.user_profile_service.dto.performance.PerformanceSummary;
import ITS.com.vn.user_profile_service.dto.performance.SemesterPerformance;
import ITS.com.vn.user_profile_service.dto.performance.Skill;
import jakarta.persistence.EntityNotFoundException;
import ITS.com.vn.user_profile_service.mapper.StudentMapper;
import ITS.com.vn.user_profile_service.repository.UserProfileRepository;
import ITS.com.vn.user_profile_service.repository.UserSkillRepository;
import ITS.com.vn.user_profile_service.service.PerformanceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PerformanceServiceImpl implements PerformanceService {

    private final AssessmentServiceClient assessmentServiceClient;
    private final UserProfileRepository userProfileRepository;
    private final UserSkillRepository userSkillRepository;
    private final StudentMapper studentMapper;

    @Override
    public PerformanceSummary getPerformanceSummary(UUID studentId) {
        log.info("Fetching performance summary for student: {}", studentId);

        // Fetch summary from assessment-service
        GradebookSummaryResponse assessmentSummary = assessmentServiceClient.getStudentSummary(studentId);

        // Map to internal DTO
        PerformanceSummary summary = studentMapper.toPerformanceSummary(assessmentSummary);

        // Enrich with achievements count (Mock or fetch if available)
        // For now, we'll leave it as mapped (0) or fetch if we add an endpoint
        // summary.setTotalAchievements(fetchAchievementCount(studentId));

        return summary;
    }

    @Override
    public List<SemesterPerformance> getSemesterPerformance(UUID studentId) {
        log.info("Fetching semester performance for student: {}", studentId);

        // Fetch history from assessment-service
        GradebookHistoryResponse history = assessmentServiceClient.getStudentHistory(studentId);

        if (history == null || history.getRecords() == null) {
            return Collections.emptyList();
        }

        return studentMapper.toSemesterPerformanceList(history.getRecords());
    }

    @Override
    public List<Skill> getStudentSkills(UUID studentId) {
        log.info("Fetching skills for student: {}", studentId);

        UserProfile profile = userProfileRepository.findByUserId(studentId)
                .orElseThrow(() -> new EntityNotFoundException("User profile not found for id: " + studentId));

        List<UserSkill> skills = userSkillRepository.findByProfileId(profile.getId());

        return studentMapper.toSkillList(skills);
    }
}
