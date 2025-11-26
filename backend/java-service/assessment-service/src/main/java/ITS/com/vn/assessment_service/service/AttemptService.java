package ITS.com.vn.assessment_service.service;

import ITS.com.vn.assessment_service.dto.request.AttemptSubmitRequest;
import ITS.com.vn.assessment_service.dto.response.AttemptResultResponse;
import ITS.com.vn.assessment_service.dto.response.AttemptStartResponse;
import ITS.com.vn.assessment_service.dto.response.AttemptSubmitResponse;

public interface AttemptService {
    AttemptStartResponse startAttempt(Long examConfigId);

    AttemptSubmitResponse submitAttempt(Long attemptId, AttemptSubmitRequest request);

    AttemptResultResponse getAttemptResult(Long attemptId);
}
