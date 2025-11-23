package ITS.com.vn.assessment_service.service;

import ITS.com.vn.assessment_service.dto.request.QuestionRequest;
import ITS.com.vn.assessment_service.dto.response.QuestionResponse;

import java.util.List;

public interface QuestionService {
    QuestionResponse createQuestion(QuestionRequest request);

    QuestionResponse updateQuestion(Long id, QuestionRequest request);

    void deleteQuestion(Long id);

    QuestionResponse getQuestion(Long id);

    List<QuestionResponse> getQuestionsByPool(Long poolId);
}
