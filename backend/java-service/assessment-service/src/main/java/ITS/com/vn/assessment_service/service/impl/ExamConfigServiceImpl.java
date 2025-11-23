package ITS.com.vn.assessment_service.service.impl;

import ITS.com.vn.assessment_service.domain.entity.ExamConfig;
import ITS.com.vn.assessment_service.domain.entity.ExamSectionRule;
import ITS.com.vn.assessment_service.domain.entity.QuestionPool;
import ITS.com.vn.assessment_service.dto.request.ExamConfigRequest;
import ITS.com.vn.assessment_service.dto.request.ExamSectionRuleRequest;
import ITS.com.vn.assessment_service.dto.response.ExamConfigResponse;
import ITS.com.vn.assessment_service.mapper.ExamConfigMapper;
import ITS.com.vn.assessment_service.repository.ExamConfigRepository;
import ITS.com.vn.assessment_service.repository.QuestionPoolRepository;
import ITS.com.vn.assessment_service.service.ExamConfigService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ExamConfigServiceImpl implements ExamConfigService {

    private final ExamConfigRepository examConfigRepository;
    private final QuestionPoolRepository questionPoolRepository;
    private final ExamConfigMapper examConfigMapper;

    @Override
    public ExamConfigResponse createExamConfig(ExamConfigRequest request) {
        ExamConfig examConfig = examConfigMapper.toEntity(request);
        examConfig.setInstructorId(getCurrentUserId());

        if (request.getSections() != null) {
            List<ExamSectionRule> sections = new ArrayList<>();
            for (ExamSectionRuleRequest sectionRequest : request.getSections()) {
                QuestionPool pool = questionPoolRepository.findById(sectionRequest.getPoolId())
                        .orElseThrow(() -> new EntityNotFoundException(
                                "Question Pool not found: " + sectionRequest.getPoolId()));

                ExamSectionRule section = examConfigMapper.toSectionEntity(sectionRequest);
                section.setPool(pool);
                section.setExamConfig(examConfig);
                sections.add(section);
            }
            examConfig.setSections(sections);
        }

        examConfig = examConfigRepository.save(examConfig);
        return examConfigMapper.toResponse(examConfig);
    }

    @Override
    public ExamConfigResponse updateExamConfig(Long id, ExamConfigRequest request) {
        ExamConfig examConfig = examConfigRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Exam Config not found"));

        examConfigMapper.updateEntityFromRequest(request, examConfig);

        // Re-build sections if provided (simple replacement strategy for now)
        if (request.getSections() != null) {
            examConfig.getSections().clear();
            for (ExamSectionRuleRequest sectionRequest : request.getSections()) {
                QuestionPool pool = questionPoolRepository.findById(sectionRequest.getPoolId())
                        .orElseThrow(() -> new EntityNotFoundException(
                                "Question Pool not found: " + sectionRequest.getPoolId()));

                ExamSectionRule section = examConfigMapper.toSectionEntity(sectionRequest);
                section.setPool(pool);
                section.setExamConfig(examConfig);
                examConfig.getSections().add(section);
            }
        }

        examConfig = examConfigRepository.save(examConfig);
        return examConfigMapper.toResponse(examConfig);
    }

    @Override
    @Transactional(readOnly = true)
    public ExamConfigResponse getExamConfig(Long id) {
        ExamConfig examConfig = examConfigRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Exam Config not found"));
        return examConfigMapper.toResponse(examConfig);
    }

    @Override
    public void deleteExamConfig(Long id) {
        if (!examConfigRepository.existsById(id)) {
            throw new EntityNotFoundException("Exam Config not found");
        }
        examConfigRepository.deleteById(id);
    }

    private String getCurrentUserId() {
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            return SecurityContextHolder.getContext().getAuthentication().getName();
        }
        return "system";
    }
}
