package ITS.com.vn.assessment_service.service;

import ITS.com.vn.assessment_service.dto.request.QuestionPoolRequest;
import ITS.com.vn.assessment_service.dto.response.QuestionPoolResponse;

import java.util.List;

public interface QuestionPoolService {
    QuestionPoolResponse createPool(QuestionPoolRequest request);

    QuestionPoolResponse updatePool(Long id, QuestionPoolRequest request);

    void deletePool(Long id);

    QuestionPoolResponse getPool(Long id);

    List<QuestionPoolResponse> getMyPools();
}
