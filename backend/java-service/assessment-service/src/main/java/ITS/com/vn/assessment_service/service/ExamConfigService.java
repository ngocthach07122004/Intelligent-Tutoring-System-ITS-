package ITS.com.vn.assessment_service.service;

import ITS.com.vn.assessment_service.dto.request.ExamConfigRequest;
import ITS.com.vn.assessment_service.dto.response.ExamConfigResponse;

public interface ExamConfigService {
    ExamConfigResponse createExamConfig(ExamConfigRequest request);

    ExamConfigResponse updateExamConfig(Long id, ExamConfigRequest request);

    ExamConfigResponse getExamConfig(Long id);

    void deleteExamConfig(Long id);
}
